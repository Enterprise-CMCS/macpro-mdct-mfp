import { EntityShape, ModalOverlayReportPageShape, ReportShape } from "types";
import { mapValidationTypesToSchema } from "utils/validation/validation";
import { object } from "yup";

export const getEntityStatus = (report: ReportShape, entity: EntityShape) => {
  if (!report?.formTemplate.validationJson) return;

  const reportFormValidation: { [k: string]: any } =
    report?.formTemplate.validationJson;

  /*
   * Split the formValidation into 2 groups. 1 for fields that rely on whether
   * they show or not from a parent choice, and another that aren't themselves a child
   */
  const parentFormElements = Object.fromEntries(
    Object.entries(reportFormValidation).filter(
      ([key]) => !reportFormValidation[key]?.parentFieldName
    )
  );

  const childFormElements = Object.fromEntries(
    Object.entries(reportFormValidation).filter(
      ([key]) => reportFormValidation[key]?.parentFieldName
    )
  );

  // Grab formTemplate from MLR and get the Overlay and Modal forms
  const reportRoute = report.formTemplate
    .routes[1] as unknown as ModalOverlayReportPageShape;
  const overlayForm = reportRoute?.overlayForm;
  const modalForm = reportRoute?.modalForm;

  /*
   * Filter the child fields so that only ones that the user has the ability to see
   * are up against validation. If the parent hasn't been checked, then we
   * don't want to validate its child fields because the user doesn't have
   * the ability to see them, and they aren't required for their original choice.
   */
  const filteredChildFormValidation = Object.fromEntries(
    Object.entries(childFormElements).filter(([key]) => {
      // Get the answer the user submitted for the parent choice
      const parentFieldName = reportFormValidation[key]?.parentFieldName;
      const parentAnswer = entity[parentFieldName]?.[0];

      // Find where the answer is in the formTemplate
      const fieldInReport =
        overlayForm?.fields.find((field) => field.id === parentFieldName) ||
        modalForm?.fields.find((field) => field.id === parentFieldName);
      // And if we couldn't find it, return validation as false
      if (!fieldInReport) return false;

      /*
       * Now check to see if the field in the formTemplate contains the child choice.
       * if it doesn't then we dont want to validate it
       */
      const fieldInReportsChoices = fieldInReport?.props?.choices;
      return fieldInReportsChoices?.find(
        (field: { label: any }) => field.label == parentAnswer?.value
      )?.children;
    })
  );

  const formFieldsToValidate = {
    ...parentFormElements,
    ...filteredChildFormValidation,
  };

  const formValidationSchema = mapValidationTypesToSchema(formFieldsToValidate);

  const formResolverSchema = object(formValidationSchema || {});

  try {
    return formResolverSchema.validateSync(entity);
  } catch (err) {
    return false;
  }
};

//NOTE: this function works on the assumption that the fieldData saved is validated
export const getInitiativeStatus = (formEntity: any, entity: EntityShape) => {
  const stepType = formEntity.stepType;

  //Important note: not tracking close out atm so it'll be disabled
  if (stepType === "closeOutInformation") return "disabled";

  //pull fields from form type
  const fields = formEntity.form
    ? formEntity.form.fields
    : formEntity.modalForm.fields;

  //filter the fields data down to a validation array
  const reportFormValidation = fields.map((field: any) => {
    return { [field.id]: field.validation };
  });

  //create an array to use as a lookup for fieldData
  const fieldKeyInReport = reportFormValidation.map(
    (validation: { [key: string]: string }) => {
      return Object.keys(validation)[0];
    }
  );

  //this step is to consolidate the code by converting entity into a loopable array if there's no array of stepType to loop through
  const entities = entity[stepType] ? (entity[stepType] as []) : [entity];
  if (entities.length > 0) {
    let isFilled = true;

    entities.forEach((child: any) => {
      //filter down to the data for the current status topic
      const filterdFieldData = fieldKeyInReport.map((item: string) => {
        return child[item];
      });

      //if any of the field data is empty, that means we're missing data and the status is automatically false
      isFilled = !filterdFieldData.every((field: any) => field)
        ? false
        : isFilled;
    });

    return isFilled;
  }

  return false;
};
