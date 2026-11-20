import { fillField, getAnswerFromField } from "./reports";
import {
  mockDynamicFieldId,
  mockStandardReportPageJson,
} from "utils/testing/mockForm";

describe("Test dev report functions", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        randomUUID: vi.fn(() => mockDynamicFieldId),
      },
    });
  });
  test("fillField", () => {
    const entries = fillField(mockStandardReportPageJson.form.fields);
    expect(entries).toEqual({
      "mock-text-field": "mock text",
      "mock-date-field": "02/02/2026",
      "mock-number-field": 1234,
    });
  });
  test("getAnswerFromField", () => {
    const fields = [
      {
        id: "mock-checkbox",
        type: "checkbox",
        props: {
          choices: [{ id: "check-1", label: "checkbox 1" }],
        },
        validation: "",
        answer: [{ key: "mock-checkbox-check-1", value: "checkbox 1" }],
      },
      {
        id: "mock-dynamic",
        type: "dynamic",
        props: {
          label: "dynamic 1",
        },
        validation: "",
        answer: [
          {
            id: mockDynamicFieldId,
            name: "mock dynamic 1",
          },
        ],
      },
      {
        id: "mock-radio",
        type: "radio",
        props: {
          choices: [{ id: "radio-1", label: "radio 1" }],
        },
        validation: "",
        answer: [{ key: "mock-radio-radio-1", value: "radio 1" }],
      },
      {
        id: "mock-bad-type",
        type: "fake",
        answer: undefined,
      },
    ];

    for (const field of fields) {
      const answers = getAnswerFromField(field);
      expect(answers).toEqual(field.answer);
    }
  });
});
