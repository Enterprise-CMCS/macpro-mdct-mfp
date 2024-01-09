import { mockReportJson } from "../testing/setupJest";
import {
  compileValidationJsonFromRoutes,
  flattenReportRoutesArray,
} from "./validationDerivation";

describe("Test compileValidationJsonFromRoutes", () => {
  it("Compiles validation from forms of any kind", () => {
    const result = compileValidationJsonFromRoutes(
      flattenReportRoutesArray(mockReportJson.routes)
    );
    expect(result).toEqual({
      entityType: "objectArray",
      "mock-date-field": "date",
      "mock-drawer-text-field": "text",
      "mock-dropdown-field": "dropdown",
      "mock-modal-text-field": "text",
      "mock-number-field": "number",
      "mock-text-field": "text",
    });
  });
});
