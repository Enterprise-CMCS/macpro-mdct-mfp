import { resetClearProp } from "./forms";
// types
import { FormField } from "types";
import {
  mockDateField,
  mockFormField,
  mockNestedFormField,
  mockNumberField,
} from "utils/testing/setupJest";

describe("Test resetClearProp", () => {
  it("should reset clear for choicelist fields and its nested children", async () => {
    const fields: FormField[] = [mockNestedFormField];
    resetClearProp(fields);
    expect(fields[0].props!.clear).toBe(false);
    for (let choice of fields[0].props!.choices) {
      expect(choice.props!.clear).toBe(false);
    }
  });

  it("should reset clear for text fields", async () => {
    const fields: FormField[] = [mockFormField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for number fields", async () => {
    const fields: FormField[] = [mockNumberField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for date fields", async () => {
    const fields: FormField[] = [mockDateField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });
});
