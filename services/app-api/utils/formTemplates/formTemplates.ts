import KSUID from "ksuid";
import assert from "node:assert";
import { createHash } from "crypto";
// types
import {
  AnyObject,
  EntityDetailsOverlayShape,
  FieldChoice,
  FormField,
  FormJson,
  FormLayoutElement,
  FormTemplateVersion,
  OverlayModalPageShape,
  ReportJson,
  ReportJsonFile,
  ReportRoute,
  ReportType,
} from "../types";
// utils
import {
  getReportFormTemplate,
  putFormTemplateVersion,
  putReportFormTemplate,
  queryFormTemplateVersionByHash,
  queryLatestFormTemplateVersionNumber,
} from "../../storage/reports";
import { isFeatureFlagEnabled } from "../featureFlags/featureFlags";
import { transformFormTemplate } from "../transformations/transformations";
// routes
import {
  wpReportJson,
  sarReportJson,
  expenditureReportJson,
} from "../../forms";
// flagged routes
import * as wpFlags from "../../forms/routes/wp/flags";
import * as sarFlags from "../../forms/routes/sar/flags";
import * as expenditureFlags from "../../forms/routes/expenditure/flags";

export const formTemplateForReportType = async (reportType: ReportType) => {
  const routeMap: Record<ReportType, ReportJsonFile> = {
    [ReportType.WP]: wpReportJson,
    [ReportType.SAR]: sarReportJson,
    [ReportType.EXPENDITURE]: expenditureReportJson,
  };
  // Get LaunchDarkly flags from folder names in forms/routes/[reportType]/flags
  const flagMap: Record<ReportType, any> = {
    [ReportType.WP]: wpFlags,
    [ReportType.SAR]: sarFlags,
    [ReportType.EXPENDITURE]: expenditureFlags,
  };

  const flagsByReportType = flagMap[reportType];
  const flagNames = Object.keys(flagsByReportType);

  // Loop through flags and replace routes if flag is enabled
  for (const flagName of flagNames) {
    const enabled = await isFeatureFlagEnabled(flagName);

    if (enabled) {
      routeMap[reportType] = flagsByReportType[flagName];
      break;
    }
  }

  // Clone to prevent accidental changes to the originals
  return structuredClone(routeMap[reportType] as ReportJson);
};

export async function getOrCreateFormTemplate(
  reportType: ReportType,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) {
  let currentFormTemplate = await formTemplateForReportType(reportType);

  if (currentFormTemplate?.routes) {
    currentFormTemplate = transformFormTemplate(
      currentFormTemplate,
      reportPeriod,
      reportYear,
      workPlanFieldData
    );
  }

  const stringifiedTemplate = JSON.stringify(currentFormTemplate);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const matchTemplateVersion = await queryFormTemplateVersionByHash(
    reportType,
    currentTemplateHash
  );

  //if a template of this hash already exist
  if (currentTemplateHash === matchTemplateVersion?.md5Hash) {
    const matchingTemplate = await getReportFormTemplate({
      reportType,
      formTemplateId: matchTemplateVersion.id,
    });
    assert(
      matchingTemplate !== undefined,
      "Found version info matching form template hash, but no matching document exists in S3"
    );
    return {
      formTemplate: matchingTemplate,
      formTemplateVersion: matchTemplateVersion,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;

    const formTemplateWithValidationJson = {
      ...currentFormTemplate,
      validationJson: getValidationFromFormTemplate(currentFormTemplate),
    };

    await putReportFormTemplate(
      {
        reportType,
        formTemplateId: newFormTemplateId,
      },
      formTemplateWithValidationJson
    );

    const latest = await queryLatestFormTemplateVersionNumber(reportType);

    // If we didn't find any form templates, start version at 1.
    const newFormTemplateVersionItem: FormTemplateVersion = {
      versionNumber: latest + 1,
      md5Hash: currentTemplateHash,
      id: newFormTemplateId,
      lastAltered: new Date().toISOString(),
      reportType,
    };

    await putFormTemplateVersion(newFormTemplateVersionItem);

    return {
      formTemplate: formTemplateWithValidationJson,
      formTemplateVersion: newFormTemplateVersionItem,
    };
  }
}

// returns flattened array of valid routes for given reportJson
export const flattenReportRoutesArray = (
  reportJson: ReportRoute[]
): ReportRoute[] => {
  const routesArray: ReportRoute[] = [];
  const mapRoutesToArray = (reportRoutes: ReportRoute[]) => {
    reportRoutes.map((route: ReportRoute) => {
      // if children, recurse; if none, push to routes array
      if (route?.children) {
        mapRoutesToArray(route.children);
      } else {
        routesArray.push(route);
      }
    });
  };
  mapRoutesToArray(reportJson);
  return routesArray;
};

// returns validation schema object for array of fields
export const compileValidationJsonFromFields = (
  fieldArray: FormField[],
  parentOption?: any
): AnyObject => {
  const validationSchema: AnyObject = {};
  fieldArray.forEach((field: FormField) => {
    // if field has a parent option, add option name to validation object
    if (
      typeof field.validation === "object" &&
      !field.validation.parentOptionId
    ) {
      field.validation.parentOptionId = parentOption?.name;
    }
    // compile field's validation schema
    validationSchema[field.id] = field.validation;
    // if field has choices/options (ie could have nested children)
    const fieldChoices = field.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: FieldChoice) => {
        // if given field choice has nested children
        const nestedChildFields = choice.children;
        if (nestedChildFields) {
          Object.assign(
            validationSchema,
            compileValidationJsonFromFields(nestedChildFields, choice)
          );
        }
      });
    }
  });
  return validationSchema;
};

// traverse routes and compile all field validation schema into one object
export const compileValidationJsonFromRoutes = (
  routeArray: ReportRoute[]
): AnyObject => {
  const validationSchema: AnyObject = {};
  const addValidationToAccumulator = (form: FormJson) => {
    Object.assign(
      validationSchema,
      compileValidationJsonFromFields(form.fields.filter(isFieldElement))
    );
  };
  routeArray.forEach((route: ReportRoute) => {
    // check for non-standard needed validation objects
    if (
      (route.pageType === "modalDrawer" ||
        route.pageType === "modalOverlay" ||
        route.pageType === "overlayModal" ||
        route.pageType === "dynamicModalOverlay") &&
      route.entityType
    ) {
      Object.assign(validationSchema, { [route.entityType]: "objectArray" });
    }

    for (let formType of ["form", "modalForm", "drawerForm"] as const) {
      if (route[formType]) {
        addValidationToAccumulator(route[formType]!);
      }
    }

    // accumulate entity steps
    if (route.pageType === "modalOverlay") {
      for (let step of route.entitySteps ?? []) {
        const stepForm = step.form || step.modalForm;
        addValidationToAccumulator(stepForm);
      }
    }

    if (route.pageType === "dynamicModalOverlay") {
      for (let initiative of route.initiatives ?? []) {
        for (let step of initiative.entitySteps) {
          const stepForm = step.form || step.modalForm;
          if (stepForm) {
            addValidationToAccumulator(stepForm);
          } else {
            const { objectiveCards } = step as
              | OverlayModalPageShape
              | EntityDetailsOverlayShape;
            if (objectiveCards) {
              for (let objectiveCard of objectiveCards) {
                if (objectiveCard.modalForm) {
                  addValidationToAccumulator(objectiveCard.modalForm);
                }
              }
            }
          }
        }
      }
    }
  });
  return validationSchema;
};

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  const formLayoutElementTypes = ["sectionHeader", "sectionContent"];
  return !formLayoutElementTypes.includes(field.type);
}

export function isLayoutElement(
  field: FormField | FormLayoutElement
): field is FormLayoutElement {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  return (field as FormField).validation === undefined;
}

export function getValidationFromFormTemplate(reportJson: ReportJson) {
  return compileValidationJsonFromRoutes(
    flattenReportRoutesArray(reportJson.routes)
  );
}

export function getPossibleFieldsFromFormTemplate(reportJson: ReportJson) {
  return Object.keys(getValidationFromFormTemplate(reportJson));
}
