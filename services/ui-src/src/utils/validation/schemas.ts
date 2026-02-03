import { array, boolean, mixed, object, string } from "yup";
// utils
import {
  checkRatioInputAgainstRegexes,
  checkStandardIntegerInputAgainstRegexes,
  checkStandardNumberInputAgainstRegexes,
} from "utils/other/checkInputValidity";
// types
import {
  Choice,
  ComparatorMap,
  DynamicOptions,
  DynamicValidationType,
  NumberOptions,
  TextOptions,
} from "types";
// verbiage
import { validationErrors as error } from "verbiage/errors";

// TEXT - Helpers
const isWhitespaceString = (value?: string) => value?.trim().length === 0;
const transformEmptyStringToNull = (curr: string, orig: string) =>
  orig === "" ? null : curr;
const isWithinMaxLength = (value: string | null = "", maxLength?: number) => {
  return maxLength && value ? value.length <= maxLength : true;
};

// TEXT
export const text = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });
export const textOptional = () =>
  string()
    .nullable()
    .transform(transformEmptyStringToNull)
    .typeError(error.INVALID_GENERIC);
export const textCustom = (options: TextOptions) =>
  string()
    .typeError(error.INVALID_GENERIC)
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    })
    .test({
      test: (value) => isWithinMaxLength(value, options.maxLength),
      message: error.INVALID_LENGTH,
    });

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];
// const validNumberRegex = /^\.$|[0-9]/;
const validIntegerRegex = /^[0-9\s,$%]+$/;

const comparatorMap: ComparatorMap = {
  lessThanOrEqualPercentage: {
    compare: (value: number, max: number) => value <= max,
    error: (max: number) => `Percentage cannot exceed ${max}%`,
  },
};

// NUMBER - Number or Valid Strings
const numberSchema = () =>
  string()
    .test({
      message: error.INVALID_NUMBER_OR_NA,
      test: (value) => {
        if (value) {
          const isValidStringValue = validNAValues.includes(value);
          const isValidNumberValue =
            checkStandardNumberInputAgainstRegexes(value);
          return isValidStringValue || isValidNumberValue;
        } else return true;
      },
    })
    .test({
      test: (value) => {
        if (checkStandardNumberInputAgainstRegexes(value!)) {
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

export const numberOptional = () =>
  numberSchema().notRequired().nullable().transform(transformEmptyStringToNull);
export const numberComparison = (options: NumberOptions) =>
  number().test({
    test: (value) => {
      const { boundary, comparator } = options;
      const { compare } = comparatorMap[comparator];
      if (value) {
        const isValidStringValue = validNAValues.includes(value);
        return isValidStringValue || compare(Number(value), boundary);
      } else return true;
    },
    message: () => {
      const { error: comparisonError } = comparatorMap[options.comparator];
      return comparisonError(options.boundary);
    },
  });

// Integer or Valid Strings
const validIntegerSchema = () =>
  string()
    .test({
      message: error.INVALID_NUMBER_OR_NA,
      test: (value) => {
        if (value) {
          const isValidStringValue = validNAValues.includes(value);
          const isValidIntegerValue = validIntegerRegex.test(value);
          return isValidStringValue || isValidIntegerValue;
        } else return true;
      },
    })
    .test({
      test: (value) => {
        if (checkStandardIntegerInputAgainstRegexes(value!)) {
          return parseFloat(value!) >= 0;
        } else return true;
      },
      message: error.NUMBER_LESS_THAN_ZERO,
    });

export const validInteger = () =>
  validIntegerSchema().required(error.REQUIRED_GENERIC);

export const validIntegerOptional = () =>
  validIntegerSchema()
    .notRequired()
    .nullable()
    .transform(transformEmptyStringToNull);

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
        return checkRatioInputAgainstRegexes(val).isValid;
      },
    });

// EMAIL
export const email = () => text().email(error.INVALID_EMAIL);
export const emailOptional = () =>
  email().notRequired().nullable().transform(transformEmptyStringToNull);

// URL
export const url = () => text().url(error.INVALID_URL);
export const urlOptional = () =>
  url().notRequired().nullable().transform(transformEmptyStringToNull);

// DATE
export const date = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateFormatRegex, error.INVALID_DATE)
    .test({
      message: error.REQUIRED_GENERIC,
      test: (value) => !isWhitespaceString(value),
    });

export const dateOptional = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .nullable()
    .transform(transformEmptyStringToNull)
    .test({
      message: error.INVALID_DATE,
      test: (value) => {
        if (value) {
          return dateFormatRegex.test(value);
        }
        return true;
      },
    });

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

// DROPDOWN
export const dropdown = () =>
  object({ label: text(), value: text() }).required(error.REQUIRED_GENERIC);
export const dropdownOptional = () =>
  object({ label: textOptional(), value: textOptional() }).notRequired();

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .required(error.REQUIRED_CHECKBOX);
export const checkboxOptional = () =>
  array().notRequired().typeError(error.INVALID_GENERIC);
export const checkboxSingle = () => boolean();

// RADIO
export const radio = () =>
  array()
    .min(1, error.REQUIRED_GENERIC)
    .of(object({ key: text(), value: text() }))
    .required(error.REQUIRED_GENERIC);
export const radioOptional = () => radio().notRequired();

// DYNAMIC
export const dynamic = (options?: DynamicOptions) =>
  array()
    .min(1)
    .of(
      object().shape({
        id: text(),
        name: schemaMap[options?.validationType || DynamicValidationType.TEXT],
      })
    )
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = (options?: DynamicOptions) =>
  dynamic(options).notRequired();

// NESTED
export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionId: string
) => {
  const fieldTypeMap = {
    array: array(),
    string: string(),
    date: date(),
    object: object(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(parentFieldName, {
    is: (value: Choice[]) =>
      // look for parentOptionId in checked choices
      value?.find((option: Choice) => option.key.endsWith(parentOptionId)),
    // oxlint-disable-next-line no-thenable
    then: () => fieldSchema(), // returns standard field schema (required)
    otherwise: () => baseSchema, // returns not-required Yup base schema
  });
};

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;

export const schemaMap: any = {
  checkbox: checkbox(),
  checkboxOptional: checkboxOptional(),
  checkboxSingle: checkboxSingle(),
  date: date(),
  dateOptional: dateOptional(),
  dropdown: dropdown(),
  dropdownOptional: dropdownOptional(),
  dynamic: (options?: DynamicOptions) => dynamic(options),
  dynamicOptional: (options?: DynamicOptions) => dynamicOptional(options),
  email: email(),
  emailOptional: emailOptional(),
  number: number(),
  numberComparison: (options: NumberOptions) => numberComparison(options),
  numberOptional: numberOptional(),
  radio: radio(),
  radioOptional: radioOptional(),
  ratio: ratio(),
  text: text(),
  textCustom: (options: TextOptions) => textCustom(options),
  textOptional: textOptional(),
  url: url(),
  urlOptional: urlOptional(),
  validInteger: validInteger(),
  validIntegerOptional: validIntegerOptional(),
};
