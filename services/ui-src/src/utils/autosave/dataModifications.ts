// types
import { ReportFormFieldType, ReportShape } from "types";
// utils
import { calculateShares, FieldInfo, fieldTableTotals } from "utils";

export const updatedNumberFields = (
  fields: FieldInfo[],
  report: ReportShape = {} as ReportShape
) => {
  const field = fields[0];
  if (!field?.name) return fields;

  const [fieldId, fieldType] = field.name.split("-");
  const fieldValue = field.value;
  const fieldData = report.fieldData || {};

  switch (fieldType) {
    case "totalComputable": {
      const [formId, tableFormId] = fieldId.split("_");
      const tableId = [formId, tableFormId].join("_");
      const percentageField = `fmap_${formId}Percentage`;
      const percentage = fieldData[percentageField] || 100;

      const options = {
        fieldData,
        fieldId,
        fieldValue,
        percentage,
        tableId,
      };

      const { field, table } = fieldTableTotals(options);

      const totalsFields = (id: string, totals: typeof field) => [
        {
          name: `${id}-totalComputable`,
          type: ReportFormFieldType.NUMBER,
          value: totals.totalComputable,
        },
        {
          name: `${id}-totalFederalShare`,
          type: ReportFormFieldType.NUMBER,
          value: totals.totalFederalShare,
        },
        {
          name: `${id}-totalStateTerritoryShare`,
          type: ReportFormFieldType.NUMBER,
          value: totals.totalStateTerritoryShare,
        },
      ];

      return [...totalsFields(fieldId, field), ...totalsFields(tableId, table)];
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

          const { totalFederalShare, totalStateTerritoryShare } =
            calculateShares(totalComputable, fieldValue);

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
