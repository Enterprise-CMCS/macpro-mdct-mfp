// types
import { InputChangeEvent, ReportFormFieldType } from "types";
// utils
import {
  calculationTableDynamicTotalsOnChange,
  calculationTableDynamicTotalsOnSave,
  calculationTableTotalsOnChange,
  calculationTableTotalsOnSave,
  setPercentageAndValue,
  summationTableDynamicTotalsOnChange,
  summationTableDynamicTotalsOnSave,
} from "./fields";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockFieldId,
  mockFormId,
  mockTableId,
  mockTempDynamicFieldId,
} from "utils/testing/setupJest";

const fieldValue = 123;
const percentageShare = 107.01;
const remainingShare = 15.99;
const percentage = 87;
const mocks = ["", "2"];

const baseFieldData = {
  [`fmap_${mockFormId}Percentage`]: percentage,
  ...Object.fromEntries(
    mocks.flatMap((mockId) => [
      [`${mockFieldId}${mockId}-percentageOverride`, undefined],
      [`${mockFieldId}${mockId}-totalComputable`, fieldValue],
      [`${mockFieldId}${mockId}-totalFederalShare`, percentageShare],
      [`${mockFieldId}${mockId}-totalStateTerritoryShare`, remainingShare],
    ])
  ),
  [`${mockTableId}-totalComputable`]: fieldValue * mocks.length,
  [`${mockTableId}-totalFederalShare`]: percentageShare * mocks.length,
  [`${mockTableId}-totalStateTerritoryShare`]: remainingShare * mocks.length,
  [mockDynamicTemplateId]: [
    {
      id: mockDynamicFieldId,
      totalComputable: 123.45,
      totalFederalShare: 123.45,
      totalStateTerritoryShare: 0,
      budgetedFullTimeEmployees: 0,
      filledFullTimeEmployees: 0,
    },
  ],
  [`${mockDynamicTemplateId}-totalComputable`]: 123.45,
  [`${mockDynamicTemplateId}-totalFederalShare`]: 123.45,
  [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 0,

  // Adding these fields to test filtering
  "unrelated-totalComputable": 12345,
  "unrelated-totalFederalShare": 12345,
  "unrelated-totalStateTerritoryShare": 12345,
};

describe("utils/autosave/fields", () => {
  describe("calculationTableDynamicTotalsOnSave()", () => {
    test("returns calculations for dynamic fields", () => {
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = calculationTableDynamicTotalsOnSave({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        formId: mockFormId,
        fieldData,
        fieldValue: 100,
        isPercentageOverrideUpdated: true,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              totalComputable: 100,
              totalFederalShare: 87,
              totalStateTerritoryShare: 13,
            },
          ],
        },
        {
          name: `${mockDynamicTemplateId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockDynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 87,
        },
        {
          name: `${mockDynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 13,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 301.02,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 44.98,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 346,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 301.02,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 44.98,
        },
        {
          name: "totals_totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 346,
        },
        {
          name: "totals_totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 301.02,
        },
        {
          name: "totals_totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 44.98,
        },
      ]);
    });
  });
  describe("calculationTableTotalsOnSave()", () => {
    test("returns calculations for fields", () => {
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = calculationTableTotalsOnSave({
        fieldData,
        fieldId: mockFieldId,
        fieldValue: 100,
        percentage,
        percentageOverride: undefined,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 87,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 13,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 317.46,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 28.99,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 346.45,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 317.46,
        },
        {
          name: "totals_totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 28.99,
        },
        {
          name: "totals_totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 346.45,
        },
        {
          name: "totals_totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 317.46,
        },
        {
          name: "totals_totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 28.99,
        },
      ]);
    });
  });

  describe("calculationTableDynamicTotalsOnChange()", () => {
    test("returns calculations for dynamic fields", () => {
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = calculationTableDynamicTotalsOnChange({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldValue: 100,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride: 50,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            name: mockDynamicFieldId,
            percentageOverride: 50,
            totalFederalShare: 87,
            totalStateTerritoryShare: 13,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 100,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 87,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 13,

        [`${mockTableId}-totalComputable`]: 346,
        [`${mockTableId}-totalFederalShare`]: 301.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 44.98,

        "totals_totalsSummary_serviceTotals-totalComputable": 346,
        "totals_totalsSummary_serviceTotals-totalStateTerritoryShare": 44.98,
        "totals_totalsSummary_serviceTotals-totalFederalShare": 301.02,
        "totals_totalsSummary_allTotals-totalComputable": 346,
        "totals_totalsSummary_allTotals-totalStateTerritoryShare": 44.98,
        "totals_totalsSummary_allTotals-totalFederalShare": 301.02,
      });
    });
  });

  describe("calculationTableTotalsOnChange()", () => {
    test("returns calculations for fields", () => {
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = calculationTableTotalsOnChange({
        fieldData,
        fieldId: mockFieldId,
        fieldValue: 100,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride: 50,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual({
        ...fieldData,
        [`${mockFieldId}-percentageOverride`]: 50,
        [`${mockFieldId}-totalComputable`]: 100,
        [`${mockFieldId}-totalFederalShare`]: 87,
        [`${mockFieldId}-totalStateTerritoryShare`]: 13,

        [`${mockTableId}-totalComputable`]: 346.45,
        [`${mockTableId}-totalFederalShare`]: 317.46,
        [`${mockTableId}-totalStateTerritoryShare`]: 28.99,

        "totals_totalsSummary_serviceTotals-totalComputable": 346.45,
        "totals_totalsSummary_serviceTotals-totalStateTerritoryShare": 28.99,
        "totals_totalsSummary_serviceTotals-totalFederalShare": 317.46,
        "totals_totalsSummary_allTotals-totalComputable": 346.45,
        "totals_totalsSummary_allTotals-totalStateTerritoryShare": 28.99,
        "totals_totalsSummary_allTotals-totalFederalShare": 317.46,
      });
    });
  });

  describe("summationTableDynamicTotalsOnSave()", () => {
    test("returns sums for dynamic fields", () => {
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = summationTableDynamicTotalsOnSave({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        formId: mockFormId,
        fieldData,
        fieldType: "budgetedFullTimeEmployees",
        fieldValue: 100,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              budgetedFullTimeEmployees: 100,
            },
          ],
        },
        {
          name: `${mockDynamicTemplateId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockDynamicTemplateId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockTableId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns sums after removed personnel", () => {
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = summationTableDynamicTotalsOnSave({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        formId: mockFormId,
        fieldData,
        fieldValue: 0,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              totalComputable: 123.45,
              totalFederalShare: 123.45,
              totalStateTerritoryShare: 0,
              budgetedFullTimeEmployees: 0,
              filledFullTimeEmployees: 0,
            },
          ],
        },
        {
          name: `${mockDynamicTemplateId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockDynamicTemplateId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });
  });

  describe("summationTableDynamicTotalsOnChange()", () => {
    test("returns sums for dynamic fields", () => {
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = summationTableDynamicTotalsOnChange({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldType: "budgetedFullTimeEmployees",
        fieldValue: 100,
        percentage,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            totalComputable: 123.45,
            totalFederalShare: 123.45,
            totalStateTerritoryShare: 0,
            budgetedFullTimeEmployees: 0,
            filledFullTimeEmployees: 0,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 123.45,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 123.45,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 0,
        [`${mockDynamicTemplateId}-budgetedFullTimeEmployees`]: 100,
        [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 0,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,
        [`${mockTableId}-budgetedFullTimeEmployees`]: 100,
        [`${mockTableId}-filledFullTimeEmployees`]: 0,
      });
    });

    test("returns sums after removed personnel", () => {
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = summationTableDynamicTotalsOnChange({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        fieldData,
        fieldValue: 0,
        percentage,
        tableId: mockTableId,
      });
      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            totalComputable: 123.45,
            totalFederalShare: 123.45,
            totalStateTerritoryShare: 0,
            budgetedFullTimeEmployees: 0,
            filledFullTimeEmployees: 0,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 123.45,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 123.45,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 0,
        [`${mockDynamicTemplateId}-budgetedFullTimeEmployees`]: 0,
        [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 0,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,
        [`${mockTableId}-budgetedFullTimeEmployees`]: 0,
        [`${mockTableId}-filledFullTimeEmployees`]: 0,
      });
    });
  });

  describe("setPercentageAndValue()", () => {
    test("returns percentages and values for updated percentageOverride", () => {
      const fieldData = structuredClone(baseFieldData);
      const name = `${mockFieldId}-percentageOverride`;
      const mockEvent = {
        target: {
          name,
          value: 50,
        },
      } as unknown as InputChangeEvent;
      const updatedFields = setPercentageAndValue(
        mockEvent,
        fieldData,
        percentage
      );
      expect(updatedFields).toEqual({
        name,
        percentage: 50,
        percentageOverride: 50,
        value: 123,
      });
    });

    test("returns percentages and values for empty percentageOverride", () => {
      const fieldData = structuredClone(baseFieldData);
      const name = `${mockFieldId}-percentageOverride`;
      const mockEvent = {
        target: {
          name,
          value: "",
        },
      } as unknown as InputChangeEvent;
      const updatedFields = setPercentageAndValue(
        mockEvent,
        fieldData,
        percentage
      );
      expect(updatedFields).toEqual({
        name,
        percentage: 87,
        percentageOverride: "",
        value: 123,
      });
    });

    test("returns percentages and values for updated dynamic field", () => {
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const name = `${mockTempDynamicFieldId}-totalComputable`;
      const mockEvent = {
        target: {
          name,
          value: 100,
        },
      } as unknown as InputChangeEvent;
      const updatedFields = setPercentageAndValue(
        mockEvent,
        fieldData,
        percentage
      );
      expect(updatedFields).toEqual({
        name,
        percentage: 87,
        percentageOverride: undefined,
        value: 100,
      });
    });
  });
});
