// types
import {
  AnyObject,
  DynamicFieldShape,
  InputChangeEvent,
  ReportFormFieldType,
} from "types";
// utils
import {
  CalculatedSharesType,
  dynamicFieldTableTotals,
  fieldTableTotals,
  getFieldParts,
  isTempDynamicField,
  sumDynamicFields,
} from "utils";

const fieldsFromKeys = <T>(obj: Partial<Record<keyof T, string>>) =>
  Object.entries(obj) as Array<[keyof T, string]>;

const updatedFieldData = <T>(
  fieldsToMap: [keyof T, string][],
  totals: T,
  id?: string
) =>
  Object.fromEntries(
    fieldsToMap.map(([key, suffix]) => {
      const suffixKey = id ? `${id}-${suffix}` : suffix;
      return [suffixKey, totals[key]];
    })
  );

const updatedFieldInfo = <T>(
  fieldsToMap: [keyof T, string][],
  totals: T,
  fieldOrTableId: string
) =>
  fieldsToMap.map(([key, fieldSuffix]) => ({
    name: `${fieldOrTableId}-${fieldSuffix}`,
    type: ReportFormFieldType.NUMBER,
    value: totals[key],
  }));

const calculationTableSuffixes = {
  total: "totalComputable",
  percentageShare: "totalFederalShare",
  remainingShare: "totalStateTerritoryShare",
};

export const calculationTableDynamicTotalsOnSave = ({
  dynamicFieldId,
  dynamicTemplateId,
  fieldData,
  fieldValue,
  formId,
  isPercentageOverrideUpdated = false,
  percentageOverride,
  tableId,
}: CalculateDynamicTotalsOnSave) => {
  const fieldsToMap = fieldsFromKeys<CalculatedSharesType>(
    calculationTableSuffixes
  );
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

  const { field, table, template, serviceTables, allTables } =
    dynamicFieldTableTotals({
      dynamicFieldId,
      dynamicTemplateId,
      fieldData,
      fieldSuffixesToCalculate: calculationTableSuffixes,
      fieldValue,
      percentage,
      tableId,
    });

  const updatedField = {
    id: dynamicFieldId,
    name: dynamicFieldId,
    ...currentField,
    [calculationTableSuffixes.total]: fieldValue,
    ...updatedFieldData<CalculatedSharesType>(fieldsToMap, field),
  };

  if (isPercentageOverrideUpdated) {
    updatedField.percentageOverride = percentageOverride;
  }

  if (currentFieldIndex === -1) {
    templateFieldData.push(updatedField);
  } else {
    templateFieldData[currentFieldIndex] = updatedField;
  }

  const dynamicTemplateField = {
    name: dynamicTemplateId,
    type: ReportFormFieldType.DYNAMIC_OBJECT,
    value: templateFieldData,
  };

  const fieldsToSave = [
    dynamicTemplateField,
    ...updatedFieldInfo<CalculatedSharesType>(
      fieldsToMap,
      template,
      dynamicTemplateId
    ),
    ...updatedFieldInfo<CalculatedSharesType>(fieldsToMap, table, tableId),
    ...updatedFieldInfo<CalculatedSharesType>(
      fieldsToMap,
      serviceTables,
      "totals_totalsSummary_serviceTotals"
    ),
    ...updatedFieldInfo<CalculatedSharesType>(
      fieldsToMap,
      allTables,
      "totals_totals_totalsSummary_allTotals"
    ),
  ];

  return fieldsToSave;
};

export const calculationTableTotalsOnSave = ({
  fieldData,
  fieldId,
  fieldValue,
  isPercentageOverrideUpdated,
  percentage,
  percentageOverride,
  tableId,
}: CalculateTotalsOnChange) => {
  const fieldsToMap = fieldsFromKeys<CalculatedSharesType>(
    calculationTableSuffixes
  );

  const { field, table, serviceTables, allTables } = fieldTableTotals({
    fieldData,
    fieldId,
    fieldSuffixesToCalculate: calculationTableSuffixes,
    fieldValue,
    percentage,
    tableId,
  });

  const fieldsToSave = [
    ...updatedFieldInfo<CalculatedSharesType>(fieldsToMap, field, fieldId),
    ...updatedFieldInfo<CalculatedSharesType>(fieldsToMap, table, tableId),
    ...updatedFieldInfo<CalculatedSharesType>(
      fieldsToMap,
      serviceTables,
      "totals_totalsSummary_serviceTotals"
    ),
    ...updatedFieldInfo<CalculatedSharesType>(
      fieldsToMap,
      allTables,
      "totals_totals_totalsSummary_allTotals"
    ),
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

export const calculationTableDynamicTotalsOnChange = ({
  dynamicFieldId,
  dynamicTemplateId,
  fieldData,
  fieldValue,
  isPercentageOverrideUpdated = false,
  percentage,
  percentageOverride,
  tableId,
}: CalculateDynamicTotalsOnChange) => {
  const fieldsToMap = fieldsFromKeys<CalculatedSharesType>(
    calculationTableSuffixes
  );

  const { field, table, template, serviceTables, allTables } =
    dynamicFieldTableTotals({
      dynamicFieldId,
      dynamicTemplateId,
      fieldData,
      fieldSuffixesToCalculate: calculationTableSuffixes,
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
    id: dynamicFieldId,
    name: dynamicFieldId,
    ...currentField,
    // Update just the calculations on change, other fields will update on blur
    totalFederalShare: field.percentageShare,
    totalStateTerritoryShare: field.remainingShare,
  };

  if (isPercentageOverrideUpdated) {
    updatedField.percentageOverride = percentageOverride;
  }

  if (currentFieldIndex === -1) {
    templateFieldData.push(updatedField);
  } else {
    templateFieldData[currentFieldIndex] = updatedField;
  }

  const fieldDataToUpdate = {
    ...fieldData,
    [dynamicTemplateId]: templateFieldData,
    ...updatedFieldData<CalculatedSharesType>(
      fieldsToMap,
      template,
      dynamicTemplateId
    ),
    ...updatedFieldData<CalculatedSharesType>(fieldsToMap, table, tableId),
    ...updatedFieldData<CalculatedSharesType>(
      fieldsToMap,
      serviceTables,
      "totals_totalsSummary_serviceTotals"
    ),
    ...updatedFieldData<CalculatedSharesType>(
      fieldsToMap,
      allTables,
      "totals_totals_totalsSummary_allTotals"
    ),
  };

  return fieldDataToUpdate;
};

export const calculationTableTotalsOnChange = ({
  fieldData,
  fieldId,
  fieldValue,
  isPercentageOverrideUpdated = false,
  percentage,
  percentageOverride,
  tableId,
}: CalculateTotalsOnChange) => {
  const fieldsToMap = fieldsFromKeys<CalculatedSharesType>(
    calculationTableSuffixes
  );

  const { field, table, serviceTables, allTables } = fieldTableTotals({
    fieldData,
    fieldId,
    fieldSuffixesToCalculate: calculationTableSuffixes,
    fieldValue,
    percentage,
    tableId,
  });

  const fieldDataToUpdate = {
    ...fieldData,
    ...updatedFieldData<CalculatedSharesType>(fieldsToMap, field, fieldId),
    ...updatedFieldData<CalculatedSharesType>(fieldsToMap, table, tableId),
    ...updatedFieldData<CalculatedSharesType>(
      fieldsToMap,
      serviceTables,
      "totals_totalsSummary_serviceTotals"
    ),
    ...updatedFieldData<CalculatedSharesType>(
      fieldsToMap,
      allTables,
      "totals_totals_totalsSummary_allTotals"
    ),
  };

  if (isPercentageOverrideUpdated) {
    fieldDataToUpdate[`${fieldId}-percentageOverride`] = percentageOverride;
  }

  return fieldDataToUpdate;
};

const summationTableSuffixes = {
  0: "budgetedFullTimeEmployees",
  1: "filledFullTimeEmployees",
};

export const summationTableDynamicTotalsOnSave = ({
  dynamicFieldId,
  dynamicTemplateId,
  fieldData,
  fieldValue,
  fieldType,
  tableId,
}: CalculateDynamicTotalsOnSave) => {
  const fieldsToMap = fieldsFromKeys<AnyObject>(summationTableSuffixes);
  const templateFieldData = fieldData?.[dynamicTemplateId] || [];
  const currentFieldIndex = templateFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === dynamicFieldId
  );
  const currentField = templateFieldData[currentFieldIndex] || {};

  const updatedField = {
    id: dynamicFieldId,
    name: dynamicFieldId,
    ...currentField,
  };

  if (fieldType) {
    // Row was updated
    updatedField[fieldType] = fieldValue;
  } else {
    // Row was deleted
    Object.values(summationTableSuffixes).forEach((key) => {
      updatedField[key] = 0;
    });
  }

  if (currentFieldIndex === -1) {
    templateFieldData.push(updatedField);
  } else {
    templateFieldData[currentFieldIndex] = updatedField;
  }

  const dynamicTemplateField = {
    name: dynamicTemplateId,
    type: ReportFormFieldType.DYNAMIC_OBJECT,
    value: templateFieldData,
  };

  const totals = Object.fromEntries(
    fieldsToMap.map(([key, suffix]) => [
      key,
      sumDynamicFields(templateFieldData, suffix),
    ])
  );

  const fieldsToSave = [
    dynamicTemplateField,
    ...updatedFieldInfo<AnyObject>(fieldsToMap, totals, dynamicTemplateId),
    ...updatedFieldInfo<AnyObject>(fieldsToMap, totals, tableId),
  ];

  return fieldsToSave;
};

export const summationTableDynamicTotalsOnChange = ({
  dynamicFieldId,
  dynamicTemplateId,
  fieldData,
  fieldType = "",
  fieldValue,
  tableId,
}: CalculateDynamicTotalsOnChange) => {
  const fieldsToMap = fieldsFromKeys<typeof summationTableSuffixes>(
    summationTableSuffixes
  );
  const templateFieldData = [...(fieldData?.[dynamicTemplateId] || [])];
  const currentField = templateFieldData.find(
    (field: DynamicFieldShape) => field.id === dynamicFieldId
  );
  // Update just the sums on change, other fields will update on blur
  const fieldsToSum = templateFieldData.filter(
    (field: DynamicFieldShape) => field.id !== dynamicFieldId
  );
  fieldsToSum.push({
    id: dynamicFieldId,
    name: dynamicFieldId,
    ...currentField,
    [fieldType]: fieldValue,
  });

  const totals = Object.fromEntries(
    fieldsToMap.map(([key, suffix]) => [
      key,
      sumDynamicFields(fieldsToSum, suffix),
    ])
  );

  const fieldDataToUpdate = {
    ...fieldData,
    [dynamicTemplateId]: templateFieldData,
    ...updatedFieldData<AnyObject>(fieldsToMap, totals, dynamicTemplateId),
    ...updatedFieldData<AnyObject>(fieldsToMap, totals, tableId),
  };

  return fieldDataToUpdate;
};

export const setPercentageAndValue = (
  event: InputChangeEvent,
  localFieldData: AnyObject,
  formPercentage: number
) => {
  const { name, value: inputValue } = event.target;
  const { dynamicFieldId, dynamicTemplateId, fieldId, fieldType } =
    getFieldParts(name);

  let percentage;
  // For totalComputable, use value from input
  let value = inputValue;
  let totalComputable = localFieldData?.[`${fieldId}-totalComputable`];
  let percentageOverride = localFieldData?.[`${fieldId}-percentageOverride`];

  if (isTempDynamicField(name)) {
    const templateFieldData = localFieldData?.[dynamicTemplateId] || [];
    const currentField = templateFieldData.find(
      (field: DynamicFieldShape) => field.id === dynamicFieldId
    );

    totalComputable = currentField?.totalComputable;
    percentageOverride = currentField?.percentageOverride;
  }
  // For totalComputable, use percentageOverride from fieldData
  percentage = percentageOverride || formPercentage;

  if (fieldType === "percentageOverride") {
    // For percentageOverride, use totalComputable from fieldData
    value = totalComputable;
    // For percentageOverride, use value from input
    percentage = inputValue ? Number(inputValue) : formPercentage;
    percentageOverride = inputValue;
  }

  return {
    name,
    percentage,
    percentageOverride,
    value,
  };
};

interface CalculateDynamicTotalsOnSave {
  dynamicFieldId: string;
  dynamicTemplateId: string;
  fieldData: AnyObject;
  fieldType?: string;
  fieldValue: number | string;
  formId: string;
  isPercentageOverrideUpdated?: boolean;
  percentageOverride?: number;
  tableId: string;
}

interface CalculateDynamicTotalsOnChange {
  dynamicFieldId: string;
  dynamicTemplateId: string;
  fieldData: AnyObject;
  fieldType?: string;
  fieldValue: number | string;
  isPercentageOverrideUpdated?: boolean;
  percentage: number;
  percentageOverride?: number;
  tableId: string;
}

interface CalculateTotalsOnChange {
  fieldData: AnyObject;
  fieldId: string;
  fieldValue: number | string;
  isPercentageOverrideUpdated?: boolean;
  percentage: number;
  percentageOverride?: number;
  tableId: string;
}

export interface UpdatedFieldDataOnChange {
  fieldData: AnyObject;
  name: string;
  percentage: number;
  percentageOverride?: number;
  value: number | string;
}
