import {
  AnyObject,
  FieldChoice,
  FormField,
  ReportShape,
  ReportRoute,
} from "types";
import { nextTwelveQuartersKeys } from "utils";

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

export const twelveQuartersValidation = (
  repeatingField: any,
  validationSchema: any
) => {
  var keys = nextTwelveQuartersKeys(repeatingField.id);
  for (let key of keys) {
    validationSchema[`${key[0]}${key[1]}Q${key[2]}`] =
      repeatingField.validation;
  }
  return validationSchema;
};

export const createRepeatingValidationSchema = (
  repeatingField: any,
  validationSchema: any
) => {
  const repeatingNamingSchema: AnyObject = {
    nextTwelveQuarters: twelveQuartersValidation,
  };
  const repeatingNameRule =
    repeatingNamingSchema[repeatingField.props.repeating?.rule];
  return repeatingNameRule(repeatingField, validationSchema);
};

// returns validation schema object for array of fields
export const compileValidationJsonFromFields = (
  fieldArray: FormField[],
  parentOption?: any
): AnyObject => {
  let validationSchema: AnyObject = {};
  fieldArray.forEach((field: FormField) => {
    if (field.props?.repeating) {
      validationSchema = createRepeatingValidationSchema(
        field,
        validationSchema
      );
    } else {
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
    }
  });
  return validationSchema;
};
