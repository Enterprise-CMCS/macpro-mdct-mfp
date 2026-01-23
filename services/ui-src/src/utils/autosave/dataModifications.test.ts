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

const fieldValue = 123;
const percentageShare = 107.01;
const remainingShare = 15.99;
const percentage = 87;
const mocks = ["", "2"];

const fieldData = {
  [`fmap_${formId}Percentage`]: percentage,
  ...Object.fromEntries(
    mocks.flatMap((mockId) => [
      [`${fieldId}${mockId}-totalComputable`, fieldValue],
      [`${fieldId}${mockId}-totalFederalShare`, percentageShare],
      [`${fieldId}${mockId}-totalStateTerritoryShare`, remainingShare],
    ])
  ),
  [`${tableId}-totalComputable`]: fieldValue * mocks.length,
  [`${tableId}-totalFederalShare`]: percentageShare * mocks.length,
  [`${tableId}-totalStateTerritoryShare`]: remainingShare * mocks.length,
  // Adding these fields to test filtering
  "unrelated-totalComputable": 12345,
  "unrelated-totalFederalShare": 12345,
  "unrelated-totalStateTerritoryShare": 12345,
};

describe("utils/autosave/dataModifications", () => {
  describe("updatedNumberFields()", () => {
    test("returns fields for updated totalComputable", () => {
      const report = {
        fieldData,
      } as unknown as ReportShape;

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
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 123,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: "number",
          value: 107.01,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: "number",
          value: 15.99,
        },
        {
          name: `${tableId}-totalComputable`,
          type: "number",
          value: 246,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: "number",
          value: 214.02,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: "number",
          value: 31.98,
        },
      ]);
    });

    test("returns fields for no matching fmap percentage (defaults to 100%)", () => {
      const report = {
        fieldData: {
          ...fieldData,
          [`fmap_${formId}Percentage`]: undefined,
        },
      } as unknown as ReportShape;

      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 100,
        },
      ];

      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 100,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: "number",
          value: 100,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: "number",
          value: 0,
        },
        {
          name: `${tableId}-totalComputable`,
          type: "number",
          value: 223,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: "number",
          value: 207.01,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: "number",
          value: 15.99,
        },
      ]);
    });

    test("returns fields for updated percentage", () => {
      const report = {
        fieldData: fieldData,
      } as unknown as ReportShape;

      const fields: FieldInfo[] = [
        {
          name: `fmap_${formId}Percentage`,
          type: "number",
          value: 30,
        },
      ];

      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: "fmap_mockFormIdPercentage",
          type: "number",
          value: 30,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: "number",
          value: 36.9,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: "number",
          value: 86.1,
        },
        {
          name: `${fieldId}2-totalFederalShare`,
          type: "number",
          value: 36.9,
        },
        {
          name: `${fieldId}2-totalStateTerritoryShare`,
          type: "number",
          value: 86.1,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: "number",
          value: 73.8,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: "number",
          value: 172.2,
        },
      ]);
    });
  });

  describe("updatedReportOnFieldChange()", () => {
    test("returns updated report on totalComputable change", () => {
      const report = {
        fieldData,
      } as unknown as ReportShape;

      const name = `${fieldId}-totalComputable`;

      const updatedFields = updatedReportOnFieldChange({
        id: name,
        name,
        report,
        percentage: 89,
        tableId,
        value: 100,
      });

      expect(updatedFields).toEqual({
        fieldData: {
          ...fieldData,
          [`${fieldId}-totalComputable`]: 100,
          [`${fieldId}-totalFederalShare`]: 89,
          [`${fieldId}-totalStateTerritoryShare`]: 11,
          [`${tableId}-totalComputable`]: 223,
          [`${tableId}-totalFederalShare`]: 196.01,
          [`${tableId}-totalStateTerritoryShare`]: 26.99,
        },
      });
    });
  });
});
