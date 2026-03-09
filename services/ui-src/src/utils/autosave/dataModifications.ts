// types
import { AnyObject, DynamicFieldShape, ReportFormFieldType } from "types";
// utils
import {
  CalculatedSharesType,
  calculateShares,
  dynamicFieldTableTotals,
  FieldInfo,
  fieldTableTotals,
  getNumberValue,
} from "utils";

const DYNAMIC_FIELD_PREFIX = "tempDynamicField";

const fieldSuffixesToCalculate = {
  total: "totalComputable",
  percentageShare: "totalFederalShare",
  remainingShare: "totalStateTerritoryShare",
};

const fieldsToMap = Object.entries(fieldSuffixesToCalculate) as Array<
  [keyof typeof fieldSuffixesToCalculate, string]
>;

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

  const percentageField = `fmap_${formId}Percentage`;
  const formPercentage = fieldData[percentageField] || 100;
  const fieldPercentageField = `${fieldId}-percentageOverride`;

  const recalculateFieldTotalsOnSave = ({
    fieldValue,
    isPercentageOverrideUpdated,
    percentage,
    percentageOverride,
  }: RecalculateFieldTotals) => {
    const { field, table } = fieldTableTotals({
      fieldData,
      fieldId,
      fieldSuffixesToCalculate,
      fieldValue,
      percentage,
      tableId,
    });

    const updatedFields = (
      fieldOrTableId: string,
      totals: CalculatedSharesType
    ) =>
      fieldsToMap.map(([key, fieldSuffix]) => ({
        name: `${fieldOrTableId}-${fieldSuffix}`,
        type: ReportFormFieldType.NUMBER,
        value: totals[key],
      }));

    const fieldsToSave = [
      ...updatedFields(fieldId, field),
      ...updatedFields(tableId, table),
    ];

    if (isPercentageOverrideUpdated) {
      fieldsToSave.unshift({
        name: `${fieldId}-percentageOverride`,
        type: ReportFormFieldType.NUMBER,
        value: percentageOverride || "",
      });
    }

    return fieldsToSave;
  };

  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "percentageOverride"): {
      const templateFieldData = fieldData?.[dynamicTemplateId] || [];
      const currentField = templateFieldData.find(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );
      const totalComputable = currentField?.totalComputable;

      return recalculateDynamicFields({
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
    case isTempDynamicField(name) && isFieldType(fieldType, "totalComputable"):
      return recalculateDynamicFields({
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

      return recalculateFieldTotalsOnSave({
        fieldValue,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
      });
    }
    case isFieldType(fieldType, "totalComputable"): {
      const fieldValue = value;
      const percentageOverride = fieldData?.[fieldPercentageField];
      const percentage = percentageOverride || formPercentage;

      return recalculateFieldTotalsOnSave({
        fieldValue,
        isPercentageOverrideUpdated: false,
        percentage,
      });
    }
    case isFmapPct(fieldId): {
      const formId = getFmapForm(fieldId);

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
        ...templateFieldData[currentFieldIndex],
        id: dynamicFieldId,
        name: dynamicFieldId,
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
  tableId,
  value,
}: UpdatedReportFields) => {
  const { dynamicFieldId, dynamicTemplateId, fieldId, fieldType } =
    getFieldParts(name);

  const recalculateDynamicFieldTotalsOnChange = ({
    fieldValue,
    isPercentageOverrideUpdated = false,
    percentage,
    percentageOverride,
  }: RecalculateFieldTotals) => {
    const { field, table, template } = dynamicFieldTableTotals({
      dynamicFieldId,
      dynamicTemplateId,
      fieldData,
      fieldSuffixesToCalculate,
      fieldValue: fieldValue,
      percentage,
      tableId,
    });
    const templateFieldData = [...(fieldData?.[dynamicTemplateId] || [])];
    const currentFieldIndex = templateFieldData.findIndex(
      (field: DynamicFieldShape) => field.id === dynamicFieldId
    );
    const currentField = templateFieldData[currentFieldIndex] || {};
    const updatedField = {
      ...currentField,
      id: dynamicFieldId,
      name: dynamicFieldId,
      // Update just the calculations on change, other fields will update on blur
      totalFederalShare: field.percentageShare,
      totalStateTerritoryShare: field.remainingShare,
    };

    if (isPercentageOverrideUpdated) {
      updatedField.percentageOverride = percentageOverride;
    }

    if (currentFieldIndex !== -1) {
      templateFieldData[currentFieldIndex] = updatedField;
    } else {
      templateFieldData.push(updatedField);
    }
    const updatedFieldData = (id: string, totals: CalculatedSharesType) =>
      Object.fromEntries(
        fieldsToMap.map(([key, suffix]) => [`${id}-${suffix}`, totals[key]])
      );

    const fieldsToSave = {
      ...fieldData,
      [dynamicTemplateId]: templateFieldData,
      ...updatedFieldData(dynamicTemplateId, template),
      ...updatedFieldData(tableId, table),
    };

    return fieldsToSave;
  };

  const recalculateFieldTotalsOnChange = ({
    fieldValue,
    isPercentageOverrideUpdated = false,
    percentage,
    percentageOverride,
  }: RecalculateFieldTotals) => {
    const { field, table } = fieldTableTotals({
      fieldData,
      fieldId,
      fieldSuffixesToCalculate,
      fieldValue,
      percentage,
      tableId,
    });

    const updatedFieldData = (id: string, totals: CalculatedSharesType) =>
      Object.fromEntries(
        fieldsToMap.map(([key, suffix]) => [`${id}-${suffix}`, totals[key]])
      );

    const fieldsToSave = {
      ...fieldData,
      ...updatedFieldData(fieldId, field),
      ...updatedFieldData(tableId, table),
    };

    if (isPercentageOverrideUpdated) {
      fieldsToSave[`${fieldId}-percentageOverride`] = percentageOverride;
    }

    return fieldsToSave;
  };

  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "percentageOverride"):
      return recalculateDynamicFieldTotalsOnChange({
        fieldValue: value,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
      });

    case isTempDynamicField(name) && isFieldType(fieldType, "totalComputable"):
      return recalculateDynamicFieldTotalsOnChange({
        fieldValue: value,
        percentage,
      });

    case isFieldType(fieldType, "percentageOverride"):
      return recalculateFieldTotalsOnChange({
        fieldValue: value,
        isPercentageOverrideUpdated: true,
        percentage,
        percentageOverride,
      });

    case isFieldType(fieldType, "totalComputable"):
      return recalculateFieldTotalsOnChange({
        fieldValue: value,
        percentage,
      });

    default:
      // Nothing changed, return original fieldData
      return fieldData;
  }
};

export const createTempDynamicId = (name: string, dynamicId: string) => {
  const { fieldId, fieldType } = getFieldParts(name);
  const newFieldId = [DYNAMIC_FIELD_PREFIX, fieldId, dynamicId].join("_");
  return [newFieldId, fieldType].join("-");
};

export const getFieldParts = (fieldName: string) => {
  const lastDashIndex = fieldName.lastIndexOf("-");
  const fieldType =
    lastDashIndex !== -1 ? fieldName.slice(lastDashIndex + 1) : "";
  const fieldId =
    lastDashIndex !== -1 ? fieldName.slice(0, lastDashIndex) : fieldName;

  // fieldId expected format: formId_formTableId_formFieldId
  const parts = fieldId.split("_");
  const dynamicIdRegEx = /^[0-9a-fA-F]+(?:-[0-9a-fA-F]+)+$/;
  const lastPart = parts.at(-1)!;

  let dynamicFieldId = "";
  let dynamicTemplateId = "";

  let formId = parts[0];
  let formTableId = parts[1];
  // tableId expected format: formId_formTableId
  let tableId = [formId, formTableId].join("_");

  if (formId === DYNAMIC_FIELD_PREFIX && dynamicIdRegEx.test(lastPart)) {
    dynamicFieldId = lastPart;
    dynamicTemplateId = parts.slice(1, -1).join("_");

    const dynamicParts = dynamicTemplateId.split("_");
    formId = dynamicParts[0];
    formTableId = dynamicParts[1];
    tableId = [formId, formTableId].join("_");
  }

  return {
    dynamicFieldId,
    dynamicTemplateId,
    fieldId,
    fieldType,
    formId,
    tableId,
  };
};

export const getFmapForm = (name: string) => {
  const formId = name.replaceAll(/(fmap_|Percentage)/g, "");
  return formId;
};

export const isFieldType = (name: string, value: string) => {
  return name === value;
};

export const isFmapPct = (name: string) => {
  return /^fmap_[A-Za-z0-9]+Percentage$/.test(name);
};

export const isTempDynamicField = (name: string) => {
  const { dynamicFieldId } = getFieldParts(name);
  return !!dynamicFieldId;
};

export const recalculateDynamicFields = ({
  dynamicFieldId,
  dynamicTemplateId,
  formId,
  fieldData,
  fieldValue,
  isPercentageOverrideUpdated = false,
  percentageOverride,
  tableId,
}: RecalculateDynamicFields) => {
  const percentageField = `fmap_${formId}Percentage`;
  const formPercentage = fieldData?.[percentageField] || 100;
  const templateFieldData = fieldData?.[dynamicTemplateId] || [];
  const currentFieldIndex = templateFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === dynamicFieldId
  );
  const currentField = templateFieldData[currentFieldIndex] || {};

  const fieldPercentage = currentField?.percentageOverride;
  let percentage = fieldPercentage || formPercentage;

  if (isPercentageOverrideUpdated) {
    percentage = percentageOverride || formPercentage;
  }

  const { field, table, template } = dynamicFieldTableTotals({
    dynamicFieldId,
    dynamicTemplateId,
    fieldData,
    fieldSuffixesToCalculate,
    fieldValue,
    percentage,
    tableId,
  });

  const updatedCurrentFieldData = (totals: CalculatedSharesType) =>
    Object.fromEntries(
      fieldsToMap.map(([key, suffix]) => [suffix, totals[key]])
    );

  const updatedField = {
    ...currentField,
    id: dynamicFieldId,
    name: dynamicFieldId,
    totalComputable: fieldValue,
    ...updatedCurrentFieldData(field),
  };

  if (isPercentageOverrideUpdated) {
    updatedField.percentageOverride = percentageOverride;
  }

  if (currentFieldIndex !== -1) {
    templateFieldData[currentFieldIndex] = updatedField;
  } else {
    templateFieldData.push(updatedField);
  }

  const dynamicTemplateField = {
    name: dynamicTemplateId,
    type: ReportFormFieldType.DYNAMIC_OBJECT,
    value: templateFieldData,
  };

  const updatedFields = (
    fieldOrTableId: string,
    totals: CalculatedSharesType
  ) =>
    fieldsToMap.map(([key, fieldSuffix]) => ({
      name: `${fieldOrTableId}-${fieldSuffix}`,
      type: ReportFormFieldType.NUMBER,
      value: totals[key],
    }));

  const fieldsToSave = [
    dynamicTemplateField,
    ...updatedFields(dynamicTemplateId, template),
    ...updatedFields(tableId, table),
  ];

  return fieldsToSave;
};

interface RecalculateDynamicFields {
  dynamicFieldId: string;
  dynamicTemplateId: string;
  formId: string;
  fieldData: AnyObject;
  fieldValue: number | string;
  isPercentageOverrideUpdated?: boolean;
  percentageOverride?: number;
  tableId: string;
}

interface RecalculateFieldTotals {
  fieldValue: number | string;
  isPercentageOverrideUpdated?: boolean;
  percentage: number;
  percentageOverride?: number;
}

interface UpdatedReportFields {
  id: string;
  name: string;
  percentage: number;
  percentageOverride?: number;
  fieldData: AnyObject;
  tableId: string;
  value: number | string;
}
