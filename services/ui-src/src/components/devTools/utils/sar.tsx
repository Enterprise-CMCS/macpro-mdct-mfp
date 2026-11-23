import { AnyObject, ReportRoute } from "types";
import { getAnswerFromField } from "./reports";

export const fillSARPage = (template: ReportRoute, fieldData: AnyObject) => {
  const page = template.path.split("/").at(-1);
  console.log(page);
  switch (page) {
    case "state-or-territory-specific-initiatives":
      console.log("template", template);
      console.log("fieldData", fieldData);
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
