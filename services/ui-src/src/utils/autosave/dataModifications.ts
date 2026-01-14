// types
import { ReportFormFieldType, ReportShape } from "types";
// utils
import { FieldInfo, fieldTableTotals } from "utils";

export const updatedNumberFields = (
  fields: FieldInfo[],
  report: ReportShape = {} as ReportShape
) => {
  const field = fields[0];
  if (!field?.name) return fields;

  const [fieldId, fieldType] = field.name.split("-");
  const fieldValue = Number(field.value || 0);
  const fieldData = report.fieldData || {};

  switch (fieldType) {
    case "totalComputable": {
      const [formId, tableFormId] = fieldId.split("_");
      const tableId = [formId, tableFormId].join("_");
      const percentageField = `fmap_${formId}Percentage`;
      const percentage = fieldData[percentageField] || 100;

      const options = {
        fieldValue,
        percentage,
        fieldId,
        tableId,
        fieldData,
      };

      const {
        fieldTotalComputable,
        fieldTotalFederalShare,
        fieldTotalStateTerritoryShare,
        tableTotalComputable,
        tableTotalFederalShare,
        tableTotalStateTerritoryShare,
      } = fieldTableTotals(options);

      return [
        {
          name: `${fieldId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: fieldTotalComputable,
        },
        {
          name: `${fieldId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: fieldTotalFederalShare,
        },
        {
          name: `${fieldId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: fieldTotalStateTerritoryShare,
        },
        {
          name: `${tableId}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: tableTotalComputable,
        },
        {
          name: `${tableId}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: tableTotalFederalShare,
        },
        {
          name: `${tableId}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: tableTotalStateTerritoryShare,
        },
      ];
    }
    default:
      // If no match, fall through to next switch
      break;
  }

  switch (fieldId) {
    case "fmap_demonstrationServicesPercentage":
    case "fmap_qualifiedHcbsPercentage": {
      /*
       * Get totalComputable fields and update corresponding
       * totalFederalShare and totalStateTerritoryShare fields
       */
      const updatedFields = Object.keys(fieldData)
        .filter((key) => key.endsWith("totalComputable"))
        .flatMap((key) => {
          const totalComputable = fieldData[key];
          const [keyFieldId] = key.split("-");
          const totalFederalShare = totalComputable * (fieldValue / 100);
          const totalStateTerritoryShare = totalComputable - totalFederalShare;

          return [
            {
              name: `${keyFieldId}-totalFederalShare`,
              type: ReportFormFieldType.NUMBER,
              value: totalFederalShare,
            },
            {
              name: `${keyFieldId}-totalStateTerritoryShare`,
              type: ReportFormFieldType.NUMBER,
              value: totalStateTerritoryShare,
            },
          ];
        });

      return [...fields, ...updatedFields];
    }
    default:
      return fields;
  }
};
