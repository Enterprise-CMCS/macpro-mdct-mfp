import { FormField, FormLayoutElement } from "types";

export const getAnswerFromField = (field: FormField | FormLayoutElement) => {
  switch (field.type) {
    case "text":
    case "textarea":
      return "mock text";
    case "number":
      return 1234;
    case "date":
      return "02/02/2026";
    case "checkbox":
      const choices = field.props?.choices as { id: string; label: string }[];
      return choices?.map((choice) => ({
        key: `${field.id}-${choice.id}`,
        value: choice.label,
      }));
    case "dynamic":
      return [{ id: crypto.randomUUID(), name: `mock ${field.props?.label}` }];
    case "radio":
      const choice = field.props?.choices?.[0] as { id: string; label: string };
      return [{ key: `${field.id}-${choice.id}`, value: choice.label }];
  }
  return "";
};

export const fillField = (fields: (FormField | FormLayoutElement)[]) => {
  const entries =
    fields.map((field) => [field.id, getAnswerFromField(field)]) ?? [];
  return Object.fromEntries(entries);
};
