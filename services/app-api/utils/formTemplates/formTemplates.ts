import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";
import wpForm from "../../forms/wp.json";
import sarForm from "../../forms/sar.json";
import s3Lib, { getFormTemplateKey } from "../s3/s3-lib";
import KSUID from "ksuid";
import { logger } from "../logging";
import {
  AnyObject,
  assertExhaustive,
  EntityDetailsOverlayShape,
  FieldChoice,
  FormField,
  FormLayoutElement,
  FormTemplate,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  ReportJson,
  ReportRoute,
  ReportType,
} from "../types";
import { getTemplate } from "../../handlers/formTemplates/populateTemplatesTable";
import { createHash } from "crypto";
import {
  calculateCurrentQuarter,
  calculateCurrentYear,
  incrementQuarterAndYear,
} from "../time/time";

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
  return result.Items?.[0];
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

export const nextTwelveQuartersKeys = (fieldId: string) => {
  let quarter = calculateCurrentQuarter();
  let year = calculateCurrentYear();
  const keys: (string[] | number[])[][] = [];
  for (let i = 0; i < 12; i++) {
    keys.push([[fieldId], [year], [quarter]]);
    [quarter, year] = incrementQuarterAndYear(quarter, year);
  }
  return keys;
};

export const nextTwelveQuarters = (
  formFields: FormField[],
  fieldIndex: number,
  fieldToRepeat: FormField
) => {
  var keys = nextTwelveQuartersKeys(fieldToRepeat.id);
  for (let key of keys) {
    const formField: FormField = {
      ...fieldToRepeat,
      id: `${key[0]}${key[1]}Q${key[2]}`,
      type: fieldToRepeat?.type,
      validation: fieldToRepeat.validation,
      props: {
        ...fieldToRepeat?.props,
        label: `${key[1]} Q${key[2]}`,
      },
    };
    formFields.push(formField);
  }
  formFields.splice(fieldIndex, 1);
  return formFields;
};

export const targetPopulationsByQuarterKeys = (
  fieldId: string,
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  var targetPopulations = workPlanFieldData?.targetPopulations;
  const keys = [];
  for (let population of targetPopulations) {
    keys.push([
      workPlanMetaData?.reportPeriod,
      fieldId,
      population.transitionBenchmarks_targetPopulationName,
    ]);
  }
  return keys;
};

export const targetPopulationsByQuarter = (
  formFields: FormField[],
  fieldToRepeat: FormField,
  quarter: number,
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  var keys = targetPopulationsByQuarterKeys(
    fieldToRepeat.id,
    workPlanFieldData,
    workPlanMetaData
  );

  if (quarter == 1) {
    const contentString =
      workPlanMetaData?.reportPeriod == 1
        ? "First quarter (January 1 - March 31)"
        : "Third quarter (July 1 - September 30)";
    const formFieldHeader: FormField = {
      id: `Period${workPlanMetaData?.reportPeriod}_Q1_header`,
      type: "sectionHeader",
      props: {
        content: contentString,
      },
    };
    formFields.push(formFieldHeader);
  } else if (quarter == 2) {
    const contentString =
      workPlanMetaData?.reportPeriod == 1
        ? "Second quarter (April 1 - June 30)"
        : "Fourth quarter (October 1 - December 31)";
    const formFieldHeader: FormField = {
      id: `Period${workPlanMetaData?.reportPeriod}_Q2_header`,
      type: "sectionHeader",
      props: {
        content: contentString,
      },
    };
    formFields.push(formFieldHeader);
  }

  for (let key of keys) {
    const formField: FormField = {
      ...fieldToRepeat,
      id: `Period${key[0]}_Q${quarter}_${key[2]}${key[2]}`,
      type: fieldToRepeat?.type,
      validation: fieldToRepeat.validation,
      props: {
        ...fieldToRepeat?.props,
        label: `Number of ${key[2]}`,
      },
    };
    formFields.push(formField);
  }

  return formFields;
};

export const targetPopulationsByReportingPeriod = (
  formFields: FormField[],
  fieldIndex: number,
  fieldToRepeat: FormField,
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  targetPopulationsByQuarter(
    formFields,
    fieldToRepeat,
    1,
    workPlanFieldData,
    workPlanMetaData
  );

  targetPopulationsByQuarter(
    formFields,
    fieldToRepeat,
    2,
    workPlanFieldData,
    workPlanMetaData
  );

  formFields.splice(fieldIndex, 1);
  return formFields;
};

export const expandRepeatedFields = (
  formFields: FormField[],
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  const repeatingFieldRuleMap: AnyObject = {
    nextTwelveQuarters: nextTwelveQuarters,
    targetPopulationsByReportingPeriod: targetPopulationsByReportingPeriod,
  };
  formFields.forEach((field, fieldIndex) => {
    // if field has choices/options (ie could have nested children)
    const fieldChoices = field.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: FieldChoice) => {
        // if given field choice has nested children
        const nestedChildFields = choice.children;
        if (nestedChildFields) {
          choice.children = expandRepeatedFields(
            nestedChildFields,
            workPlanFieldData,
            workPlanMetaData
          );
        }
      });
    }
    if (field?.repeatable) {
      const repeatingFieldRule = repeatingFieldRuleMap[field.repeatable.rule];
      formFields = repeatingFieldRule(
        formFields,
        fieldIndex,
        field,
        workPlanFieldData,
        workPlanMetaData
      );
    }
  });
  return formFields;
};

export const scanForRepeatedFields = (
  reportRoutes: ReportRoute[],
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  for (let route of reportRoutes) {
    if (route?.entitySteps)
      scanForRepeatedFields(
        route.entitySteps,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.children)
      scanForRepeatedFields(
        route.children,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.form?.fields)
      route.form.fields = expandRepeatedFields(
        route.form.fields,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.drawerForm?.fields)
      route.drawerForm.fields = expandRepeatedFields(
        route.drawerForm.fields,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.modalForm?.fields)
      route.modalForm.fields = expandRepeatedFields(
        route.modalForm.fields,
        workPlanFieldData,
        workPlanMetaData
      );
  }
  return reportRoutes;
};

export const scanForConditionalRoutes = (
  reportRoutes: ReportRoute[],
  workPlanMetaData?: AnyObject
) => {
  for (let route of reportRoutes) {
    if (route?.entitySteps)
      scanForConditionalRoutes(route.entitySteps, workPlanMetaData);
    if (route?.children)
      scanForConditionalRoutes(route.children, workPlanMetaData);

    // if route has a field that is to be conditionally rendered, conditionally keep in array
    if (route?.conditionallyRender) {
      // if a path has "showOnlyInPeriod2" attached as a rule, we only want to show in reporting period 2, and remove from the list of routes otherwise
      if (
        route.conditionallyRender === "showOnlyInPeriod2" &&
        workPlanMetaData?.reportPeriod != 2
      ) {
        const index = reportRoutes.indexOf(route);
        if (index > -1) {
          reportRoutes.splice(index, 1);
        }
      }
    }
  }

  return reportRoutes;
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) {
  const currentFormTemplate = formTemplateForReportType(reportType);
  const stringifiedTemplate = JSON.stringify(currentFormTemplate);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const mostRecentTemplateVersion = await getNewestTemplateVersion(reportType);
  const mostRecentTemplateVersionHash = mostRecentTemplateVersion?.md5Hash;

  if (currentTemplateHash === mostRecentTemplateVersionHash) {
    return {
      formTemplate: await getTemplate(
        reportBucket,
        getFormTemplateKey(mostRecentTemplateVersion?.id)
      ),
      formTemplateVersion: mostRecentTemplateVersion,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;
    // traverse routes and scan for conditional field
    currentFormTemplate.routes = scanForConditionalRoutes(
      currentFormTemplate.routes,
      workPlanMetaData
    );

    currentFormTemplate.routes = scanForRepeatedFields(
      currentFormTemplate.routes,
      workPlanFieldData,
      workPlanMetaData
    );

    const formTemplateWithValidationJson = {
      ...currentFormTemplate,
      validationJson: getValidationFromFormTemplate(currentFormTemplate),
    };
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
  const addValidationToAccumulator = (formFields: FormField[]) => {
    Object.assign(
      validationSchema,
      compileValidationJsonFromFields(formFields)
    );
  };
  routeArray.forEach((route: ReportRoute) => {
    // check for non-standard needed validation objects
    if (
      (route.pageType === "modalDrawer" ||
        route.pageType === "modalOverlay" ||
        route.pageType === "overlayModal") &&
      route.entityType
    ) {
      Object.assign(validationSchema, { [route.entityType]: "objectArray" });
    }
    // if standard form present, add validation to schema
    const standardFormFields = route.form?.fields.filter(isFieldElement);
    if (standardFormFields) addValidationToAccumulator(standardFormFields);
    // if modal form present, add validation to schema
    const modalFormFields = route.modalForm?.fields.filter(isFieldElement);
    if (modalFormFields) addValidationToAccumulator(modalFormFields);
    // if drawer form present, add validation to schema
    const drawerFormFields = route.drawerForm?.fields.filter(isFieldElement);
    if (drawerFormFields) addValidationToAccumulator(drawerFormFields);
    if (route.pageType === "modalOverlay") {
      const overlayFormFields = (
        route as ModalOverlayReportPageShape
      ).overlayForm?.fields.filter(isFieldElement);
      if (overlayFormFields) addValidationToAccumulator(overlayFormFields);
    }
    // accumulate entity steps
    if (route.dashboard?.pageType === "entityDetailsDashboardOverlay") {
      route.entitySteps?.map(
        (step: EntityDetailsOverlayShape | OverlayModalPageShape) => {
          const stepForm = step.form || step.modalForm;
          const entityStepFormFields = stepForm?.fields.filter(isFieldElement);
          addValidationToAccumulator(entityStepFormFields);
        }
      );
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
