import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportRoute,
  ReportStatus,
  ReportMetadataShape,
} from "types";

export const sortReportsOldestToNewest = (
  reportsArray: ReportShape[]
): ReportShape[] =>
  reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);

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

export const getLastSubmission = (
  workPlanSubmissions: ReportMetadataShape[]
) => {
  let lastFoundSubmission: ReportMetadataShape | undefined = undefined;
  workPlanSubmissions.forEach((submission: ReportMetadataShape) => {
    if (
      (submission.status === ReportStatus.NOT_STARTED ||
        submission.status === ReportStatus.IN_PROGRESS) &&
      !submission?.associatedSar
    ) {
      if (
        lastFoundSubmission &&
        submission.createdAt > lastFoundSubmission?.createdAt
      )
        lastFoundSubmission = submission;
      else if (!lastFoundSubmission) {
        lastFoundSubmission = submission;
      }
    }
  });
  return lastFoundSubmission;
};
