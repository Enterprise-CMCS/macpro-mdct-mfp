// utils
import {
  calculateShares,
  fieldTableTotals,
  perOfTwoRows,
  sumFields,
  sumOfRow,
  sumOfTwoRows,
} from "./calculations";

const row1 = ["1", "label", "2", "3", "4", "5"];
const row2 = ["label", "2", "3", "4", "5", "6"];

describe("utils/calculations", () => {
  describe("sumOfRow()", () => {
    test("returns sum of array", () => {
      const sum = sumOfRow(row1);
      expect(sum).toBe("15");
    });

    test("returns NaN for array that includes non-number", () => {
      const sum = sumOfRow(row1, 1);
      expect(sum).toBe("NaN");
    });

    test("returns dash for empty array", () => {
      const sum = sumOfRow([], 0);
      expect(sum).toBe("-");
    });
  });

  describe("sumOfTwoRows()", () => {
    test("returns array of sums of two rows", () => {
      const sum = sumOfTwoRows(row1, row2);
      expect(sum).toEqual(["-", "5", "7", "9", "11"]);
    });
  });

  describe("perOfTwoRows()", () => {
    test("returns array of percentages of two rows", () => {
      const per = perOfTwoRows(row1, row2);
      expect(per).toEqual(["-", "66.67%", "75.00%", "80.00%", "83.33%"]);
    });
  });

  describe("calculateShares()", () => {
    test("returns sum fo field values", () => {
      const shares = calculateShares(123, 87);
      expect(shares).toEqual({
        totalFederalShare: 107.01,
        totalStateTerritoryShare: 15.99,
      });
    });
  });

  describe("sumFields()", () => {
    const startsWithId = "mockFieldId";
    const endsWithId = "mockId";
    const fieldData = {
      [`${startsWithId}-${endsWithId}`]: 10,
      [`${startsWithId}_mockId-${endsWithId}`]: 10,
      [`${startsWithId}_mockId2-${endsWithId}`]: null,

      [`${startsWithId}-noMatch`]: 10,
      [`${startsWithId}_mockId-noMatch`]: 10,
      [`${startsWithId}_mockId2-noMatch`]: 10,
    };
    const exclusions: any[] = [`${startsWithId}-${endsWithId}`];

    test("returns sum fo field values", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId);
      expect(sum).toEqual(20);
    });

    test("returns sum with exclusions", () => {
      const sum = sumFields(fieldData, startsWithId, endsWithId, exclusions);
      expect(sum).toEqual(10);
    });
  });

  describe("fieldTableTotals()", () => {
    const fieldValue = 123;
    const percentage = 87;
    const fieldId = "mockTableId_mockFieldId";
    const tableId = "mockTableId";
    const fieldData = {
      [`${fieldId}-totalComputable`]: 0,
      [`${fieldId}-totalFederalShare`]: 0,
      [`${fieldId}-totalStateTerritoryShare`]: 0,

      [`${fieldId}_mockId-totalComputable`]: 0,
      [`${fieldId}_mockId-totalFederalShare`]: 0,
      [`${fieldId}_mockId-totalStateTerritoryShare`]: 0,

      [`${tableId}-totalComputable`]: 0,
      [`${tableId}-totalFederalShare`]: 0,
      [`${tableId}-totalStateTerritoryShare`]: 0,
    };

    test("returns object with sum totals for fields", () => {
      const totals = fieldTableTotals({
        fieldValue,
        percentage,
        fieldId,
        tableId,
        fieldData,
      });

      expect(totals).toEqual({
        fieldTotalComputable: 123,
        fieldTotalFederalShare: 107.01,
        fieldTotalStateTerritoryShare: 15.99,
        tableTotalComputable: 123,
        tableTotalFederalShare: 107.01,
        tableTotalStateTerritoryShare: 15.99,
      });
    });
  });
});
