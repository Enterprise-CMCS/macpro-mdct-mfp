import { array, boolean, mixed, object, string } from "yup";
import { validationErrors as error } from "verbiage/errors";
import { Choice } from "types";
import {
  checkRatioInputAgainstRegexes,
  checkStandardIntegerInputAgainstRegexes,
  checkStandardNumberInputAgainstRegexes,
} from "utils/other/checkInputValidity";

// TEXT - Helpers
const isWhitespaceString = (value?: string) => value?.trim().length === 0;
const transformEmptyStringToNull = (curr: string, orig: string) =>
  orig === "" ? null : curr;

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

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];
// const validNumberRegex = /^\.$|[0-9]/;
const validIntegerRegex = /^[0-9\s,$%]+$/;

// NUMBER - Number or Valid Strings
export const numberSchema = () =>
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

// Integer or Valid Strings
export const validIntegerSchema = () =>
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
export const dynamic = () =>
  array()
    .min(1)
    .of(
      object().shape({
        id: text(),
        name: text(),
      })
    )
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => dynamic().notRequired();

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
    then: () => fieldSchema(), // returns standard field schema (required)
    otherwise: () => baseSchema, // returns not-required Yup base schema
  });
};

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
