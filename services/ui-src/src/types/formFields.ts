import React from "react";
import { AnyObject, ReportRoute } from "types";

// FORM & FIELD STRUCTURE

/**
 * Reports can have entities which have their own data objects. Each entity refers to a distinct instance of a form.
 * This constant represents all of the entity types that are currently available.
 */
export const entityTypes = [
  "initiative",
  "targetPopulations",
  "evaluationPlan",
  "objectiveProgress",
] as const;

/**
 * This type is a string union type generated by the constant above.
 */
export declare type EntityType = (typeof entityTypes)[number];

export interface EntityShape {
  id: string;
  type: EntityType;
  [key: string]: any;
}

/**
 * General type for all form JSON.
 */
export interface FormJson {
  id: string;
  fields: (FormField | FormLayoutElement)[];
  heading?: AnyObject;
  options?: AnyObject;
  validation?: AnyObject;
  adminDisabled?: boolean;
  editableByAdmins?: boolean;
  verbiage?: AnyObject;
  forms?: ReportRoute[];
  initiativeId?: string;
}

export interface DependentFieldValidation {
  type: string;
  dependentFieldName: string;
  parentOptionId?: never;
}

export interface NestedFieldValidation {
  type: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export interface NestedDependentFieldValidation {
  type: string;
  dependentFieldName: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export type FieldValidationObject =
  | DependentFieldValidation
  | NestedFieldValidation
  | NestedDependentFieldValidation;

export interface FormField {
  id: string;
  type: string;
  validation: string | FieldValidationObject;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
  transformation?: Transformation;
  isRequired?: boolean;
}

export interface Transformation {
  rule: string;
}

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  /*
   * This function is duplicated in app-api/utils/formTemplates/formTemplates.ts
   * If you change it here, change it there!
   */
  const formLayoutElementTypes = ["sectionHeader", "sectionContent"];
  return !formLayoutElementTypes.includes(field.type);
}

export interface FormLayoutElement {
  id: string;
  type: string;
  props?: AnyObject;
}

export interface DropdownOptions {
  label: string;
  value: string;
}

export interface FieldChoice {
  id: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  children?: FormField[];
  checkedChildren?: React.ReactNode;
}

export interface ChoiceFieldProps {
  name: string;
  label: string;
  choices: FieldChoice[];
  heading?: string;
  sxOverride?: AnyObject;
  [key: string]: any;
}
export interface Choice {
  key: string; // choice.name
  value: string; // choice.value
}

export interface DropdownChoice {
  label: string;
  value: string;
}
