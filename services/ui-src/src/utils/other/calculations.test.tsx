// utils
import { DynamicFieldShape } from "types";
import {
  calculateShares,
  fieldTableTotals,
  getNumberValue,
  isEmptyOrNaN,
  perOfTwoRows,
  sumFields,
  sumDynamicFields,
  sumOfRow,
  sumOfTwoRows,
  dynamicFieldTableTotals,
} from "./calculations";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockFieldId,
  mockTableId,
} from "utils/testing/mockForm";

const row1 = ["label", "1", "2", "3", "4", "5"];
const row2 = ["label", "2", "3", "4", "5", "6"];
const rowWithNaN = ["label", "abc", "3", "4", "5", "6"];
const rowWithNaNAboveStartIndex = ["1", "abc", "3", "4", "5", "6"];

describe("utils/calculations", () => {
  describe("sumOfRow()", () => {
    test("returns sum of array with start index of 1", () => {
      const sum = sumOfRow(row1, 1);
      expect(sum).toBe("15");
    });

    test("returns sum of array, skipping NaN above start index", () => {
      const sum = sumOfRow(rowWithNaNAboveStartIndex, 0);
      expect(sum).toBe("19");
    });

    test("returns NaN for array that includes non-number", () => {
      const sum = sumOfRow(rowWithNaN, 1);
      expect(sum).toBe("NaN");
    });

    test("returns dash for empty array", () => {
      const sum = sumOfRow([]);
      expect(sum).toBe("-");
    });
  });

  describe("sumOfTwoRows()", () => {
    test("returns array of sums of two rows", () => {
      const sum = sumOfTwoRows(row1, row2);
      expect(sum).toEqual(["3", "5", "7", "9", "11"]);
    });

    test("returns dash for NaN", () => {
      const sum = sumOfTwoRows(row1, rowWithNaN);
      expect(sum).toEqual(["-", "5", "7", "9", "11"]);
    });

    test("returns dashes for empty array", () => {
      const sum = sumOfTwoRows(row1, []);
      expect(sum).toEqual(["-", "-", "-", "-", "-"]);
    });
  });

  describe("perOfTwoRows()", () => {
    test("returns array of percentages of two rows", () => {
      const per = perOfTwoRows(row1, row2);
      expect(per).toEqual(["50.00%", "66.67%", "75.00%", "80.00%", "83.33%"]);
    });

    test("returns dash for NaN", () => {
      const sum = perOfTwoRows(row1, rowWithNaN);
      expect(sum).toEqual(["-", "66.67%", "75.00%", "80.00%", "83.33%"]);
    });

    test("returns dashes for empty array", () => {
      const sum = perOfTwoRows(row1, []);
      expect(sum).toEqual(["-", "-", "-", "-", "-"]);
    });
  });

  describe("calculateShares()", () => {
    test("returns object of share values", () => {
      const shares = calculateShares(100, 10);
      expect(shares).toEqual({
        percentage: 10,
        percentageShare: 10,
        remainingShare: 90,
        total: 100,
      });
    });

    test("returns object of share values with decimals", () => {
      const shares = calculateShares(123, 87);
      expect(shares).toEqual({
        percentage: 87,
        percentageShare: 107.01,
        remainingShare: 15.99,
        total: 123,
      });
    });

    test("returns object of share values for decimal input", () => {
      const shares = calculateShares(123.45, 87);
      expect(shares).toEqual({
        percentage: 87,
        percentageShare: 107.4,
        remainingShare: 16.05,
        total: 123.45,
      });
    });
  });

  describe("sumFields()", () => {
    const startsWithId = "mockFieldId";
    const endsWithId = "mockId";
    const fieldData = {
      [`${startsWithId}-${endsWithId}`]: 12.34,
      [`${startsWithId}_v1-${endsWithId}`]: 3.14,
      [`${startsWithId}_v2-${endsWithId}`]: "N/A",
      [`${startsWithId}_v3-${endsWithId}`]: [
        {
          id: "mock1",
          name: "10",
        },
        {
          id: "mock2",
          name: "10",
        },
        {
          id: "mock3",
          name: "N/A",
        },
      ],

      [`${startsWithId}-noMatch`]: 10,
      [`${startsWithId}_v1-noMatch`]: 10,
      [`${startsWithId}_v2-noMatch`]: 10,
    };

    test("returns sum of field values", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId);
      expect(sum).toEqual(35.48);
    });

    test("returns sum with exclusions", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId, [
        `${startsWithId}-${endsWithId}`,
        `${startsWithId}_v1-${endsWithId}`,
      ]);
      expect(sum).toEqual(20);
    });

    test("returns zero for missing fieldData", () => {
      const sum = sumFields(undefined, startsWithId, endsWithId);
      expect(sum).toEqual(0);
    });
  });

  describe("sumDynamicFields()", () => {
    const key = "mockCalculationId";
    const values: DynamicFieldShape[] = [
      {
        id: "mock1",
        name: "mock1",
        [key]: "12.34",
      },
      {
        id: "mock2",
        name: "mock2",
        [key]: "3.14",
      },
      {
        id: "mock2",
        name: "mock2",
        noMatch: "10",
      },
    ];

    test("returns sum of field values by key", () => {
      const sum = sumDynamicFields(values, key);
      expect(sum).toBe(15.48);
    });
  });

  describe("isEmptyOrNaN()", () => {
    test("returns true for N/A", () => {
      expect(isEmptyOrNaN("N/A")).toBe(true);
    });

    test("returns true for empty value", () => {
      expect(isEmptyOrNaN("")).toBe(true);
    });

    test("returns false for number", () => {
      expect(isEmptyOrNaN("123")).toBe(false);
    });
  });

  describe("getNumberValue()", () => {
    test("returns number", () => {
      expect(getNumberValue("123")).toBe(123);
    });

    test("returns zero", () => {
      expect(getNumberValue("N/A")).toBe(0);
    });

    test("returns default value", () => {
      expect(getNumberValue("", 12345)).toBe(12345);
    });
  });

  describe("fieldTableTotals()", () => {
    const fieldValue = 123;
    const percentage = 87;
    const fieldSuffixesToCalculate = {
      percentageShare: "mockPercentageShare",
      remainingShare: "mockRemainingShare",
      total: "mockTotal",
    };

    const fieldData = {
      [`${mockFieldId}-mockTotal`]: 0,
      [`${mockFieldId}-mockPercentageShare`]: 0,
      [`${mockFieldId}-mockRemainingShare`]: 0,

      [`${mockFieldId}2-mockTotal`]: 123,
      [`${mockFieldId}2-mockPercentageShare`]: 107.01,
      [`${mockFieldId}2-mockRemainingShare`]: 15.99,

      [`${mockTableId}-mockTotal`]: 123,
      [`${mockTableId}-mockPercentageShare`]: 107.01,
      [`${mockTableId}-mockRemainingShare`]: 15.99,
    };

    test("returns object with sum totals for fields", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId: mockFieldId,
        fieldSuffixesToCalculate,
        fieldValue,
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          percentage: 87,
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
        table: {
          percentageShare: 214.02,
          remainingShare: 31.98,
          total: 246,
        },
      });
    });

    test("skips empty value", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId: mockFieldId,
        fieldSuffixesToCalculate,
        fieldValue: "",
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          total: "",
          percentage: 87,
          percentageShare: 0,
          remainingShare: 0,
        },
        table: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
      });
    });

    test("skips N/A value", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId: mockFieldId,
        fieldSuffixesToCalculate,
        fieldValue: "N/A",
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          percentage: 87,
          percentageShare: 0,
          remainingShare: 0,
          total: "N/A",
        },
        table: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
      });
    });
  });

  describe("dynamicFieldTableTotals()", () => {
    const fieldValue = 123;
    const percentage = 87;
    const fieldSuffixesToCalculate = {
      percentageShare: "mockPercentageShare",
      remainingShare: "mockRemainingShare",
      total: "mockTotal",
    };

    const fieldData = {
      [mockDynamicTemplateId]: [
        {
          id: mockDynamicFieldId,
          mockTotal: 123.45,
          mockPercentageShare: 123.45,
          mockRemainingShare: 0,
        },
      ],
      [`${mockDynamicTemplateId}-mockTotal`]: 123.45,
      [`${mockDynamicTemplateId}-mockPercentageShare`]: 123.45,
      [`${mockDynamicTemplateId}-mockRemainingShare`]: 0,

      [`${mockFieldId}-mockTotal`]: 123,
      [`${mockFieldId}-mockPercentageShare`]: 107.01,
      [`${mockFieldId}-mockRemainingShare`]: 15.99,

      [`${mockTableId}-mockTotal`]: 123,
      [`${mockTableId}-mockPercentageShare`]: 107.01,
      [`${mockTableId}-mockRemainingShare`]: 15.99,
    };

    test("returns object with sum totals for fields", () => {
      const totals = dynamicFieldTableTotals({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldSuffixesToCalculate,
        fieldValue,
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          percentage: 87,
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
        template: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
        table: {
          percentageShare: 214.02,
          remainingShare: 31.98,
          total: 246,
        },
      });
    });

    test("skips empty value", () => {
      const totals = dynamicFieldTableTotals({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldSuffixesToCalculate,
        fieldValue: "",
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          total: "",
          percentage: 87,
          percentageShare: 0,
          remainingShare: 0,
        },
        template: {
          percentageShare: 0,
          remainingShare: 0,
          total: 0,
        },
        table: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
      });
    });

    test("skips N/A value", () => {
      const totals = dynamicFieldTableTotals({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldSuffixesToCalculate,
        fieldValue: "N/A",
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          percentage: 87,
          percentageShare: 0,
          remainingShare: 0,
          total: "N/A",
        },
        template: {
          percentageShare: 0,
          remainingShare: 0,
          total: 0,
        },
        table: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
      });
    });

    test("skips empty dynamic data", () => {
      const updatedFieldData = {
        ...fieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const totals = dynamicFieldTableTotals({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData: updatedFieldData,
        fieldSuffixesToCalculate,
        fieldValue: "N/A",
        percentage,
        tableId: mockTableId,
      });

      expect(totals).toEqual({
        field: {
          percentage: 87,
          percentageShare: 0,
          remainingShare: 0,
          total: "N/A",
        },
        template: {
          percentageShare: 0,
          remainingShare: 0,
          total: 0,
        },
        table: {
          percentageShare: 107.01,
          remainingShare: 15.99,
          total: 123,
        },
      });
    });
  });
});
