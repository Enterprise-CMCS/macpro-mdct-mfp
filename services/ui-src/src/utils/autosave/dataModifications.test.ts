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

const formId = "mockFormId";
const tableId = `${formId}_mockTableId`;
const fieldId = `${tableId}_mockFieldId`;
const dynamicFieldId = "123a-456b-789c";
const dynamicTemplateId = `${tableId}_mockDynamicFieldId`;

const fieldValue = 123;
const percentageShare = 107.01;
const remainingShare = 15.99;
const percentage = 87;
const mocks = ["", "2"];

const fieldData = {
  [`fmap_${formId}Percentage`]: percentage,
  ...Object.fromEntries(
    mocks.flatMap((mockId) => [
      [`${fieldId}${mockId}-percentageOverride`, undefined],
      [`${fieldId}${mockId}-totalComputable`, fieldValue],
      [`${fieldId}${mockId}-totalFederalShare`, percentageShare],
      [`${fieldId}${mockId}-totalStateTerritoryShare`, remainingShare],
    ])
  ),
  [`${tableId}-totalComputable`]: fieldValue * mocks.length,
  [`${tableId}-totalFederalShare`]: percentageShare * mocks.length,
  [`${tableId}-totalStateTerritoryShare`]: remainingShare * mocks.length,
  [dynamicTemplateId]: [
    {
      id: dynamicFieldId,
      totalComputable: 123.45,
      totalFederalShare: 123.45,
      totalStateTerritoryShare: 0,
    },
  ],
  [`${dynamicTemplateId}-totalComputable`]: 123.45,
  [`${dynamicTemplateId}-totalFederalShare`]: 123.45,
  [`${dynamicTemplateId}-totalStateTerritoryShare`]: 0,

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
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 107.01,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 337.47,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 31.98,
        },
      ]);
    });

    test("returns fields for updated totalComputable with percentageOverride", () => {
      const updatedFieldData = {
        ...fieldData,
        [`${fieldId}-percentageOverride`]: 60,
      };
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, updatedFieldData);
      expect(updatedFields).toEqual([
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 73.8,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 49.2,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369.45,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 304.26,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 65.19,
        },
      ]);
    });

    test("returns fields for updated dynamic totalComputable", () => {
      const fields: FieldInfo[] = [
        {
          name: `tempDynamicField_${dynamicTemplateId}_${dynamicFieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: dynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: dynamicFieldId,
              name: dynamicFieldId,
              totalComputable: 123,
              totalFederalShare: 107.01,
              totalStateTerritoryShare: 15.99,
            },
          ],
        },
        {
          name: `${dynamicTemplateId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 123,
        },
        {
          name: `${dynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 107.01,
        },
        {
          name: `${dynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 369,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 321.03,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 47.97,
        },
      ]);
    });

    test("returns fields for no matching fmap percentage (defaults to 100%)", () => {
      const updatedFieldData = {
        ...fieldData,
        [`fmap_${formId}Percentage`]: undefined,
      };
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
      ];

      const updatedFields = updatedNumberFields(fields, updatedFieldData);
      expect(updatedFields).toEqual([
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346.45,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 330.46,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 15.99,
        },
      ]);
    });

    test("returns fields for updated percentage", () => {
      const fields: FieldInfo[] = [
        {
          name: `fmap_${formId}Percentage`,
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
          name: `${fieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 36.9,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 86.1,
        },
        {
          name: `${fieldId}2-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 36.9,
        },
        {
          name: `${fieldId}2-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 86.1,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 73.8,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 172.2,
        },
        {
          name: `${dynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 37.04,
        },
        {
          name: `${dynamicTemplateId}-totalStateTerritoryShare`,
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
          name: `tempDynamicField_${dynamicTemplateId}_${dynamicFieldId}-category`,
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFields = updatedTextFields(fields, fieldData);
      expect(updatedFields).toEqual([
        {
          name: dynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              category: "Mock text",
              id: dynamicFieldId,
              name: dynamicFieldId,
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
          name: `tempDynamicField_${dynamicTemplateId}_${dynamicFieldId}-category`,
          type: ReportFormFieldType.TEXT,
          value: "Mock text",
        },
      ];
      const updatedFieldData = {
        ...fieldData,
        [dynamicTemplateId]: undefined,
      };
      const updatedFields = updatedTextFields(fields, updatedFieldData);
      expect(updatedFields).toEqual([
        {
          name: dynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              category: "Mock text",
              id: dynamicFieldId,
              name: dynamicFieldId,
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
      const name = `${fieldId}-totalComputable`;

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        id: name,
        name,
        percentage: 89,
        tableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [`${fieldId}-totalComputable`]: 100,
        [`${fieldId}-totalFederalShare`]: 89,
        [`${fieldId}-totalStateTerritoryShare`]: 11,
        [`${tableId}-totalComputable`]: 346.45,
        [`${tableId}-totalFederalShare`]: 319.46,
        [`${tableId}-totalStateTerritoryShare`]: 26.99,
      });
    });

    test("returns fieldData on dynamic totalComputable update", () => {
      const name = `tempDynamicField_${dynamicTemplateId}_${dynamicFieldId}-totalComputable`;
      const updatedFieldData = {
        ...fieldData,
        [dynamicTemplateId]: undefined,
      };
      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData: updatedFieldData,
        id: name,
        name,
        percentage: 89,
        tableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [dynamicTemplateId]: [
          {
            id: dynamicFieldId,
            name: dynamicFieldId,
            percentageShare: 11,
            totalFederalShare: 89,
          },
        ],
        [`${dynamicTemplateId}-totalComputable`]: 100,
        [`${dynamicTemplateId}-totalFederalShare`]: 89,
        [`${dynamicTemplateId}-totalStateTerritoryShare`]: 11,
        [`${fieldId}-totalComputable`]: 123,
        [`${fieldId}-totalFederalShare`]: 107.01,
        [`${fieldId}-totalStateTerritoryShare`]: 15.99,
        [`${tableId}-totalComputable`]: 346,
        [`${tableId}-totalFederalShare`]: 303.02,
        [`${tableId}-totalStateTerritoryShare`]: 42.98,
      });
    });

    test("returns fieldData on dynamic totalComputable addition", () => {
      const name = `tempDynamicField_${dynamicTemplateId}_${dynamicFieldId}-totalComputable`;

      const updatedFields = updatedFieldDataOnFieldChange({
        fieldData,
        id: name,
        name,
        percentage: 89,
        tableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        ...fieldData,
        [dynamicTemplateId]: [
          {
            ...fieldData?.[dynamicTemplateId][0],
            percentageShare: 11,
            totalFederalShare: 89,
          },
        ],
        [`${dynamicTemplateId}-totalComputable`]: 100,
        [`${dynamicTemplateId}-totalFederalShare`]: 89,
        [`${dynamicTemplateId}-totalStateTerritoryShare`]: 11,
        [`${fieldId}-totalComputable`]: 123,
        [`${fieldId}-totalFederalShare`]: 107.01,
        [`${fieldId}-totalStateTerritoryShare`]: 15.99,
        [`${tableId}-totalComputable`]: 346,
        [`${tableId}-totalFederalShare`]: 303.02,
        [`${tableId}-totalStateTerritoryShare`]: 42.98,
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
        tableId,
        value: 100,
      });

      expect(updatedFields).toEqual(updatedFieldData);
    });
  });

  describe("createTempDynamicId()", () => {
    test("returns new id", () => {
      const input = createTempDynamicId(
        `${fieldId}-mockFieldType`,
        dynamicFieldId
      );
      const expectedResult = `tempDynamicField_${fieldId}_${dynamicFieldId}-mockFieldType`;
      expect(input).toBe(expectedResult);
    });
  });

  describe("getFieldParts()", () => {
    test("splits field into parts", () => {
      const input = getFieldParts(`${fieldId}-mockFieldType`);
      const expectedResult = {
        dynamicFieldId: "",
        dynamicTemplateId: "",
        fieldId,
        fieldType: "mockFieldType",
        formId,
        tableId,
      };
      expect(input).toEqual(expectedResult);
    });

    test("splits field into parts with dynamicId", () => {
      const input = getFieldParts(
        `tempDynamicField_${fieldId}_${dynamicFieldId}-mockFieldType`
      );
      const expectedResult = {
        dynamicFieldId,
        dynamicTemplateId: fieldId,
        fieldId: `tempDynamicField_${fieldId}_${dynamicFieldId}`,
        fieldType: "mockFieldType",
        formId,
        tableId,
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
        `tempDynamicField_${tableId}_${dynamicFieldId}-mockFieldType`
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
        [`fmap_${formId}Percentage`]: undefined,
        [dynamicTemplateId]: undefined,
      };
      const updatedFields = recalculateDynamicFields({
        dynamicFieldId,
        dynamicTemplateId,
        formId,
        fieldData: updatedFieldData,
        tableId,
        value: 100,
      });
      expect(updatedFields).toEqual([
        {
          name: dynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: [
            {
              id: dynamicFieldId,
              name: dynamicFieldId,
              totalComputable: 100,
              totalFederalShare: 100,
              totalStateTerritoryShare: 0,
            },
          ],
        },
        {
          name: `${dynamicTemplateId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${dynamicTemplateId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 100,
        },
        {
          name: `${dynamicTemplateId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 0,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: 346,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: 314.02,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: 31.98,
        },
      ]);
    });
  });
});
