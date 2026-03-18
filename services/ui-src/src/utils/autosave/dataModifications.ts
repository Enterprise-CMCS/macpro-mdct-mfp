// types
import { AnyObject, DynamicFieldShape, ReportFormFieldType } from "types";
// utils
import {
  calculateAggregateTotals,
  calculateShares,
  calculationTableDynamicTotalsOnChange,
  calculationTableDynamicTotalsOnSave,
  calculationTableTotalsOnChange,
  calculationTableTotalsOnSave,
  FieldInfo,
  getFieldParts,
  getFmapForm,
  getNumberValue,
  isFieldType,
  isFmapPct,
  isTempDynamicField,
  summationTableDynamicTotalsOnChange,
  summationTableDynamicTotalsOnSave,
  UpdatedFieldDataOnChange,
} from "utils";

// Used with autosave
export const updatedNumberFields = (
  fields: FieldInfo[],
  fieldData: AnyObject = {}
) => {
  const field = fields[0];
  const { name, value } = field;
  const {
    dynamicFieldId,
    dynamicTemplateId,
    fieldId,
    fieldType,
    formId,
    tableId,
  } = getFieldParts(name);

  console.log("entered updated number fields");
  const percentageField = `fmap_${formId}Percentage`;
  const formPercentage = fieldData[percentageField] || 100;
  const fieldPercentageField = `${fieldId}-percentageOverride`;

  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "percentageOverride"): {
      const templateFieldData = fieldData?.[dynamicTemplateId];
      const currentField = templateFieldData?.find(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );
      const totalComputable = currentField?.totalComputable;

      return calculationTableDynamicTotalsOnSave({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldValue: totalComputable,
        formId,
        isPercentageOverrideUpdated: true,
        percentageOverride: value,
        tableId,
      });
    }
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "budgetedFullTimeEmployees"):
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "filledFullTimeEmployees"):
      return summationTableDynamicTotalsOnSave({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldType,
        fieldValue: value,
        formId,
        tableId,
      });

    case isTempDynamicField(name) && isFieldType(fieldType, "totalComputable"):
      return calculationTableDynamicTotalsOnSave({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldValue: value,
        formId,
        tableId,
      });

    case isFieldType(fieldType, "percentageOverride"): {
      const fieldValue = fieldData[`${fieldId}-totalComputable`];
      const percentageOverride = value;
      const percentage = percentageOverride || formPercentage;

      return calculationTableTotalsOnSave({
        fieldData,
        fieldId,
        fieldValue,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
        tableId,
      });
    }

    case isFieldType(fieldType, "totalComputable"): {
      const fieldValue = value;
      const percentageOverride = fieldData?.[fieldPercentageField];
      const percentage = percentageOverride || formPercentage;

      return calculationTableTotalsOnSave({
        fieldData,
        fieldId,
        fieldValue,
        percentage,
        percentageOverride,
        tableId,
      });
    }

    case isFmapPct(fieldId): {
      const formId = getFmapForm(fieldId);

      const updatedFieldData = structuredClone(fieldData);
      /*
       * Get totalComputable fields and update corresponding
       * totalFederalShare and totalStateTerritoryShare fields
       */
      const updatedFields = Object.keys(fieldData)
        .filter(
          (key) => key.startsWith(formId) && key.endsWith("totalComputable")
        )
        .flatMap((key) => {
          const total = getNumberValue(fieldData[key]);
          const percentage = getNumberValue(value);
          const { fieldId: keyFieldId } = getFieldParts(key);

          const { percentageShare, remainingShare } = calculateShares(
            total,
            percentage
          );

          updatedFieldData[`${keyFieldId}-totalFederalShare`] = percentageShare;
          updatedFieldData[`${keyFieldId}-totalStateTerritoryShare`] =
            remainingShare;
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

      const fieldMap = {
        total: "totalComputable",
        percentageShare: "totalFederalShare",
        remainingShare: "totalStateTerritoryShare",
      };

      const { serviceTables, allTables } = calculateAggregateTotals(
        updatedFieldData,
        fieldMap
      );

      const aggregateFields = [
        ["serviceTotals", serviceTables],
        ["allTotals", allTables],
      ].flatMap(([tableName, tableValues]) =>
        Object.entries(fieldMap).map(([key, fieldSuffix]) => ({
          name: `totals_totalsSummary_${tableName}-${fieldSuffix}`,
          type: ReportFormFieldType.NUMBER,
          value: tableValues[key as keyof typeof tableValues],
        }))
      );
      return [...fields, ...updatedFields, ...aggregateFields];
    }

    default:
      // Nothing changed, return original fields
      return fields;
  }
};

// Used with autosave
export const updatedTextFields = (
  fields: FieldInfo[],
  fieldData: AnyObject = {}
) => {
  const field = fields[0];
  const { name, value } = field;
  const { dynamicTemplateId, dynamicFieldId, fieldType } = getFieldParts(name);

  switch (true) {
    case isTempDynamicField(name): {
      const templateFieldData = fieldData?.[dynamicTemplateId] || [];
      const currentFieldIndex = templateFieldData.findIndex(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );
      const updatedField = {
        id: dynamicFieldId,
        name: dynamicFieldId,
        ...templateFieldData[currentFieldIndex],
        [fieldType]: value,
      };

      if (currentFieldIndex !== -1) {
        templateFieldData[currentFieldIndex] = updatedField;
      } else {
        templateFieldData.push(updatedField);
      }

      return [
        {
          name: dynamicTemplateId,
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          value: templateFieldData,
        },
      ];
    }

    default:
      // Nothing changed, return original fields
      return fields;
  }
};

// Used with onChange
export const updatedFieldDataOnFieldChange = ({
  fieldData,
  name,
  percentage,
  percentageOverride,
  value,
}: UpdatedFieldDataOnChange) => {
  const { dynamicFieldId, dynamicTemplateId, fieldId, fieldType, tableId } =
    getFieldParts(name);

  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "percentageOverride"):
      return calculationTableDynamicTotalsOnChange({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldValue: value,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
        tableId,
      });

    case isTempDynamicField(name) && isFieldType(fieldType, "totalComputable"):
      return calculationTableDynamicTotalsOnChange({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldValue: value,
        percentage,
        tableId,
      });

    case isTempDynamicField(name) &&
      isFieldType(fieldType, "budgetedFullTimeEmployees"):
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "filledFullTimeEmployees"):
      return summationTableDynamicTotalsOnChange({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldType,
        fieldValue: value,
        percentage,
        tableId,
      });

    case isFieldType(fieldType, "percentageOverride"):
      return calculationTableTotalsOnChange({
        fieldData,
        fieldId,
        fieldValue: value,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
        tableId,
      });

    case isFieldType(fieldType, "totalComputable"):
      return calculationTableTotalsOnChange({
        fieldData,
        fieldId,
        fieldValue: value,
        percentage,
        tableId,
      });

    default:
      // Nothing changed, return original fieldData
      return fieldData;
  }
};
