import React from "react";
import { AnyObject } from "types";

/**
 * General type for all form JSON.
 */
export interface FormField {
  id: string;
  type: string;
  validation: string;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
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
