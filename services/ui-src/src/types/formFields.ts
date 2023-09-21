import React from "react";
import { AnyObject } from "types";

// FORM & FIELD STRUCTURE

/**
 * Reports can have nested entities, each of which refers to a distinct instance of a form.
 * This constant represents all of the entity types that are currently available.
 */
export const entityTypes = ["plans"] as const;

/**
 * This type is a string union type generated by the constant above.
 */
export declare type EntityType = typeof entityTypes[number];

export interface EntityShape {
  id: string;
  [key: string]: any;
}

export enum OverlayModalEntityTypes {
  EVALUATION_PLAN = "evaluationPlan",
  FUNDING_SOURCES = "fundingSources",
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
  repeating?: AnyObject;
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
