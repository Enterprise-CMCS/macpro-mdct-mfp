import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import wpForm from "../../forms/wp.json";
import sarForm from "../../forms/sar.json";
import s3Lib, { getFormTemplateKey, getTemplate } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../logging";
import {
  AnyObject,
  assertExhaustive,
  FieldChoice,
  FormField,
  FormJson,
  FormLayoutElement,
  FormTemplate,
  ReportJson,
  ReportRoute,
  ReportType,
} from "../types";
import { createHash } from "crypto";
import { transformFormTemplate } from "../transformations/transformations";

export async function getNewestTemplateVersion(reportType: ReportType) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    KeyConditionExpression: `reportType = :reportType`,
    ExpressionAttributeValues: {
      ":reportType": reportType as unknown as AttributeValue,
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
  };
  const result = await dynamodbLib.query(queryParams);
  return result?.Items?.[0];
}

export async function getTemplateVersionByHash(
  reportType: ReportType,
  hash: string
) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "HashIndex",
    KeyConditionExpression: "reportType = :reportType AND md5Hash = :md5Hash",
    Limit: 1,
    ExpressionAttributeValues: {
      ":md5Hash": hash as AttributeValue,
      ":reportType": reportType as unknown as AttributeValue,
    },
  };
  const result = await dynamodbLib.query(queryParams);
  return result?.Items?.[0];
}

export const formTemplateForReportType = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.WP:
      return wpForm as ReportJson;
    case ReportType.SAR:
      return sarForm as ReportJson;
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) {
  //Make a copy of the form template so we don't accidentally corrupt the original
  let currentFormTemplate = structuredClone(
    formTemplateForReportType(reportType)
  );

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

  const matchTemplateVersion = await getTemplateVersionByHash(
    reportType,
    currentTemplateHash
  );

  //if a template of this hash already exist
  if (currentTemplateHash === matchTemplateVersion?.md5Hash) {
    return {
      formTemplate: await getTemplate(
        reportBucket,
        getFormTemplateKey(matchTemplateVersion?.id)
      ),
      formTemplateVersion: matchTemplateVersion,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;

    const formTemplateWithValidationJson = {
      ...currentFormTemplate,
      validationJson: getValidationFromFormTemplate(currentFormTemplate),
    };

    //saving new version of the formTemplate to the database
    try {
      await s3Lib.put({
        Key: getFormTemplateKey(newFormTemplateId),
        Body: JSON.stringify(formTemplateWithValidationJson),
        ContentType: "application/json",
        Bucket: reportBucket,
      });
    } catch (err) {
      logger.error(err, "Error uploading new form template to S3");
      throw err;
    }

    //getting the latest version so that if there isn't a match, we can use this to save to the next iteration
    const mostRecentTemplateVersion = await getNewestTemplateVersion(
      reportType
    );

    // If we didn't find any form templates, start version at 1.
    const newFormTemplateVersionItem: FormTemplate = {
      versionNumber: mostRecentTemplateVersion?.versionNumber
        ? (mostRecentTemplateVersion.versionNumber += 1)
        : 1,
      md5Hash: currentTemplateHash,
      id: newFormTemplateId,
      lastAltered: new Date().toISOString(),
      reportType,
    };

    try {
      await dynamodbLib.put({
        TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
        Item: newFormTemplateVersionItem,
      });
    } catch (err) {
      logger.error(
        err,
        "Error writing a new form template version to DynamoDB."
      );
      throw err;
    }

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
            if (step.objectiveCards) {
              for (let objectiveCard of step.objectiveCards) {
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
