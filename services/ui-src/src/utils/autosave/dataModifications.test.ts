// types
import { ReportShape } from "types";
import { FieldInfo } from "./autosave";
// utils
import {
  updatedNumberFields,
  updatedReportOnFieldChange,
} from "./dataModifications";

const formId = "mockFormId";
const tableId = `${formId}_mockTableId`;
const fieldId = `${tableId}_mockFieldId`;

const computable = 123;
const federalShare = 107.01;
const stateTerritoryShare = 15.99;
const percentage = 87;
const mocks = ["", "2"];

const fieldData = (value?: number) => ({
  [`fmap_${formId}Percentage`]: percentage,
  ...Object.fromEntries(
    mocks.flatMap((mockId) => [
      [`${fieldId}${mockId}-totalComputable`, value || computable],
      [`${fieldId}${mockId}-totalFederalShare`, value || federalShare],
      [
        `${fieldId}${mockId}-totalStateTerritoryShare`,
        value || stateTerritoryShare,
      ],
    ])
  ),
  [`${tableId}-totalComputable`]: value || computable * mocks.length,
  [`${tableId}-totalFederalShare`]: value || federalShare * mocks.length,
  [`${tableId}-totalStateTerritoryShare`]:
    value || stateTerritoryShare * mocks.length,
});

const report = {
  fieldData: fieldData(0),
} as unknown as ReportShape;

describe("utils/autosave/dataModifications", () => {
  describe("updatedNumberFields()", () => {
    test("returns fields for updated totalComputable", () => {
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 123,
        },
      ];
      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: "mockFormId_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 107.01,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 15.99,
        },
        {
          name: "mockFormId_mockTableId-totalComputable",
          type: "number",
          value: 246,
        },
        {
          name: "mockFormId_mockTableId-totalFederalShare",
          type: "number",
          value: 214.02,
        },
        {
          name: "mockFormId_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 31.98,
        },
      ]);
    });

    test("returns fields for no matching fmap percentage (defaults to 100%)", () => {
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 123,
        },
      ];

      const updatedReport = {
        fieldData: fieldData(0),
      } as unknown as ReportShape;

      delete updatedReport.fieldData?.[`fmap_${formId}Percentage`];

      const updatedFields = updatedNumberFields(fields, updatedReport);
      expect(updatedFields).toEqual([
        {
          name: "mockFormId_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 123,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 0,
        },
        {
          name: "mockFormId_mockTableId-totalComputable",
          type: "number",
          value: 246,
        },
        {
          name: "mockFormId_mockTableId-totalFederalShare",
          type: "number",
          value: 246,
        },
        {
          name: "mockFormId_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 0,
        },
      ]);
    });

    test("returns fields for updated percentage", () => {
      const fields: FieldInfo[] = [
        {
          name: `fmap_${formId}Percentage`,
          type: "number",
          value: 30,
        },
      ];

      const updatedReport = {
        fieldData: fieldData(),
      } as unknown as ReportShape;

      const updatedFields = updatedNumberFields(fields, updatedReport);
      expect(updatedFields).toEqual([
        {
          name: "fmap_mockFormIdPercentage",
          type: "number",
          value: 30,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 36.9,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 86.1,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId2-totalFederalShare",
          type: "number",
          value: 36.9,
        },
        {
          name: "mockFormId_mockTableId_mockFieldId2-totalStateTerritoryShare",
          type: "number",
          value: 86.1,
        },
        {
          name: "mockFormId_mockTableId-totalFederalShare",
          type: "number",
          value: 73.8,
        },
        {
          name: "mockFormId_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 172.2,
        },
      ]);
    });
  });

  describe("updatedReportOnFieldChange()", () => {
    const fieldName = `${fieldId}-totalComputable`;
    const fieldValue = 123;
    const percentage = 87;

    test("returns updated report on totalComputable change", () => {
      const updatedFields = updatedReportOnFieldChange({
        fieldName,
        fieldValue,
        report,
        percentage,
        tableId,
      });
      expect(updatedFields).toEqual({
        fieldData: {
          "mockFormId_mockTableId_mockFieldId-totalComputable": 123,
          "mockFormId_mockTableId_mockFieldId-totalFederalShare": 107.01,
          "mockFormId_mockTableId_mockFieldId-totalStateTerritoryShare": 15.99,
          "mockFormId_mockTableId_mockFieldId2-totalComputable": 123,
          "mockFormId_mockTableId_mockFieldId2-totalFederalShare": 107.01,
          "mockFormId_mockTableId_mockFieldId2-totalStateTerritoryShare": 15.99,
          "mockFormId_mockTableId-totalComputable": 246,
          "mockFormId_mockTableId-totalFederalShare": 214.02,
          "mockFormId_mockTableId-totalStateTerritoryShare": 31.98,
          fmap_mockFormIdPercentage: 87,
        },
      });
    });
  });
});
