export enum DynamicValidationType {
  NUMBER = "number",
  NUMBER_OPTIONAL = "number",
  TEXT = "text",
  TEXT_OPTIONAL = "textOptional",
}

export enum ValidationType {
  CHECKBOX = "checkbox",
  CHECKBOX_OPTIONAL = "checkboxOptional",
  DATE = "date",
  END_DATE = "endDate",
  DYNAMIC = "dynamic",
  EMAIL = "email",
  NUMBER = "number",
  NUMBER_COMPARISON = "numberComparison",
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

export interface CustomValidation {
  type: ValidationType;
  options: TextOptions | NumberOptions | DynamicOptions;
}

export interface NestedValidation {
  dependentFieldName?: string;
  nested: boolean;
  parentFieldName: string;
  parentOptionId?: string;
  type: ValidationType;
}

export interface TextOptions {
  maxLength?: number;
}

export interface NumberOptions {
  boundary: number;
  comparator: ValidationComparator;
}

export interface DynamicOptions {
  type?: DynamicValidationType;
}
