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
  ReportMetadataShape,
  ReportRoute,
  ReportType,
  TargetPopulationKeys,
  TwelveQuartersKeys,
} from "../types";
import { getTemplate } from "../../handlers/formTemplates/populateTemplatesTable";
import { createHash } from "crypto";
import {
  calculateCurrentYear,
  calculatePeriod,
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

export const firstQuarterOfThePeriod = (
  field: FormField,
  workPlanMetaData: ReportMetadataShape
) => {
  const contentString =
    workPlanMetaData?.reportPeriod == 1
      ? "First quarter (January 1 - March 31)"
      : "Third quarter (July 1 - September 30)";
  const updatedFormField: FormField = {
    id: `${field.id}`,
    type: `${field.type}`,
    props: {
      content: contentString,
    },
  };
  return [updatedFormField];
};

export const secondQuarterOfThePeriod = (
  field: FormField,
  workPlanMetaData: ReportMetadataShape
) => {
  const contentString =
    workPlanMetaData?.reportPeriod == 1
      ? "Second quarter (April 1 - June 30)"
      : "Fourth quarter (October 1 - December 31)";
  const updatedFormField: FormField = {
    id: `${field.id}`,
    type: `${field.type}`,
    props: {
      content: contentString,
    },
  };
  return [updatedFormField];
};

export const nextTwelveQuartersKeys = (
  fieldId: string,
  currentDate: number,
  workPlan: ReportMetadataShape
): TwelveQuartersKeys[] => {
  let period = calculatePeriod(currentDate, workPlan);
  let quarter = period === 1 ? 1 : 3;
  let year = calculateCurrentYear();

  const keys: TwelveQuartersKeys[] = [];
  for (let i = 0; i < 12; i++) {
    const key: TwelveQuartersKeys = {
      fieldId: fieldId,
      year: year,
      quarter: quarter,
    };
    keys.push(key);
    [quarter, year] = incrementQuarterAndYear(quarter, year);
  }
  return keys;
};

export const nextTwelveQuarters = (
  fieldToRepeat: FormField,
  workPlanMetaData: ReportMetadataShape
) => {
  var keys = nextTwelveQuartersKeys(
    fieldToRepeat.id,
    Date.now(),
    workPlanMetaData
  );
  const fieldsToAppend = [];
  for (let key of keys) {
    const formField: FormField = {
      ...fieldToRepeat,
      id: `${key.fieldId}${key.year}Q${key.quarter}`,
      type: fieldToRepeat?.type,
      validation: fieldToRepeat.validation,
      transformation: { rule: "" },
      props: {
        ...fieldToRepeat?.props,
        label: `${key.year} Q${key.quarter}`,
      },
    };
    fieldsToAppend.push(formField);
  }
  return fieldsToAppend;
};

export const targetPopulationsKeys = (
  fieldId: string,
  workPlanFieldData: AnyObject,
  workPlanMetaData: ReportMetadataShape
): TargetPopulationKeys[] => {
  var targetPopulations = workPlanFieldData?.targetPopulations;
  const keys: TargetPopulationKeys[] = [];
  for (let population of targetPopulations) {
    const key: TargetPopulationKeys = {
      reportPeriod: workPlanMetaData.reportPeriod,
      fieldId: fieldId,
      targetPopulationName:
        population.transitionBenchmarks_targetPopulationName,
      isRequired: population?.isRequired,
    };
    keys.push(key);
  }
  return keys;
};

export const targetPopulations = (
  fieldToRepeat: FormField,
  workPlanFieldData: AnyObject,
  workPlanMetaData: ReportMetadataShape
) => {
  var targetPopulationKeys = targetPopulationsKeys(
    fieldToRepeat.id,
    workPlanFieldData,
    workPlanMetaData
  );
  const fieldsToAppend = [];
  for (let population of targetPopulationKeys) {
    const formField: FormField = {
      ...fieldToRepeat,
      id: `${fieldToRepeat.id}_Period${population.reportPeriod}_${population.targetPopulationName}`,
      type: fieldToRepeat?.type,
      validation: fieldToRepeat.validation,
      transformation: { rule: "" },
      props: {
        ...fieldToRepeat?.props,
        label:
          population.isRequired === true
            ? `Number of ${population.targetPopulationName}`
            : `Other: ${population.targetPopulationName}`,
      },
    };
    fieldsToAppend.push(formField);
  }

  return fieldsToAppend;
};

export const runFieldTransformationRules = (
  formFields: FormField[],
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: AnyObject
) => {
  const transformationRuleMap: AnyObject = {
    nextTwelveQuarters: nextTwelveQuarters,
    targetPopulations: targetPopulations,
    firstQuarterOfThePeriod: firstQuarterOfThePeriod,
    secondQuarterOfThePeriod: secondQuarterOfThePeriod,
  };

  const transformedFields: FormField[] = [];
  formFields.forEach((field) => {
    // if field has choices/options (ie could have nested children)
    const fieldChoices = field.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: FieldChoice) => {
        // if given field choice has nested children
        const nestedChildFields = choice.children;
        if (nestedChildFields) {
          choice.children = runFieldTransformationRules(
            nestedChildFields,
            workPlanFieldData,
            workPlanMetaData
          );
        }
      });
    }

    if (field?.transformation) {
      const repeatingFieldRule =
        transformationRuleMap[field.transformation.rule];
      transformedFields.push(
        ...repeatingFieldRule(field, workPlanFieldData, workPlanMetaData)
      );
    } else {
      transformedFields.push(field);
    }
  });
  return transformedFields;
};

export const findAndRunFieldTransformationRules = (
  reportRoutes: (
    | ReportRoute
    | OverlayModalPageShape
    | EntityDetailsOverlayShape
  )[],
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: ReportMetadataShape
) => {
  for (let route of reportRoutes) {
    if (route?.entitySteps)
      findAndRunFieldTransformationRules(
        route.entitySteps,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.children)
      findAndRunFieldTransformationRules(
        route.children,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.form?.fields)
      route.form.fields = runFieldTransformationRules(
        route.form.fields,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.drawerForm?.fields)
      route.drawerForm.fields = runFieldTransformationRules(
        route.drawerForm.fields,
        workPlanFieldData,
        workPlanMetaData
      );
    if (route?.modalForm?.fields)
      route.modalForm.fields = runFieldTransformationRules(
        route.modalForm.fields,
        workPlanFieldData,
        workPlanMetaData
      );
  }
};

export async function getOrCreateFormTemplate(
  reportBucket: string,
  reportType: ReportType,
  workPlanFieldData?: AnyObject,
  workPlanMetaData?: ReportMetadataShape,
  copyReport?: AnyObject
) {
  const currentFormTemplate = formTemplateForReportType(reportType);
  const stringifiedTemplate = JSON.stringify(currentFormTemplate);

  const currentTemplateHash = createHash("md5")
    .update(stringifiedTemplate)
    .digest("hex");

  const mostRecentTemplateVersion = await getNewestTemplateVersion(reportType);
  const mostRecentTemplateVersionHash = mostRecentTemplateVersion?.md5Hash;

  if (currentTemplateHash === mostRecentTemplateVersionHash && !copyReport) {
    return {
      formTemplate: await getTemplate(
        reportBucket,
        getFormTemplateKey(mostRecentTemplateVersion?.id)
      ),
      formTemplateVersion: mostRecentTemplateVersion,
    };
  } else {
    const newFormTemplateId = KSUID.randomSync().string;

    findAndRunFieldTransformationRules(
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
