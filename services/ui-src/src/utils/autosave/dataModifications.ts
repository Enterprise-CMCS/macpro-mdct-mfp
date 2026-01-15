// types
import { ReportFormFieldType, ReportShape } from "types";
// utils
import {
  CalculatedSharesType,
  calculateShares,
  FieldInfo,
  fieldTableTotals,
  getNumberValue,
} from "utils";

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
      // fieldId expected format: formId_formTableId_formFieldId
      const [formId, formTableId] = fieldId.split("_");

      // tableId expected format: formId_formTableId
      const tableId = [formId, formTableId].join("_");

      // TODO: Use form percentage or field percentage
      const percentageField = `fmap_${formId}Percentage`;
      const percentage = fieldData[percentageField] || 100;

      const fieldSuffixesToCalculate = {
        total: "totalComputable",
        percentageShare: "totalFederalShare",
        remainingShare: "totalStateTerritoryShare",
      };

      const { field, table } = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldValue,
        percentage,
        tableId,
      });

      const fieldsToMap = Object.entries(fieldSuffixesToCalculate) as Array<
        [keyof typeof fieldSuffixesToCalculate, string]
      >;

      const updatedFields = (
        fieldOrTableId: string,
        totals: CalculatedSharesType
      ) =>
        fieldsToMap.map(([key, fieldSuffix]) => ({
          name: `${fieldOrTableId}-${fieldSuffix}`,
          type: ReportFormFieldType.NUMBER,
          value: totals[key],
        }));

      return [
        ...updatedFields(fieldId, field),
        ...updatedFields(tableId, table),
      ];
    }
    default:
      // If no match, fall through to next switch
      break;
  }

  switch (true) {
    case fieldId.startsWith("fmap_") && fieldId.endsWith("Percentage"): {
      /*
       * Get totalComputable fields and update corresponding
       * totalFederalShare and totalStateTerritoryShare fields
       */
      const updatedFields = Object.keys(fieldData)
        .filter((key) => key.endsWith("totalComputable"))
        .flatMap((key) => {
          const total = getNumberValue(fieldData[key]);
          const percentage = getNumberValue(fieldValue);
          const [keyFieldId] = key.split("-");

          const { percentageShare, remainingShare } = calculateShares(
            total,
            percentage
          );

          return [
            {
              name: `${keyFieldId}-totalFederalShare`,
              type: ReportFormFieldType.NUMBER,
              value: percentageShare,
            },
            {
              name: `${keyFieldId}-totalStateTerritoryShare`,
              type: ReportFormFieldType.NUMBER,
              value: remainingShare,
            },
          ];
        });

      return [...fields, ...updatedFields];
    }
    default:
      // Nothing changed, return original fields
      return fields;
  }
};

export const updatedReportOnFieldChange = ({
  fieldName,
  fieldValue,
  report,
  percentage,
  tableId,
}: UpdatedReportFields) => {
  const [fieldId, fieldType] = fieldName.split("-");

  switch (fieldType) {
    case "totalComputable": {
      const fieldSuffixesToCalculate = {
        total: "totalComputable",
        percentageShare: "totalFederalShare",
        remainingShare: "totalStateTerritoryShare",
      };

      const { field, table } = fieldTableTotals({
        fieldData: report.fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldValue,
        percentage,
        tableId,
      });

      const fieldsToMap = Object.entries(fieldSuffixesToCalculate) as Array<
        [keyof typeof fieldSuffixesToCalculate, string]
      >;

      const updatedFieldData = (id: string, totals: CalculatedSharesType) =>
        Object.fromEntries(
          fieldsToMap.map(([key, suffix]) => [`${id}-${suffix}`, totals[key]])
        );

      return {
        ...report,
        fieldData: {
          ...report.fieldData,
          ...updatedFieldData(fieldId, field),
          ...updatedFieldData(tableId, table),
        },
      };
    }
    default:
      // Nothing changed, return original report
      return report;
  }
};

interface UpdatedReportFields {
  fieldName: string;
  fieldValue: number | string;
  report: ReportShape;
  percentage: number;
  tableId: string;
}
