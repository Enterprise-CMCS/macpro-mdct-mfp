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
        if (!choice.id.includes("-")) {
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
