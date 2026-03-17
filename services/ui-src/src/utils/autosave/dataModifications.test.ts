// types
import { ReportFormFieldType } from "types";
import { FieldInfo } from "./autosave";
// utils
import {
  updatedFieldDataOnFieldChange,
  updatedNumberFields,
  updatedTextFields,
} from "./dataModifications";
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
  [`${mockDynamicTemplateId}-budgetedFullTimeEmployees`]: 0,
  [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 0,

  // Adding these fields to test filtering
  "unrelated-totalComputable": 12345,
  "unrelated-totalFederalShare": 12345,
  "unrelated-totalStateTerritoryShare": 12345,
};

describe("utils/autosave/dataModifications", () => {
  describe("updatedNumberFields()", () => {
    test("returns fields for updated totalComputable", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 107.01,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 337.47,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 31.98,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated totalComputable with percentageOverride", () => {
      const fieldData = {
        ...baseFieldData,
        [`${mockFieldId}-percentageOverride`]: 60,
      };
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 73.8,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 49.2,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 304.26,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 65.19,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated dynamic totalComputable", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              totalComputable: 123,
              totalFederalShare: 107.01,
              totalStateTerritoryShare: 15.99,
              budgetedFullTimeEmployees: 0,
              filledFullTimeEmployees: 0,
            },
          ],
        },
        {
          name: `${mockDynamicTemplateId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${mockDynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 107.01,
        },
        {
          name: `${mockDynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 321.03,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 47.97,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated percentageOverride", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-percentageOverride`,
          type: ReportFormFieldType.NUMBER,
          value: 50,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-percentageOverride`,
          type: ReportFormFieldType.NUMBER,
          value: 50,
        },
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 61.5,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 61.5,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 291.96,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 77.49,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for empty percentageOverride", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-percentageOverride`,
          type: ReportFormFieldType.NUMBER,
          value: "",
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-percentageOverride`,
          type: ReportFormFieldType.NUMBER,
          value: "",
        },
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 107.01,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 337.47,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 31.98,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated dynamic percentageOverride", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-percentageOverride`,
          type: ReportFormFieldType.NUMBER,
          value: 50,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              percentageOverride: 50,
              totalComputable: 123.45,
              totalFederalShare: 61.73,
              totalStateTerritoryShare: 61.72,
              budgetedFullTimeEmployees: 0,
              filledFullTimeEmployees: 0,
            },
          ],
        },
        {
          name: `${mockDynamicTemplateId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123.45,
        },
        {
          name: `${mockDynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 61.73,
        },
        {
          name: `${mockDynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 61.72,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 275.75,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 93.7,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },

        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },

        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated dynamic budgetedFullTimeEmployees", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
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
              budgetedFullTimeEmployees: 100,
              filledFullTimeEmployees: 0,
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

    test("returns fields for updated dynamic filledFullTimeEmployees", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
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
              filledFullTimeEmployees: 100,
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
          value: 100,
        },
        {
          name: `${mockTableId}-budgetedFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-filledFullTimeEmployees`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ]);
    });

    test("returns fields for no matching fmap percentage (defaults to 100%)", () => {
      const fieldData = {
        ...baseFieldData,
        [`fmap_${mockFormId}Percentage`]: undefined,
      };
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ];

      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346.45,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 330.46,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for updated percentage", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `fmap_${mockFormId}Percentage`,
          type: ReportFormFieldType.NUMBER,
          value: 30,
        },
      ];

      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: "fmap_mockFormIdPercentage",
          type: ReportFormFieldType.NUMBER,
          value: 30,
        },
        {
          name: `${mockFieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 36.9,
        },
        {
          name: `${mockFieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 86.1,
        },
        {
          name: `${mockFieldId}2-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 36.9,
        },
        {
          name: `${mockFieldId}2-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 86.1,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 73.8,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 172.2,
        },
        {
          name: `${mockDynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 37.04,
        },
        {
          name: `${mockDynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 86.41,
        },
        {
          name: "totalsSummary_serviceTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_serviceTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalComputable",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalFederalShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: "totalsSummary_allTotals-totalStateTerritoryShare",
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
      ]);
    });

    test("returns fields for no matching case", () => {
      const fields: FieldInfo[] = [
        {
          name: "other",
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields);
      expect(updatedFields).toEqual([
        {
          name: "other",
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ]);
    });
  });

  describe("updatedTextFields()", () => {
    test("updates existing values for dynamic text", () => {
      const fieldData = structuredClone(baseFieldData);
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-category`,
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFields = updatedTextFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              category: "Mock text",
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
      ]);
    });

    test("adds new values for dynamic text", () => {
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-category`,
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFields = updatedTextFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: mockDynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              category: "Mock text",
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
            },
          ],
        },
      ]);
    });

    test("returns fields for no matching case", () => {
      const fields: FieldInfo[] = [
        {
          name: "other",
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFields = updatedTextFields(fields);
      expect(updatedFields).toEqual([
        {
          name: "other",
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ]);
    });
  });

  describe("updatedFieldDataOnFieldChange()", () => {
    test("returns fieldData on totalComputable change", () => {
      const name = `${mockFieldId}-totalComputable`;
      const fieldData = structuredClone(baseFieldData);

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [`${mockFieldId}-totalComputable`]: 100,
        [`${mockFieldId}-totalFederalShare`]: 89,
        [`${mockFieldId}-totalStateTerritoryShare`]: 11,

        [`${mockTableId}-totalComputable`]: 346.45,
        [`${mockTableId}-totalFederalShare`]: 319.46,
        [`${mockTableId}-totalStateTerritoryShare`]: 26.99,

        "totalsSummary_serviceTotals-totalComputable": 0,
        "totalsSummary_serviceTotals-totalStateTerritoryShare": 0,
        "totalsSummary_serviceTotals-totalFederalShare": 0,
        "totalsSummary_allTotals-totalComputable": 0,
        "totalsSummary_allTotals-totalStateTerritoryShare": 0,
        "totalsSummary_allTotals-totalFederalShare": 0,
      });
    });

    test("returns fieldData on dynamic totalComputable update", () => {
      const name = `${mockTempDynamicFieldId}-totalComputable`;
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            name: mockDynamicFieldId,
            totalFederalShare: 89,
            totalStateTerritoryShare: 11,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 100,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 89,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 11,
        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 346,
        [`${mockTableId}-totalFederalShare`]: 303.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 42.98,

        "totalsSummary_serviceTotals-totalComputable": 0,
        "totalsSummary_serviceTotals-totalStateTerritoryShare": 0,
        "totalsSummary_serviceTotals-totalFederalShare": 0,
        "totalsSummary_allTotals-totalComputable": 0,
        "totalsSummary_allTotals-totalStateTerritoryShare": 0,
        "totalsSummary_allTotals-totalFederalShare": 0,
      });
    });

    test("returns fieldData on dynamic totalComputable addition", () => {
      const name = `${mockTempDynamicFieldId}-totalComputable`;
      const fieldData = structuredClone(baseFieldData);

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            ...fieldData?.[mockDynamicTemplateId][0],
            name: mockDynamicFieldId,
            totalFederalShare: 89,
            totalStateTerritoryShare: 11,
            budgetedFullTimeEmployees: 0,
            filledFullTimeEmployees: 0,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 100,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 89,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 11,
        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 346,
        [`${mockTableId}-totalFederalShare`]: 303.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 42.98,

        "totalsSummary_serviceTotals-totalComputable": 0,
        "totalsSummary_serviceTotals-totalStateTerritoryShare": 0,
        "totalsSummary_serviceTotals-totalFederalShare": 0,
        "totalsSummary_allTotals-totalComputable": 0,
        "totalsSummary_allTotals-totalStateTerritoryShare": 0,
        "totalsSummary_allTotals-totalFederalShare": 0,
      });
    });

    test("returns fieldData on percentageOverride change", () => {
      const name = `${mockFieldId}-percentageOverride`;
      const fieldData = structuredClone(baseFieldData);

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        percentageOverride: 89,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [`${mockFieldId}-percentageOverride`]: 89,
        [`${mockFieldId}-totalComputable`]: 100,
        [`${mockFieldId}-totalFederalShare`]: 89,
        [`${mockFieldId}-totalStateTerritoryShare`]: 11,

        [`${mockTableId}-totalComputable`]: 346.45,
        [`${mockTableId}-totalFederalShare`]: 319.46,
        [`${mockTableId}-totalStateTerritoryShare`]: 26.99,

        "totalsSummary_serviceTotals-totalComputable": 0,
        "totalsSummary_serviceTotals-totalStateTerritoryShare": 0,
        "totalsSummary_serviceTotals-totalFederalShare": 0,
        "totalsSummary_allTotals-totalComputable": 0,
        "totalsSummary_allTotals-totalStateTerritoryShare": 0,
        "totalsSummary_allTotals-totalFederalShare": 0,
      });
    });

    test("returns fieldData on dynamic percentageOverride update", () => {
      const name = `${mockTempDynamicFieldId}-percentageOverride`;
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        percentageOverride: 89,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            name: mockDynamicFieldId,
            percentageOverride: 89,
            totalFederalShare: 89,
            totalStateTerritoryShare: 11,
          },
        ],
        [`${mockDynamicTemplateId}-totalComputable`]: 100,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 89,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 11,

        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 346,
        [`${mockTableId}-totalFederalShare`]: 303.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 42.98,

        "totalsSummary_serviceTotals-totalComputable": 0,
        "totalsSummary_serviceTotals-totalStateTerritoryShare": 0,
        "totalsSummary_serviceTotals-totalFederalShare": 0,
        "totalsSummary_allTotals-totalComputable": 0,
        "totalsSummary_allTotals-totalStateTerritoryShare": 0,
        "totalsSummary_allTotals-totalFederalShare": 0,
      });
    });

    test("returns fieldData on dynamic budgetedFullTimeEmployees addition", () => {
      const name = `${mockTempDynamicFieldId}-budgetedFullTimeEmployees`;
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 0,
        value: 100,
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

        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,
        [`${mockTableId}-budgetedFullTimeEmployees`]: 100,
        [`${mockTableId}-filledFullTimeEmployees`]: 0,
      });
    });

    test("returns fieldData on dynamic budgetedFullTimeEmployees update", () => {
      const name = `${mockTempDynamicFieldId}-budgetedFullTimeEmployees`;
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 0,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [],
        [`${mockDynamicTemplateId}-totalComputable`]: 123.45,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 123.45,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 0,

        [`${mockDynamicTemplateId}-budgetedFullTimeEmployees`]: 100,
        [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 0,

        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,

        [`${mockTableId}-budgetedFullTimeEmployees`]: 100,
        [`${mockTableId}-filledFullTimeEmployees`]: 0,
      });
    });

    test("returns fieldData on dynamic filledFullTimeEmployees addition", () => {
      const name = `${mockTempDynamicFieldId}-filledFullTimeEmployees`;
      const fieldData = structuredClone(baseFieldData);
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 0,
        value: 100,
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
        [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 100,

        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,
        [`${mockTableId}-budgetedFullTimeEmployees`]: 0,
        [`${mockTableId}-filledFullTimeEmployees`]: 100,
      });
    });

    test("returns fieldData on dynamic filledFullTimeEmployees update", () => {
      const name = `${mockTempDynamicFieldId}-filledFullTimeEmployees`;
      const fieldData = {
        ...baseFieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 0,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [],
        [`${mockDynamicTemplateId}-totalComputable`]: 123.45,
        [`${mockDynamicTemplateId}-totalFederalShare`]: 123.45,
        [`${mockDynamicTemplateId}-totalStateTerritoryShare`]: 0,

        [`${mockDynamicTemplateId}-budgetedFullTimeEmployees`]: 0,
        [`${mockDynamicTemplateId}-filledFullTimeEmployees`]: 100,

        [`${mockFieldId}-totalComputable`]: 123,
        [`${mockFieldId}-totalFederalShare`]: 107.01,
        [`${mockFieldId}-totalStateTerritoryShare`]: 15.99,

        [`${mockTableId}-totalComputable`]: 246,
        [`${mockTableId}-totalFederalShare`]: 214.02,
        [`${mockTableId}-totalStateTerritoryShare`]: 31.98,

        [`${mockTableId}-budgetedFullTimeEmployees`]: 0,
        [`${mockTableId}-filledFullTimeEmployees`]: 100,
      });
    });

    test("returns fieldData for no matching case", () => {
      const name = "other";
      const fieldData = {
        mockField: "Mock text",
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        name,
        percentage: 89,
        value: 100,
      });

      expect(updatedFields).toEqual(fieldData);
    });
  });
});
