export enum ValidationType {
  CHECKBOX = "checkbox",
  CHECKBOX_OPTIONAL = "checkboxOptional",
  DATE = "date",
  END_DATE = "endDate",
  DYNAMIC = "dynamic",
  EMAIL = "email",
  NUMBER = "number",
  RADIO = "radio",
  TEXT = "text",
  TEXT_OPTIONAL = "textOptional",
  URL = "url",
  VALID_INTEGER = "validInteger",
  VALID_INTEGER_OPTIONAL = "validIntegerOptional",
}

export interface NestedValidation {
  dependentFieldName?: string;
  nested: boolean;
  parentFieldName: string;
  parentOptionId?: string;
  type: ValidationType;
}
