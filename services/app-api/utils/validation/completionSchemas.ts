import { array, mixed, object, string, number as yupNumber } from "yup";
// types
import { Choice } from "../types";
// utils
import { schemaMap } from "./schemaMap";

export const error = {
  REQUIRED_GENERIC: "A response is required",
  REQUIRED_CHECKBOX: "Select at least one response",
  INVALID_GENERIC: "Response must be valid",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number or "N/A"',
  INVALID_RATIO: "Response must be a valid ratio",
  INVALID_LENGTH: "Response is too long",
};

// TEXT - Helpers
const isWhitespaceString = (value?: string) => value?.trim().length === 0;

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];

/** This regex must be at least as permissive as the one in ui-src */
const validNumberRegex = /^\.$|[0-9]/;
const validIntegerRegex = /^[0-9\s,]+$/;

// NUMBER - Number or Valid Strings
const numberSchema = () =>
  string()
    .test({
      message: error.INVALID_NUMBER_OR_NA,
      test: (value) => {
        if (value) {
          const isValidStringValue = validNAValues.includes(value);
          const isValidNumberValue = validNumberRegex.test(value);
          return isValidStringValue || isValidNumberValue;
        } else return true;
      },
    })
    .test({
      test: (value) => {
        if (validNumberRegex.test(value!)) {
          return parseFloat(value!) >= 0;
        } else return true;
      },
      message: error.NUMBER_LESS_THAN_ZERO,
    });

export const number = () =>
  numberSchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });

export const numberOptional = () => numberSchema().notRequired().nullable();

const valueCleaningNumberSchema = (value: string, charsToReplace: RegExp) => {
  return yupNumber().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

// Integer or Valid Strings
const validIntegerSchema = () =>
  string().test({
    message: error.INVALID_NUMBER_OR_NA,
    test: (value) => {
      if (value) {
        const isValidStringValue = validNAValues.includes(value);
        const isValidIntegerValue = validIntegerRegex.test(value);
        return isValidStringValue || isValidIntegerValue;
      } else return true;
    },
  });

export const validInteger = () =>
  validIntegerSchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });

export const validIntegerOptional = () =>
  validIntegerSchema().notRequired().nullable();

// Number - Ratio
export const ratio = () =>
  mixed()
    .test({
      message: error.REQUIRED_GENERIC,
      test: (val) => val != "",
    })
    .required(error.REQUIRED_GENERIC)
    .test({
      message: error.INVALID_RATIO,
      test: (val) => {
        const replaceCharsRegex = /[,.:]/g;
        const ratio = val?.split(":");

        // Double check and make sure that a ratio contains numbers on both sides
        if (
          !ratio ||
          ratio.length != 2 ||
          ratio[0].trim().length === 0 ||
          ratio[1].trim().length === 0
        ) {
          return false;
        }

        // Check if the left side of the ratio is a valid number
        const firstTest = valueCleaningNumberSchema(
          ratio[0],
          replaceCharsRegex
        ).isValidSync(val);

        // Check if the right side of the ratio is a valid number
        const secondTest = valueCleaningNumberSchema(
          ratio[1],
          replaceCharsRegex
        ).isValidSync(val);

        // If both sides are valid numbers, return true!
        return firstTest && secondTest;
      },
    });

// DATE
const dateSchema = () =>
  string()
    .matches(dateFormatRegex, error.INVALID_DATE)
    .test({
      message: error.REQUIRED_GENERIC,
      test: (value) => !isWhitespaceString(value),
    });

export const date = () => dateSchema().required(error.REQUIRED_GENERIC);
export const dateOptional = () => dateSchema().notRequired().nullable();

export const endDate = (startDateField: string) =>
  date()
    .typeError(error.INVALID_DATE)
    .test({
      message: error.INVALID_END_DATE,
      test: (endDateString, context) => {
        return isEndDateAfterStartDate(
          context.parent[startDateField],
          endDateString as string
        );
      },
    });

export const isEndDateAfterStartDate = (
  startDateString: string,
  endDateString: string
) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString!);
  return endDate >= startDate;
};

// NESTED
export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionId: string
) => {
  const fieldTypeMap = {
    array: array(),
    string: string(),
    date: dateSchema(),
    object: object(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(
    parentFieldName,
    (value: Choice[]) =>
      // look for parentOptionId in checked choices
      value?.find((option: Choice) => option.key.endsWith(parentOptionId))
        ? fieldSchema() // returns standard field schema (required)
        : baseSchema // returns not-required Yup base schema
  );
};

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;

// SCHEMA MAP
export const completionSchemaMap: any = {
  checkbox: schemaMap.checkbox,
  checkboxOptional: schemaMap.checkboxOptional,
  checkboxSingle: schemaMap.checkboxSingle,
  date: date(),
  dateOptional: dateOptional(),
  dropdown: schemaMap.dropdown,
  dynamic: schemaMap.dynamic,
  dynamicOptional: schemaMap.dynamicOptional,
  email: schemaMap.email,
  emailOptional: schemaMap.emailOptional,
  number: number(),
  numberComparison: schemaMap.numberComparison,
  numberComparisonOptional: schemaMap.numberComparisonOptional,
  numberOptional: numberOptional(),
  radio: schemaMap.radio,
  radioOptional: schemaMap.radioOptional,
  ratio: ratio(),
  text: schemaMap.text,
  textCustom: schemaMap.textCustom,
  textCustomOptional: schemaMap.textCustomOptional,
  textOptional: schemaMap.textOptional,
  url: schemaMap.url,
  urlOptional: schemaMap.urlOptional,
  validInteger: validInteger(),
  validIntegerOptional: validIntegerOptional(),
};
