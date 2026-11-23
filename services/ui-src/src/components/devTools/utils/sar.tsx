import { AnyObject, ReportRoute } from "types";
import { getAnswerFromField } from "./reports";

export const fillSARPage = (template: ReportRoute, fieldData: AnyObject) => {
  switch (template.path) {
    case "":
      return;
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
