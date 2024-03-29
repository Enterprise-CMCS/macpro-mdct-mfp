import { AnyObject } from "./other";

// FORM & FIELD STRUCTURE

/**
 * Reports can have entities which have their own data objects. Each entity refers to a distinct instance of a form.
 * This constant represents all of the entity types that are currently available.
 */
export const entityTypes = ["initiative", "targetPopulations"] as const;

/**
 * This type is a string union type generated by the constant above.
 */
export declare type EntityType = typeof entityTypes[number];

export interface EntityShape {
  id: string;
  type: EntityType;
  [key: string]: any;
}

export interface FormLayoutElement {
  id: string;
  type: string;
  props?: AnyObject;
  transformation?: Transformation;
}

export interface FormJson {
  id: string;
  fields: FormField[];
  options?: AnyObject;
  validation?: AnyObject;
  initiativeId?: string;
  objectiveId?: string;
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
  validation?: string | FieldValidationObject;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
  transformation?: Transformation;
  objectiveCardTemplate?: AnyObject;
  isRequired?: boolean;
}

export interface Transformation {
  rule: string;
}

export interface TargetPopulationKeys {
  reportPeriod: number;
  fieldId: string;
  targetPopulationName: string;
  isRequired?: boolean;
}

export interface TwelveQuartersKeys {
  fieldId: string;
  year: number;
  quarter: number;
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
  checkedChildren?: any;
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

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  DYNAMIC_MODAL_OVERLAY = "dynamicModalOverlay",
  REVIEW_SUBMIT = "reviewSubmit",
}
