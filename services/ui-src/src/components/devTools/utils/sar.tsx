import { AnyObject, ReportRoute } from "types";
import { fillField, getAnswerFromField } from "./reports";

export const fillSARPage = (template: ReportRoute, fieldData: AnyObject) => {
  const page = template.path.split("/").at(-1);
  switch (page) {
    case "state-or-territory-specific-initiatives":
      const overlayFields =
        "overlayForm" in template ? fillField(template.overlayForm.fields) : {};
      const filledInit = (fieldData?.["initiative"] as [])?.map(
        (fieldData: any) => ({ ...fieldData, ...overlayFields })
      );
      return {
        ["initiative"]: [...(filledInit ?? [])],
      };
    default:
      {
        if ("form" in template) {
          const entries =
            template.form?.fields.map((field) => [
              field.id,
              getAnswerFromField(field),
            ]) ?? [];
          const newFields = Object.fromEntries(entries);
          return { ...newFields };
        }
      }
      return fieldData;
  }
};
