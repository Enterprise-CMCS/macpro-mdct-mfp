// types
import { ReportShape } from "types";
import { FieldInfo } from "./autosave";
// utils
import { updatedNumberFields } from "./dataModifications";

describe("utils/autosave/dataModifications", () => {
  describe("updatedNumberFields()", () => {
    const formId = "demonstrationServices";
    const tableId = "demonstrationServices_mockTableId";
    const fieldId = "demonstrationServices_mockTableId_mockFieldId";
    const fieldData = (value = 0) => ({
      [`fmap_${formId}Percentage`]: 10,
      [`${fieldId}-totalComputable`]: value,
      [`${fieldId}-totalFederalShare`]: value,
      [`${fieldId}-totalStateTerritoryShare`]: value,
      [`${fieldId}_mockId-totalComputable`]: value,
      [`${fieldId}_mockId-totalFederalShare`]: value,
      [`${fieldId}_mockId-totalStateTerritoryShare`]: value,
      [`${tableId}-totalComputable`]: value,
      [`${tableId}-totalFederalShare`]: value,
      [`${tableId}-totalStateTerritoryShare`]: value,
    });

    const report = {
      fieldData: fieldData(),
    } as unknown as ReportShape;

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
          name: "demonstrationServices_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 12.3,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 110.7,
        },
        {
          name: "demonstrationServices_mockTableId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: 12.3,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 110.7,
        },
      ]);
    });

    test("returns fields for updated totalComputable and no matching fmap percentage", () => {
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: 123,
        },
      ];
      delete report.fieldData?.[`fmap_${formId}Percentage`];

      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 0,
        },
        {
          name: "demonstrationServices_mockTableId-totalComputable",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: 123,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
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
        fieldData: fieldData(10),
      } as unknown as ReportShape;

      const updatedFields = updatedNumberFields(fields, updatedReport);
      expect(updatedFields).toEqual([
        {
          name: "fmap_demonstrationServicesPercentage",
          type: "number",
          value: 30,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 3,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 7,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId_mockId-totalFederalShare",
          type: "number",
          value: 3,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId_mockId-totalStateTerritoryShare",
          type: "number",
          value: 7,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: 3,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 7,
        },
      ]);
    });
  });
});
