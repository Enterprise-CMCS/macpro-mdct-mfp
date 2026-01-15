// utils
import {
  calculateShares,
  fieldTableTotals,
  getNumberValue,
  isEmptyOrNaN,
  perOfTwoRows,
  sumFields,
  sumOfRow,
  sumOfTwoRows,
} from "./calculations";

const row1 = ["label", "1", "2", "3", "4", "5"];
const row2 = ["label", "2", "3", "4", "5", "6"];
const rowWithNaN = ["label", "abc", "3", "4", "5", "6"];

describe("utils/calculations", () => {
  describe("sumOfRow()", () => {
    test("returns sum of array with start index of 1", () => {
      const sum = sumOfRow(row1, 1);
      expect(sum).toBe("15");
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
      const shares = calculateShares(123, 87);
      expect(shares).toEqual({
        percentageShare: 107.01,
        remainingShare: 15.99,
        total: 123,
      });
    });
  });

  describe("sumFields()", () => {
    const startsWithId = "mockFieldId";
    const endsWithId = "mockId";
    const fieldData = {
      [`${startsWithId}-${endsWithId}`]: 10,
      [`${startsWithId}_v1-${endsWithId}`]: 10,
      [`${startsWithId}_v2-${endsWithId}`]: "N/A",

      [`${startsWithId}-noMatch`]: 10,
      [`${startsWithId}_v1-noMatch`]: 10,
      [`${startsWithId}_v2-noMatch`]: 10,
    };
    const exclusions: any[] = [`${startsWithId}-${endsWithId}`];

    test("returns sum of field values", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId);
      expect(sum).toEqual(20);
    });

    test("returns sum with exclusions", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId, exclusions);
      expect(sum).toEqual(10);
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
    const tableId = "mockTableId";
    const fieldId = `${tableId}_mockFieldId`;
    const fieldSuffixesToCalculate = {
      percentageShare: "mockPercentageShare",
      remainingShare: "mockRemainingShare",
      total: "mockTotal",
    };
    const fieldType = "mockTotal";

    const fieldData = {
      [`${fieldId}-mockTotal`]: 0,
      [`${fieldId}-mockPercentageShare`]: 0,
      [`${fieldId}-mockRemainingShare`]: 0,

      [`${fieldId}2-mockTotal`]: 123,
      [`${fieldId}2-mockPercentageShare`]: 107.01,
      [`${fieldId}2-mockRemainingShare`]: 15.99,

      [`${tableId}-mockTotal`]: 123,
      [`${tableId}-mockPercentageShare`]: 107.01,
      [`${tableId}-mockRemainingShare`]: 15.99,
    };

    test("returns object with sum totals for fields", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldType,
        fieldValue,
        percentage,
        tableId,
      });

      expect(totals).toEqual({
        field: {
          total: 123,
          percentageShare: 107.01,
          remainingShare: 15.99,
        },
        table: {
          total: 246,
          percentageShare: 214.02,
          remainingShare: 31.98,
        },
      });
    });

    test("skips empty value", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldType,
        fieldValue: "",
        percentage,
        tableId,
      });

      expect(totals).toEqual({
        field: {
          total: "",
          percentageShare: 0,
          remainingShare: 0,
        },
        table: {
          total: 123,
          percentageShare: 107.01,
          remainingShare: 15.99,
        },
      });
    });

    test("skips N/A value", () => {
      const totals = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldType,
        fieldValue: "N/A",
        percentage,
        tableId,
      });

      expect(totals).toEqual({
        field: {
          total: "N/A",
          percentageShare: 0,
          remainingShare: 0,
        },
        table: {
          total: 123,
          percentageShare: 107.01,
          remainingShare: 15.99,
        },
      });
    });
  });
});
