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
  TargetPopulationKeys,
  TwelveQuartersKeys,
} from "../types";
import { createHash } from "crypto";
import { incrementQuarterAndYear } from "../time/time";

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
  reportPeriod: number
) => {
  const contentString =
    reportPeriod == 1
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
  reportPeriod: number
) => {
  const contentString =
    reportPeriod == 1
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

/**
 * Gather all the information from the work plan and build out 12 quarters from today's today
 * @param {string} fieldId - The fieldID from the formField we're looking at
 * @param { number } reportPeriod - The current report period
 * @param { number } reportYear - The current report year
 * @return {TargetPopulationKeys[]} Returns 12 quarters information based on the workplan to help build out a new field
 */
export const nextTwelveQuartersKeys = (
  fieldId: string,
  reportPeriod: number,
  reportYear: number
): TwelveQuartersKeys[] => {
  let quarter = reportPeriod === 1 ? 1 : 3;
  let year = reportYear;

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

/**
 * Run the transformation "nextTwelveQuarters" on the field and returns 12 quarters based on todays date
 * @param {FormField} fieldToRepeat - The formFields you want to transform
 * @param { number } reportPeriod - The current report period
 * @param { number } reportYear - The current report year
 * @return {FormField[]} Returns 12 quarters as form fields
 */
export const nextTwelveQuarters = (
  fieldToRepeat: FormField,
  reportPeriod: number,
  reportYear: number
) => {
  var keys = nextTwelveQuartersKeys(fieldToRepeat.id, reportPeriod, reportYear);
  const fieldsToAppend: FormField[] = [];
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

/**
 * Gather all the information from the work plan about how many target populations we need to create
 * @param {string} fieldId - The fieldID from the formField we're looking at
 * @param { number } reportPeriod - The current report period
 * @param {AnyObject} workPlanFieldData - fieldData that contains the target populations
 * @return {TargetPopulationKeys[]} Returns all the target populations from the work plan with important information to build out a new field
 */
export const targetPopulationsKeys = (
  fieldId: string,
  reportPeriod: number,
  workPlanFieldData: AnyObject
): TargetPopulationKeys[] => {
  var targetPopulations = workPlanFieldData?.targetPopulations;
  const keys: TargetPopulationKeys[] = [];
  for (let population of targetPopulations) {
    const key: TargetPopulationKeys = {
      reportPeriod: reportPeriod,
      fieldId: fieldId,
      targetPopulationName:
        population.transitionBenchmarks_targetPopulationName,
      isRequired: population?.isRequired,
    };
    keys.push(key);
  }
  return keys;
};

/**
 * Run the transformation "TargetPopulations" on the field and returns all the target populations from the work plan in its place
 * @param {FormField} formField - The formFields you want to transform
 * @param { number } reportPeriod - The current report period
 * @param { number } reportYear - The current report year
 * @param {AnyObject} workPlanFieldData - fieldData that contains the target populations
 * @return {FormField[]} Returns all the target populations from the work plan as form fields
 */
export const targetPopulations = (
  fieldToRepeat: FormField,
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData: AnyObject
) => {
  //Gather all the information from the work plan about how many target populations we need to create
  var targetPopulationKeys = targetPopulationsKeys(
    fieldToRepeat.id,
    reportPeriod,
    workPlanFieldData
  );
  const fieldsToAppend = [];

  /*
   * Run through all the target populations found in the WP and build out a field
   * using the target population and the field information from the SAR
   */
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

/**
 * Look through the formFields provided and run the transformation provided on that field.
 * @param {FormField[]} formFields - The formFields you want to transform
 * @param { number } reportPeriod - The current report period
 * @param { number } reportYear - The current report year
 * @param {AnyObject} workPlanFieldData - Optional fieldData that a transformation might need of
 * @return {FormField[]} Returns the formFields provided but with any transformation it finds run on them
 */

export const runFieldTransformationRules = (
  formFields: FormField[],
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) => {
  //Create a map of all the possible transformations that can run on a field
  const transformationRuleMap: AnyObject = {
    nextTwelveQuarters: nextTwelveQuarters,
    targetPopulations: targetPopulations,
    firstQuarterOfThePeriod: firstQuarterOfThePeriod,
    secondQuarterOfThePeriod: secondQuarterOfThePeriod,
  };

  const transformedFields: FormField[] = [];

  formFields.forEach((field) => {
    /*
     * Some fields are a choicelists which can have their own form fields
     * We need to recurse through and run any transformations on those as well!
     */
    const fieldChoices = field.props?.choices;
    if (fieldChoices) {
      fieldChoices.forEach((choice: FieldChoice) => {
        // if given field choice has nested children
        const nestedChildFields = choice.children;
        if (nestedChildFields) {
          choice.children = runFieldTransformationRules(
            nestedChildFields,
            reportPeriod,
            reportYear,
            workPlanFieldData
          );
        }
      });
    }

    //If we find a transformation, run the rule provided with it, otherwise just pass it along
    if (field?.transformation) {
      const transformationRule =
        transformationRuleMap[field.transformation.rule];
      transformedFields.push(
        ...transformationRule(
          field,
          reportPeriod,
          reportYear,
          workPlanFieldData
        )
      );
    } else {
      transformedFields.push(field);
    }
  });
  return transformedFields;
};

/**
 * Look through the wp.json or sar.json and find in theres a transformation that needs run
 * on a field
 * @param { (ReportRoute | OverlayModalPageShape | EntityDetailsOverlayShape)[]} reportRoutes - A route containing a form object
 * @param { number } reportPeriod - The current report period
 * @param { number } reportYear - The current report year
 * @param { AnyObject } workPlanFieldData - Some transformations rely on Work plan fielddata, so pass it here if needed
 * @return This will modify whatever the reportRoute was that was given and perform any transformations it finds
 */
export const findAndRunFieldTransformationRules = (
  reportRoutes: (
    | ReportRoute
    | OverlayModalPageShape
    | EntityDetailsOverlayShape
  )[],
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) => {
  for (let route of reportRoutes) {
    if (route?.entitySteps)
      findAndRunFieldTransformationRules(
        route.entitySteps,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
    if (route?.children)
      findAndRunFieldTransformationRules(
        route.children,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
    if (route?.form?.fields)
      route.form.fields = runFieldTransformationRules(
        route.form.fields,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
    if (route?.drawerForm?.fields)
      route.drawerForm.fields = runFieldTransformationRules(
        route.drawerForm.fields,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
    if (route?.modalForm?.fields)
      route.modalForm.fields = runFieldTransformationRules(
        route.modalForm.fields,
        reportPeriod,
        reportYear,
        workPlanFieldData
      );
  }
};

export const scanForConditionalRoutes = (
  reportRoutes: ReportRoute[],
  reportPeriod: number
) => {
  for (let route of reportRoutes) {
    if (route?.entitySteps)
      scanForConditionalRoutes(route.entitySteps, reportPeriod);
    if (route?.children) scanForConditionalRoutes(route.children, reportPeriod);

    // if route has a field that is to be conditionally rendered, conditionally keep in array
    if (route?.conditionallyRender) {
      // if a path has "showOnlyInPeriod2" attached as a rule, we only want to show in reporting period 2, and remove from the list of routes otherwise
      if (
        route.conditionallyRender === "showOnlyInPeriod2" &&
        reportPeriod != 2
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
  reportPeriod: number,
  reportYear: number,
  workPlanFieldData?: AnyObject
) {
  //Make a copy of the form template so we don't accidentally corrupt the original
  const currentFormTemplate = structuredClone(
    formTemplateForReportType(reportType)
  );

  if (currentFormTemplate?.routes) {
    // traverse routes and scan for conditional field
    currentFormTemplate.routes = scanForConditionalRoutes(
      currentFormTemplate.routes,
      reportPeriod
    );

    //transformation of the formTemplate to generate new quarters
    findAndRunFieldTransformationRules(
      currentFormTemplate.routes,
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
  if (matchTemplateVersion) {
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
