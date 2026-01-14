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

    const computable = 123;
    const federalShare = 107.01;
    const stateTerritoryShare = 15.99;
    const mocks = ["", "2"];

    const fieldData = (value?: number) => ({
      [`fmap_${formId}Percentage`]: 87,
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

    test("returns fields for updated totalComputable", () => {
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: computable,
        },
      ];
      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: computable,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: federalShare,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: stateTerritoryShare,
        },
        {
          name: "demonstrationServices_mockTableId-totalComputable",
          type: "number",
          value: computable * mocks.length,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: federalShare * mocks.length,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: stateTerritoryShare * mocks.length,
        },
      ]);
    });

    test("returns fields for updated totalComputable and no matching fmap percentage", () => {
      const fields: FieldInfo[] = [
        {
          name: `${fieldId}-totalComputable`,
          type: "number",
          value: computable,
        },
      ];
      delete report.fieldData?.[`fmap_${formId}Percentage`];

      const updatedFields = updatedNumberFields(fields, report);
      expect(updatedFields).toEqual([
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalComputable",
          type: "number",
          value: computable,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: computable,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 0,
        },
        {
          name: "demonstrationServices_mockTableId-totalComputable",
          type: "number",
          value: computable * mocks.length,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: computable * mocks.length - stateTerritoryShare,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: stateTerritoryShare,
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
          name: "fmap_demonstrationServicesPercentage",
          type: "number",
          value: 30,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalFederalShare",
          type: "number",
          value: 36.9,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId-totalStateTerritoryShare",
          type: "number",
          value: 86.1,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId2-totalFederalShare",
          type: "number",
          value: 36.9,
        },
        {
          name: "demonstrationServices_mockTableId_mockFieldId2-totalStateTerritoryShare",
          type: "number",
          value: 86.1,
        },
        {
          name: "demonstrationServices_mockTableId-totalFederalShare",
          type: "number",
          value: 73.8,
        },
        {
          name: "demonstrationServices_mockTableId-totalStateTerritoryShare",
          type: "number",
          value: 172.2,
        },
      ]);
    });
  });
});
