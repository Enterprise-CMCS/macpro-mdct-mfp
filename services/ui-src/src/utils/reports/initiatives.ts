// types
import { AnyObject, Choice, FormJson } from "types";
// utils
import { isFieldElement } from "utils";

const closeOutYesKey = "closeOutInformation_closeOut-closeOutInitiativeYes";

export const isClosedInitiative = (data?: AnyObject) => {
  // An initiative is considered closed if the close-out radio is set
  const closeOutChoice = data?.closeOutInformation_closeOut;
  if (Array.isArray(closeOutChoice)) {
    return closeOutChoice.some(
      (choice: Choice) => choice.key === closeOutYesKey
    );
  }

  // reports saved before the radio existed only have the close-out answers
  return Boolean(
    data?.closeOutInformation_actualEndDate ||
    data?.closeOutInformation_initiativeStatus?.length > 0
  );
};

export const toggleOptional = (form: FormJson, updateAlert: boolean) => {
  if (!updateAlert) return form;

  const changeToOptional = (type: string) =>
    type.endsWith("Optional") ? type : `${type}Optional`;

  const fields = form.fields.map((field) => {
    if (!isFieldElement(field)) return field;

    const { validation } = field;

    const updatedValidation =
      typeof validation === "string"
        ? changeToOptional(validation)
        : { ...validation, type: changeToOptional(validation.type) };

    return { ...field, validation: updatedValidation };
  });

  return { ...form, fields };
};
