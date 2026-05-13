import { isClosedInitiative, toggleOptional } from "./initiatives";
// types
import { ReportFormFieldType, ValidationType } from "types";

describe("utils/reports/initiatives", () => {
  describe("isClosedInitiative()", () => {
    test("returns true for actualEndDate", () => {
      const entity = {
        closeOutInformation_actualEndDate: "01/01/2026",
      };

      const result = isClosedInitiative(entity);
      expect(result).toBe(true);
    });

    test("returns true for initiativeStatus", () => {
      const entity = {
        closeOutInformation_initiativeStatus: [
          {
            key: "mockId",
            value: "mock value",
          },
        ],
      };

      const result = isClosedInitiative(entity);
      expect(result).toBe(true);
    });

    test("returns false", () => {
      const result = isClosedInitiative({});
      expect(result).toBe(false);
    });
  });

  describe("toggleOptional()", () => {
    const form = {
      id: "mockId",
      fields: [
        {
          id: "mockSectionHeaderId",
          type: ReportFormFieldType.SECTION_HEADER,
        },
        {
          id: "mockNumberFieldId",
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.NUMBER,
        },
        {
          id: "mockCustomFieldId",
          type: ReportFormFieldType.TEXT,
          validation: {
            type: ValidationType.TEXT_CUSTOM,
          },
        },
        {
          id: "mockTextFieldId",
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT_OPTIONAL,
        },
      ],
    };
    test("changes validation to optional", () => {
      const result = toggleOptional(form, true);
      expect(result).toEqual({
        ...form,
        fields: [
          {
            id: "mockSectionHeaderId",
            type: ReportFormFieldType.SECTION_HEADER,
          },
          {
            id: "mockNumberFieldId",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.NUMBER_OPTIONAL,
          },
          {
            id: "mockCustomFieldId",
            type: ReportFormFieldType.TEXT,
            validation: {
              type: ValidationType.TEXT_CUSTOM_OPTIONAL,
            },
          },
          {
            id: "mockTextFieldId",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT_OPTIONAL,
          },
        ],
      });
    });

    test("leaves validation as-is", () => {
      const result = toggleOptional(form, false);
      expect(result).toEqual(form);
    });
  });
});
