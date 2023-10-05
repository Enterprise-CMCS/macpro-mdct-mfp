import React from "react";
// components
import {
  CheckboxField,
  RadioField,
  TextField,
  TextAreaField,
  ChoiceField,
} from "components";
// types
import {
  AnyObject,
  FieldChoice,
  FormField,
  FormLayoutElement,
  isFieldElement,
} from "types";
import { DateField } from "components/fields/DateField";
import { DropdownField } from "components/fields/DropdownField";
import { DynamicField } from "components/fields/DynamicField";
import { NumberField } from "components/fields/NumberField";

// return created elements from provided fields
export const formFieldFactory = (
  fields: Array<FormField | FormLayoutElement>,
  options?: {
    disabled?: boolean;
    nested?: boolean;
    autosave?: boolean;
    validateOnRender?: boolean;
  }
) => {
  // define form field components
  const fieldToComponentMap: AnyObject = {
    checkboxSingle: ChoiceField,
    checkbox: CheckboxField,
    date: DateField,
    dropdown: DropdownField,
    dynamic: DynamicField,
    number: NumberField,
    radio: RadioField,
    text: TextField,
    textarea: TextAreaField,
  };
  fields = initializeChoiceListFields(fields);
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    const fieldProps = {
      key: field.id,
      name: field.id,
      hydrate: field.props?.hydrate,
      autoComplete: isFieldElement(field) ? "one-time-code" : undefined, // stops browsers from forcing autofill
      ...options,
      ...field?.props,
    };
    return React.createElement(componentFieldType, fieldProps);
  });
};

// add data to choice fields in preparation for render
export const initializeChoiceListFields = (
  fields: (FormField | FormLayoutElement)[]
) => {
  const fieldsWithChoices = fields.filter(
    (field: FormField | FormLayoutElement) => field.props?.choices
  );
  fieldsWithChoices.forEach((field: FormField | FormLayoutElement) => {
    if (isFieldElement(field)) {
      field?.props?.choices.forEach((choice: FieldChoice) => {
        // set choice value to choice label string
        choice.value = choice.label;
        // if choice id has not already had parent field id appended, do so now
        if (!choice?.id?.includes("-")) {
          choice.id = field.id + "-" + choice.id;
        }
        choice.name = choice.id;
        // initialize choice as controlled component in unchecked state
        if (choice.checked != true) choice.checked = false;
        // if choice has children, recurse
        if (choice.children) initializeChoiceListFields(choice.children);
      });
    }
  });
  return fields;
};

export const hydrateFormFields = (
  formFields: (FormField | FormLayoutElement)[],
  formData: AnyObject | undefined
) => {
  formFields.forEach((field: FormField | FormLayoutElement) => {
    const fieldFormIndex = formFields.indexOf(field!);
    const fieldProps = formFields[fieldFormIndex].props!;
    // check for children on each choice in field props
    if (fieldProps) {
      const choices = fieldProps.choices;
      if (choices) {
        choices.forEach((choice: FieldChoice) => {
          // if a choice has children, recurse
          if (choice.children) {
            hydrateFormFields(choice.children, formData);
          }
        });
      }
    } else {
      // if no props on field, initialize props as empty object
      formFields[fieldFormIndex].props = {};
    }
    // set props.hydrate
    const fieldHydrationValue = formData?.[field.id];
    formFields[fieldFormIndex].props!.hydrate = fieldHydrationValue;
  });

  return formFields;
};

export const sortFormErrors = (
  form: AnyObject,
  errors: AnyObject
): string[] => {
  // sort errors into new array
  const sortedErrorArray: string[] = [];
  for (let fieldName in form) {
    if (errors[fieldName]) {
      sortedErrorArray.push(fieldName);
    }
  }
  return sortedErrorArray;
};

// returns user-entered data, filtered to only fields in the current form
export const filterFormData = (
  enteredData: AnyObject,
  currentFormFields: FormField[]
) => {
  // translate user-entered data to array for filtration
  const enteredDataEntries = Object.entries(enteredData);
  // flatten current form fields and create array of the form's field ids
  const flattenedFormFields = flattenFormFields(currentFormFields);
  const formFieldArray = flattenedFormFields.map(
    (field: FormField) => field.id
  );
  // filter user-entered data to only fields in the current form
  const userEnteredEntries = enteredDataEntries.filter((fieldData) => {
    const [fieldDataKey] = fieldData;
    return formFieldArray.includes(fieldDataKey);
  });
  // translate data array back to a form data object
  return Object.fromEntries(userEnteredEntries);
};

export const getEntriesToClear = (
  enteredData: AnyObject,
  currentFormFields: FormField[]
) => {
  // Get the users entered data
  const enteredDataEntries = Object.entries(enteredData);
  // Map over the users entered data and get each of the fields ids
  const enteredDataFieldIds = enteredDataEntries.map((enteredField) => {
    return enteredField?.[0];
  });
  // Grab all of the possible form fields that a user could have filled out
  const flattenedFormFields = flattenFormFields(currentFormFields);
  // Find what fields weren't directly entered by the user to send back to be cleared
  const entriesToClear = flattenedFormFields.filter((formField) => {
    return !enteredDataFieldIds.includes(formField.id);
  });
  // Return array of field ID's
  return entriesToClear.map((enteredField) => {
    return enteredField.id;
  });
};

export const setClearedEntriesToDefaultValue = (
  entity: AnyObject,
  entriesToClear: string[]
) => {
  entriesToClear.forEach((entry) => {
    if (Array.isArray(entity[entry])) {
      entity[entry] = [];
    } else if (typeof entity[entry] == "object") {
      entity[entry] = {};
    } else {
      entity[entry] = "";
    }
  });
  return entity;
};

// returns all fields in a given form, flattened to a single level array
export const flattenFormFields = (formFields: FormField[]): FormField[] => {
  const flattenedFields: any = [];
  const compileFields = (formFields: FormField[]) => {
    formFields.forEach((field: FormField) => {
      // push field to flattened fields array
      flattenedFields.push(field);
      // if choice has children, recurse
      field?.props?.choices?.forEach((choice: FieldChoice) => {
        if (choice.children) compileFields(choice.children);
      });
    });
  };
  compileFields(formFields);
  return flattenedFields;
};
