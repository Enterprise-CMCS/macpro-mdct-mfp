import { FormJson, ReportJson, ReportRoute, ReportType } from "../types";
import { isFieldElement, isLayoutElement, iterateAllForms } from "./utils";
import { formTemplateForReportType } from "./versioning";

describe("Test form contents", () => {
  const allFormTemplates = () => {
    const templates = [];
    for (let reportType of Object.values(ReportType)) {
      try {
        const formTemplate = formTemplateForReportType(reportType);
        templates.push(formTemplate);
      } catch (error: any) {
        if (!/not implemented/i.test(error.message)) {
          throw error;
        }
      }
    }
    return templates;
  };

  const flattenRoutes = (routes: ReportRoute[]) => {
    let flatRoutes: ReportRoute[] = [];
    for (let route of routes) {
      flatRoutes.push(route);
      if (route.children) {
        flatRoutes = flatRoutes.concat(flattenRoutes(route.children));
      }
    }
    return flatRoutes;
  };

  const allFormsIn = (formTemplate: ReportJson) => {
    const forms: FormJson[] = [];
    for (let route of flattenRoutes(formTemplate.routes)) {
      for (let possibleForm of Object.values(route)) {
        // This covers route.form, route.modalForm, etc
        if (possibleForm?.fields) {
          forms.push(possibleForm);
        }
      }
    }
    return forms;
  };

  /*
   * Every field is either a field (like a textbox, or a date), or not a field
   * (like a section header). But our type guards are not particularly robust.
   * When a new field type is added, the type guards may need to be updated.
   * That will happen rarely enough that we will forget to do so;
   * this test is here to remind us.
   */
  it("Should contain fields of known types", () => {
    for (let formTemplate of allFormTemplates()) {
      for (let form of allFormsIn(formTemplate)) {
        for (let field of form.fields) {
          const isField = isFieldElement(field);
          const isLayout = isLayoutElement(field);
          if (isField && isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          } else if (!isField && !isLayout) {
            throw new Error(
              `Field '${field.id}' of type ${field.type} has confused the field type guards! Update them.`
            );
          }
        }
      }
    }
  });
});

describe("iterateAllForms", () => {
  it("should find forms of all types, in child routes and entity steps", () => {
    const formTemplate = {
      routes: [
        {
          form: {
            id: "standard, top level",
          },
          modalForm: {
            id: "modal, top level",
          },
        },
        {
          children: [
            {
              drawerForm: {
                id: "drawer in child",
              },
            },
            {
              children: [
                {
                  form: {
                    id: "standard in nested child",
                  },
                },
              ],
            },
            {
              entitySteps: [
                {
                  modalForm: {
                    id: "modal in entity steps",
                  },
                },
              ],
            },
          ],
        },
      ] as ReportRoute[],
    };

    const expectedFormIds = [
      "standard, top level",
      "modal, top level",
      "drawer in child",
      "standard in nested child",
      "modal in entity steps",
    ];

    let i = 0;
    for (let form of iterateAllForms(formTemplate.routes)) {
      expect(form.id).toBe(expectedFormIds[i]);
      i += 1;
    }
  });
});
