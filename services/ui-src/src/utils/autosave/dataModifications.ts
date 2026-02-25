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
  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "totalComputable"): {
      return recalculateDynamicFields({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        formId,
        tableId,
        value,
      });
    }
    case isFieldType(fieldType, "totalComputable"): {
      const percentageField = `fmap_${formId}Percentage`;
      const formPercentage = fieldData[percentageField] || 100;
      const fieldPercentageField = `${fieldId}-percentageOverride`;
      const percentage = fieldData?.[fieldPercentageField] || formPercentage;

      const { field, table } = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldValue: value,
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

      return [
        ...updatedFields(fieldId, field),
        ...updatedFields(tableId, table),
      ];
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
      const templateFieldData = fieldData?.[dynamicTemplateId] ?? [];
      const currentFieldIndex = templateFieldData.findIndex(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );
      const updatedField = {
        ...templateFieldData[currentFieldIndex],
        id: dynamicFieldId,
        name: dynamicFieldId,
        [fieldType]: value,
      };

      if (currentFieldIndex > -1) {
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
  tableId,
  value,
}: UpdatedReportFields) => {
  const { dynamicFieldId, dynamicTemplateId, fieldId, fieldType } =
    getFieldParts(name);
  switch (true) {
    case isTempDynamicField(name) &&
      isFieldType(fieldType, "totalComputable"): {
      const { field, table, template } = dynamicFieldTableTotals({
        dynamicFieldId,
        dynamicTemplateId,
        fieldData,
        fieldSuffixesToCalculate,
        fieldValue: value,
        percentage,
        tableId,
      });
      const templateFieldData = [...(fieldData?.[dynamicTemplateId] ?? [])];
      const currentFieldIndex = templateFieldData.findIndex(
        (field: DynamicFieldShape) => field.id === dynamicFieldId
      );
      const currentField = templateFieldData[currentFieldIndex] || {};
      const updatedField = {
        ...currentField,
        id: dynamicFieldId,
        name: dynamicFieldId,
        // Update just the calculations on change, totalComputable will update on blur
        percentageShare: field.remainingShare,
        totalFederalShare: field.percentageShare,
      };

      if (currentFieldIndex > -1) {
        templateFieldData[currentFieldIndex] = updatedField;
      } else {
        templateFieldData.push(updatedField);
      }

      const updatedFieldData = (id: string, totals: CalculatedSharesType) =>
        Object.fromEntries(
          fieldsToMap.map(([key, suffix]) => [`${id}-${suffix}`, totals[key]])
        );

      return {
        ...fieldData,
        [dynamicTemplateId]: templateFieldData,
        ...updatedFieldData(dynamicTemplateId, template),
        ...updatedFieldData(tableId, table),
      };
    }
    case isFieldType(fieldType, "totalComputable"): {
      const { field, table } = fieldTableTotals({
        fieldData,
        fieldId,
        fieldSuffixesToCalculate,
        fieldValue: value,
        percentage,
        tableId,
      });

      const updatedFieldData = (id: string, totals: CalculatedSharesType) =>
        Object.fromEntries(
          fieldsToMap.map(([key, suffix]) => [`${id}-${suffix}`, totals[key]])
        );

      return {
        ...fieldData,
        ...updatedFieldData(fieldId, field),
        ...updatedFieldData(tableId, table),
      };
    }
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
  const lastPart = parts[parts.length - 1];

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
  const formId = name.replace(/(fmap_|Percentage)/g, "");
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
  tableId,
  value,
}: any) => {
  const percentageField = `fmap_${formId}Percentage`;
  const formPercentage = fieldData?.[percentageField] || 100;
  const templateFieldData = fieldData?.[dynamicTemplateId] || [];
  const currentFieldIndex = templateFieldData.findIndex(
    (field: DynamicFieldShape) => field.id === dynamicFieldId
  );
  const fieldPercentageField =
    templateFieldData[currentFieldIndex]?.percentageOverride;
  const percentage = fieldData?.[fieldPercentageField] || formPercentage;

  const { field, table, template } = dynamicFieldTableTotals({
    dynamicFieldId,
    dynamicTemplateId,
    fieldData,
    fieldSuffixesToCalculate,
    fieldValue: value,
    percentage,
    tableId,
  });

  const currentField = templateFieldData[currentFieldIndex] || {};

  const updatedCurrentFieldData = (totals: CalculatedSharesType) =>
    Object.fromEntries(
      fieldsToMap.map(([key, suffix]) => [suffix, totals[key]])
    );

  const updatedField = {
    ...currentField,
    id: dynamicFieldId,
    name: dynamicFieldId,
    ...updatedCurrentFieldData(field),
  };

  if (currentFieldIndex > -1) {
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

  return [
    dynamicTemplateField,
    ...updatedFields(dynamicTemplateId, template),
    ...updatedFields(tableId, table),
  ];
};

interface UpdatedReportFields {
  id: string;
  name: string;
  percentage: number;
  fieldData: AnyObject;
  tableId: string;
  value: number | string;
}
