import React from "react";
// components
import {
  CheckboxField,
  ChoiceField,
  DateField,
  DropdownField,
  DynamicField,
  NumberField,
  RadioField,
  SectionContent,
  SectionHeader,
  TextAreaField,
  TextField,
} from "components";
// types
import {
  AnyObject,
  Choice,
  DynamicFieldShape,
  EntityShape,
  FieldChoice,
  FormField,
  FormJson,
  FormLayoutElement,
  isFieldElement,
  ReportFormFieldType,
  ReportShape,
  ReportStatus,
} from "types";
// utils
import { calculateNextQuarter, createTempDynamicId } from "utils";
import {
  getDefaultTargetPopulationNames,
  notAnsweredText,
} from "../../constants";

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
    dynamicObject: null,
    number: NumberField,
    radio: RadioField,
    text: TextField,
    textarea: TextAreaField,
    sectionHeader: SectionHeader,
    sectionContent: SectionContent,
  };
  fields = initializeChoiceListFields(fields);
  return fields.map((field) => {
    const componentFieldType = fieldToComponentMap[field.type];
    if (!componentFieldType) return null;

    const fieldProps = {
      key: field.id,
      name: field.id,
      hydrate: field.props?.hydrate,
      autoComplete: isFieldElement(field) ? "off" : undefined, // stops browsers from forcing autofill
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
        choice.label;
        choice.value = Array.isArray(choice.label)
          ? choice.label[0]
          : choice.label;
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
    let fieldHydrationValue = formData?.[field.id];

    /**
     * NOTE: this is an edge case specific to the MFP WP.
     * If the user has selected "No" to the Projected End Date question in I. Define initiative,
     * the value of the V. Close-out initiative disabled field should be set to "No"
     */
    if (
      formData?.["defineInitiative_projectedEndDate"]?.[0]?.value === "No" &&
      field.id === "defineInitiative_projectedEndDate_value" &&
      !fieldProps.hydrate &&
      fieldProps.disabled
    ) {
      fieldHydrationValue = "No";
    }

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

/*
 * This function resets the 'clear' prop on each field after a ChoiceListField calls
 * clearUncheckedNestedFields(). Upon re-entering a drawer or modal, the field values will
 * be correctly hydrated.
 */
export const resetClearProp = (fields: (FormField | FormLayoutElement)[]) => {
  fields.forEach((field: FormField | FormLayoutElement) => {
    switch (field.type) {
      case "radio":
      case "checkbox":
        field.props?.choices.forEach((childField: FieldChoice) => {
          if (childField?.children) {
            resetClearProp(childField.children);
          }
        });
        field.props = { ...field.props, clear: false };
        resetClearProp(field.props?.choices);
        break;
      default:
        field.props = { ...field.props, clear: false };
        break;
    }
  });
};

export const formatOtherTargetPopulationChoices = (field: AnyObject) => {
  const defaultTargetPopulations = getDefaultTargetPopulationNames();
  // add HCBS population for initiatives
  defaultTargetPopulations.push("HCBS infrastructure/system-level development");

  return defaultTargetPopulations.includes(
    field.transitionBenchmarks_targetPopulationName
  )
    ? field.transitionBenchmarks_targetPopulationName
    : `Other: ${field.transitionBenchmarks_targetPopulationName}`;
};

export const convertEntityToTargetPopulationChoice = (
  entity: EntityShape[]
) => {
  return entity?.map((field: EntityShape) => {
    return {
      key: `targetPopulations-${field.id}`,
      value: formatOtherTargetPopulationChoices(field),
    };
  });
};

/*
 * This function is called when a Choice in the DB needs to be expanded to be able
 * to create a ChoiceListField. This can happen when you need to dynamically
 * create a field based on a users inputs. For example, when a user clicks
 * the edit button on the SAR dashboard, they'll need a dynamically made
 * form to show the target populations from the Work Plan.
 */
export const convertChoiceToEntity = (choices: Choice[]) => {
  return choices?.map((field: Choice) => {
    return {
      id: field.key ?? field.id,
      label: field.value,
      name: field.value,
      value: field.value,
    };
  });
};

/*
 * This function is called when a user clicks the Create SAR button on the
 * dashboard. At that moment, we need to dynamically render a choicelistfield
 * and display it to the user. Thus, this function grabs that data from the WP
 * and makes the field based on the data stored there.
 */
export const convertTargetPopulationsFromWPToSAREntity = (
  targetPopulations: AnyObject[]
) => {
  return targetPopulations?.map((field: AnyObject) => {
    return {
      id: `targetPopulations-${field.id}`,
      label: formatOtherTargetPopulationChoices(field),
      name: field.transitionBenchmarks_targetPopulationName,
      value: formatOtherTargetPopulationChoices(field),
    };
  });
};

/**
 * Prevent users from changing a funding source's type in a copied report.
 *
 * If the user copied work plan A to make work plan B, we assume that the
 * data in A was correct. When editing B, they can adjust amounts and
 * projections, but they can't make fundamental changes to the source.
 */
export const disableCopiedFundingSources = (
  report: ReportShape,
  fields: (FormField | FormLayoutElement)[],
  formData?: AnyObject
) => {
  if (!report?.isCopied) {
    return;
  }

  const fundingSourceField = fields.find(
    (field) => field.id === "fundingSources_wpTopic"
  );

  if (!fundingSourceField) {
    // This must be some other form; don't touch it.
    return;
  }

  const disabled = formData && formData.isCopied;
  fundingSourceField.props!.disabled = disabled;
};

export const updateRenderFields = (
  report: ReportShape,
  fields: (FormField | FormLayoutElement)[],
  formData?: AnyObject
) => {
  disableCopiedFundingSources(report, fields, formData);
  const targetPopulations = report?.fieldData?.targetPopulations;

  const hcbsPopulation = {
    id: "3Nc13O5GHA6Hc4KheO5FMSD2",
    transitionBenchmarks_targetPopulationName:
      "HCBS infrastructure/system-level development",
    type: "targetPopulations",
    isRequired: false,
  };

  const filteredTargetPopulations =
    getDefaultAndApplicablePopulations(targetPopulations);

  // This one always has to be at the end for...reasons
  filteredTargetPopulations?.push(hcbsPopulation);

  const formatChoiceList = convertTargetPopulationsFromWPToSAREntity(
    filteredTargetPopulations
  );

  const updateChoiceList = updateFieldChoicesByID(
    fields,
    "targetPopulations",
    formatChoiceList
  );

  return updateChoiceList;
};

export const updateFieldChoicesByID = (
  formFields: (FormField | FormLayoutElement)[],
  id: string,
  fields: AnyObject[]
) => {
  return formFields.map((field) => {
    return field.id.match(id)
      ? {
          ...field,
          props: { ...field?.props, choices: [...fields] },
        }
      : { ...field };
  });
};

export const injectFormWithTargetPopulations = (
  form: FormJson,
  dataToInject: AnyObject[],
  dataFromSAR: boolean
) => {
  if (!dataToInject) return form;

  const fields = !dataFromSAR
    ? convertTargetPopulationsFromWPToSAREntity(dataToInject)
    : convertChoiceToEntity(dataToInject as Choice[]);

  const updatedFields = updateFieldChoicesByID(
    form.fields,
    "populations",
    fields
  );

  form.fields = updatedFields;
  return form;
};

/**
 * This function takes the target populations given from the form data and then filters out
 * any population that a user has answered "No" UNLESS that population
 * is included in the default population list. It does this by looking for a child object
 * called transitionBenchmarks_applicableToMfpDemonstration and seeing if it has a value of "No"
 * @param {AnyObject[]} targetPopulations - targetPopulations that are in the formData
 * @return {AnyObject[]} Target populations filtered to no long has No answers from
 * transitionBenchmarks_applicableToMfpDemonstration
 */
export const getDefaultAndApplicablePopulations = (
  targetPopulations: AnyObject[]
) => {
  const defaultPopulationNames = getDefaultTargetPopulationNames();

  const filteredPopulations = targetPopulations?.filter((population) => {
    const isDefault = defaultPopulationNames.includes(
      population.transitionBenchmarks_targetPopulationName
    );

    const isApplicable =
      population?.transitionBenchmarks_applicableToMfpDemonstration?.[0]?.value;
    return isDefault || isApplicable !== "No";
  });
  return filteredPopulations;
};

export const getApplicablePopulations = (targetPopulations: AnyObject[]) =>
  targetPopulations?.filter(
    (population) =>
      population?.transitionBenchmarks_applicableToMfpDemonstration &&
      population?.transitionBenchmarks_applicableToMfpDemonstration?.[0]
        ?.value !== "No"
  );

//This function is used to fill out the missing quarters in cards for evaluation plan and funding sources after a copy over
export const fillEmptyQuarters = (quarters: AnyObject[]) => {
  for (var i: number = quarters.length; i < 12; i++) {
    quarters.push({
      id: calculateNextQuarter(quarters[i - 1].id),
      value: notAnsweredText,
    });
  }
  return quarters;
};

export const filterResubmissionData = (form: FormJson, report: ReportShape) => {
  //make deep copies of formData
  const formCopy = structuredClone(form);
  const formDataFields = structuredClone(form.fields);

  const hideResubmissionField = () => {
    const removeResubmissionDataFields: any[] = formDataFields.filter(
      (data: AnyObject) =>
        data.id !== "generalInformation_resubmissionInformation"
    );
    formCopy.fields = [...removeResubmissionDataFields];

    return formCopy;
  };

  if (
    (report.reportType === "SAR" && !report.submissionCount) ||
    (report.status === ReportStatus.SUBMITTED &&
      report.submissionCount === 1 &&
      report.locked)
  ) {
    return hideResubmissionField();
  } else {
    return formCopy;
  }
};

export const addDynamicTableRowsValidation = (
  form: FormJson,
  formData: AnyObject
) => {
  const newFields = form.fields
    .filter((field) => field.type === ReportFormFieldType.DYNAMIC_OBJECT)
    .flatMap((field) => {
      const templates = field.props?.dynamicFields ?? [];
      const rows = formData?.[field.id];

      if (!templates.length || !Array.isArray(rows) || rows.length === 0)
        return [];

      return rows.flatMap((row: { id: string }) =>
        templates.map((template: DynamicFieldShape) => ({
          ...template,
          id: createTempDynamicId(template.id, row.id),
        }))
      );
    });

  return newFields.length > 0
    ? { ...form, fields: [...form.fields, ...newFields] }
    : form;
};
