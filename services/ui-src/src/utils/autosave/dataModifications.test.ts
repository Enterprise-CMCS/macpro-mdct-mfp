// types
import { ReportFormFieldType } from "types";
import { FieldInfo } from "./autosave";
// utils
import {
  createTempDynamicId,
  getFieldParts,
  getFmapForm,
  isFieldType,
  isFmapPct,
  isTempDynamicField,
  recalculateDynamicFields,
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

const fieldData = {
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

describe("utils/autosave/dataModifications", () => {
  describe("updatedNumberFields()", () => {
    test("returns fields for updated totalComputable", () => {
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
      ]);
    });

    test("returns fields for updated totalComputable with percentageOverride", () => {
      const updatedFieldData = {
        ...fieldData,
        [`${mockFieldId}-percentageOverride`]: 60,
      };
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, updatedFieldData);
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
      ]);
    });

    test("returns fields for updated dynamic totalComputable", () => {
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
      ]);
    });

    test("returns fields for no matching fmap percentage (defaults to 100%)", () => {
      const updatedFieldData = {
        ...fieldData,
        [`fmap_${mockFormId}Percentage`]: undefined,
      };
      const fields: FieldInfo[] = [
        {
          name: `${mockFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ];

      const updatedFields = updatedNumberFields(fields, updatedFieldData);
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
      ]);
    });

    test("returns fields for updated percentage", () => {
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
              totalComputable: 123,
              totalFederalShare: 107.01,
              totalStateTerritoryShare: 15.99,
            },
          ],
        },
      ]);
    });

    test("adds new values for dynamic text", () => {
      const fields: FieldInfo[] = [
        {
          name: `${mockTempDynamicFieldId}-category`,
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFieldData = {
        ...fieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedTextFields(fields, updatedFieldData);
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

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        id: name,
        name,
        percentage: 89,
        tableId: mockTableId,
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
      });
    });

    test("returns fieldData on dynamic totalComputable update", () => {
      const name = `${mockTempDynamicFieldId}-totalComputable`;
      const updatedFieldData = {
        ...fieldData,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData: updatedFieldData,
        id: name,
        name,
        percentage: 89,
        tableId: mockTableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            name: mockDynamicFieldId,
            percentageShare: 11,
            totalFederalShare: 89,
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
      });
    });

    test("returns fieldData on dynamic totalComputable addition", () => {
      const name = `${mockTempDynamicFieldId}-totalComputable`;

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        id: name,
        name,
        percentage: 89,
        tableId: mockTableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [mockDynamicTemplateId]: [
          {
            ...fieldData?.[mockDynamicTemplateId][0],
            percentageShare: 11,
            totalFederalShare: 89,
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
      });
    });

    test("returns fieldData for no matching case", () => {
      const name = "other";
      const updatedFieldData = {
        mockField: "Mock text",
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData: updatedFieldData,
        id: name,
        name,
        percentage: 89,
        tableId: mockTableId,
        value: 100,
      });

      expect(updatedFields).toEqual(updatedFieldData);
    });
  });

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

  describe("recalculateDynamicFields()", () => {
    test("returns calculations for dynamic fields", () => {
      const updatedFieldData = {
        ...fieldData,
        [`fmap_${mockFormId}Percentage`]: undefined,
        [mockDynamicTemplateId]: undefined,
      };
      const updatedFields = recalculateDynamicFields({
        dynamicFieldId: mockDynamicFieldId,
        dynamicTemplateId: mockDynamicTemplateId,
        formId: mockFormId,
        fieldData: updatedFieldData,
        tableId: mockTableId,
        value: 100,
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
              totalFederalShare: 100,
              totalStateTerritoryShare: 0,
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
          value: 100,
        },
        {
          name: `${mockDynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${mockTableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346,
        },
        {
          name: `${mockTableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 314.02,
        },
        {
          name: `${mockTableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 31.98,
        },
      ]);
    });
  });
});
