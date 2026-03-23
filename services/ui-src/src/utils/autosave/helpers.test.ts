// utils
import {
  createTempDynamicId,
  getFieldParts,
  getFmapForm,
  getValueToCombine,
  isCombinedCalculationField,
  isFieldType,
  isFmapPct,
  isTempDynamicField,
} from "./helpers";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockFieldId,
  mockFormId,
  mockTableId,
  mockTempDynamicFieldId,
} from "utils/testing/setupJest";

describe("utils/autosave/helpers", () => {
  describe("createTempDynamicId()", () => {
    test("returns new id", () => {
      const input = createTempDynamicId(
        `${mockDynamicTemplateId}-mockFieldType`,
        mockDynamicFieldId
      );
      const expectedResult = `${mockTempDynamicFieldId}-mockFieldType`;
      expect(input).toBe(expectedResult);
    });
  });

  describe("getFieldParts()", () => {
    test("splits field into parts", () => {
      const input = getFieldParts(`${mockFieldId}-mockFieldType`);
      const expectedResult = {
        dynamicFieldId: "",
        dynamicTemplateId: "",
        fieldId: mockFieldId,
        fieldType: "mockFieldType",
        formId: mockFormId,
        tableId: mockTableId,
      };
      expect(input).toEqual(expectedResult);
    });

    test("splits field into parts with dynamicId", () => {
      const input = getFieldParts(`${mockTempDynamicFieldId}-mockFieldType`);
      const expectedResult = {
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldId: mockTempDynamicFieldId,
        fieldType: "mockFieldType",
        formId: mockFormId,
        tableId: mockTableId,
      };
      expect(input).toEqual(expectedResult);
    });
  });

  describe("getFmapForm()", () => {
    test("returns table id", () => {
      const input = getFmapForm("fmap_mockTablePercentage");
      expect(input).toBe("mockTable");
    });
  });

  describe("isFieldType()", () => {
    test("returns true", () => {
      const input = isFieldType("fieldType", "fieldType");
      expect(input).toBe(true);
    });

    test("returns false", () => {
      const input = isFieldType("fieldType", "other");
      expect(input).toBe(false);
    });
  });

  describe("isFmapPct()", () => {
    test("returns true", () => {
      const input = isFmapPct("fmap_mockTablePercentage");
      expect(input).toBe(true);
    });

    test("returns false", () => {
      const input = isFmapPct("other");
      expect(input).toBe(false);
    });
  });

  describe("isTempDynamicField()", () => {
    test("returns true", () => {
      const input = isTempDynamicField(
        `${mockTempDynamicFieldId}-mockFieldType`
      );
      expect(input).toBe(true);
    });

    test("returns false", () => {
      const input = isTempDynamicField("other");
      expect(input).toBe(false);
    });
  });

  describe("isCombinedCalculationField()", () => {
    test("returns true", () => {
      const input = isCombinedCalculationField(
        "administrativeCosts_budgetCategory-totalComputable"
      );
      expect(input).toBe(true);
    });

    test("returns false", () => {
      const input = isCombinedCalculationField("other");
      expect(input).toBe(false);
    });
  });

  describe("getValueToCombine()", () => {
    test("returns value", () => {
      const input = getValueToCombine(
        "administrativeCosts_budgetCategory-totalComputable",
        {
          "administrativeCosts_subRecipients-totalComputable": "123.45",
        }
      );
      expect(input).toBe(123.45);
    });

    test("returns zero for undefined", () => {
      const input = getValueToCombine("other", {});
      expect(input).toBe(0);
    });
  });
});
