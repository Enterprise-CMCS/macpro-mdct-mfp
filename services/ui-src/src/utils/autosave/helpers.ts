const DYNAMIC_FIELD_PREFIX = "tempDynamicField";

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
  const lastPart = parts.at(-1) || "";

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
