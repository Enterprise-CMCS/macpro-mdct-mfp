import { FormJson, ReportRoute } from "../types";

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
