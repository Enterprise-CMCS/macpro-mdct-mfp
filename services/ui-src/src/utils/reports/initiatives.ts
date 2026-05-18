// types
import { AnyObject, FormJson } from "types";
// utils
import { isFieldElement } from "utils";

export const isClosedInitiative = (data?: AnyObject) => {
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
