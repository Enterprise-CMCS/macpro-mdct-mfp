import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportRoute,
  ReportStatus,
  ReportMetadataShape,
  ReportType,
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

export const getEligibleWorkPlan = (
  workPlanSubmissions: ReportMetadataShape[]
) => {
  const eligibleWorkPlans = workPlanSubmissions.filter(
    (wp) =>
      wp.status === ReportStatus.APPROVED && !wp.associatedSar && !wp?.archived
  );
  if (eligibleWorkPlans.length === 0) {
    // There were no eligible work plans to treat as a base for this SAR
    return undefined;
  }
  //Return the oldest eligble workplan
  return eligibleWorkPlans.reduce((mostRecent, wp) =>
    mostRecent.createdAt < wp.createdAt ? mostRecent : wp
  );
};

export const isArchivable = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.WP:
    case ReportType.EXPENDITURE:
      return true;
    case ReportType.SAR:
    default:
      return false;
  }
};
