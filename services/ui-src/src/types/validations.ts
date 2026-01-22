export enum DynamicValidationType {
  NUMBER = "number",
  NUMBER_OPTIONAL = "numberOptional",
  TEXT = "text",
  TEXT_OPTIONAL = "textOptional",
}

export enum ValidationType {
  CHECKBOX = "checkbox",
  CHECKBOX_OPTIONAL = "checkboxOptional",
  DATE = "date",
  DROPDOWN = "dropdown",
  DYNAMIC = "dynamic",
  DYNAMIC_OPTIONAL = "dynamicOptional",
  EMAIL = "email",
  END_DATE = "endDate",
  NUMBER = "number",
  NUMBER_OPTIONAL = "numberOptional",
  RADIO = "radio",
  TEXT = "text",
  TEXT_CUSTOM = "textCustom",
  TEXT_OPTIONAL = "textOptional",
  URL = "url",
  VALID_INTEGER = "validInteger",
  VALID_INTEGER_OPTIONAL = "validIntegerOptional",
}

export interface ComparatorMap {
  [key: string]: {
    compare: Function;
    error: Function;
  };
}

export enum ValidationComparator {
  LESS_THAN_OR_EQUAL_PERCENTAGE = "lessThanOrEqualPercentage",
}

export interface TextOptions {
  maxLength?: number;
}

export interface NumberOptions {
  boundary: number;
  comparator: ValidationComparator;
}

export interface DynamicOptions {
  validationType: DynamicValidationType;
}
