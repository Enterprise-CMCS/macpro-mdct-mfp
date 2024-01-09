import { FormField, FormJson, FormLayoutElement, ReportRoute } from "../types";

export function isFieldElement(
  field: FormField | FormLayoutElement
): field is FormField {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  const formLayoutElementTypes = ["sectionHeader", "sectionContent"];
  return !formLayoutElementTypes.includes(field.type);
}

export function isLayoutElement(
  field: FormField | FormLayoutElement
): field is FormLayoutElement {
  /*
   * This function is duplicated in ui-src/src/types/formFields.ts
   * If you change it here, change it there!
   */
  return (field as FormField).validation === undefined;
}

export function* iterateAllForms(
  routes: ReportRoute[]
): Generator<FormJson, void, unknown> {
  for (let route of routes) {
    if (route.form) {
      yield route.form;
    }
    if (route.modalForm) {
      yield route.modalForm;
    }
    if (route.drawerForm) {
      yield route.drawerForm;
    }
    if (route.children) {
      yield* iterateAllForms(route.children);
    }
    if (route.entitySteps) {
      yield* iterateAllForms(route.entitySteps);
    }
  }
}
