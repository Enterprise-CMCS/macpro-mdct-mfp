import { getReportFieldData } from "../../storage/reports";
import { getPossibleFieldsFromFormTemplate } from "../formTemplates/formTemplates";
import { ReportFieldData, ReportJson, ReportType, State } from "../types";

/**
 *
 * @param reportBucket bucket name
 * @param state state
 * @param copyFieldDataSourceId fieldDataId of source report
 * @param formTemplate form template json object
 * @param validatedFieldData validated field data from request
 */

//extra fields that needs to be copied over
const additionalFields = [
  "id",
  "type",
  "isOtherEntity",
  "isRequired",
  "isCopied",
  "isInitiativeClosed",
];

const financialReportExcludedFieldIds = [
  "stateName",
  "stateOrTerritory",
  "submissionCount",
];

const financialReportExcludedNormalizedFieldNames = [
  "percentageOverride",
  "totalComputable",
  "totalStateTerritoryShare",
  "totalFederalShare",
];

const financialReportEntityExcludedNormalizedFieldNames: Record<
  string,
  string[]
> = {
  administrativeCosts_budgetCategory_miscellaneousCosts: ["percentageOverride"],
  administrativeCosts_subRecipients_subRecipients: ["percentageOverride"],
  administrativeCosts_personnel_positions: [
    "budgetedFullTimeEmployees",
    "filledFullTimeEmployees",
  ],
};

const financialReportEntityIncludedNormalizedFieldNames = [
  "category",
  "description",
  "title",
];

const getFieldKeySuffix = (fieldKey: string) => {
  return fieldKey.split("-").pop() ?? "";
};

const isFinancialReportCommentField = (fieldKey: string) => {
  const normalized = fieldKey.toLowerCase();
  return normalized.includes("narrative");
};

const isExcludedFinancialReportNormalizedField = (
  normalizedFieldName: string,
  entityExcludedFields: string[]
) => {
  return (
    financialReportExcludedNormalizedFieldNames.includes(normalizedFieldName) ||
    entityExcludedFields.includes(normalizedFieldName)
  );
};

const shouldExcludeCopiedField = (
  reportType: ReportType | undefined,
  fieldKey: string,
  entityType?: string
) => {
  if (reportType !== ReportType.FINANCIAL_REPORT) return false;
  const normalizedFieldName = getFieldKeySuffix(fieldKey);
  const entityExcludedFields = entityType
    ? (financialReportEntityExcludedNormalizedFieldNames[entityType] ?? [])
    : [];

  return (
    financialReportExcludedFieldIds.includes(fieldKey) ||
    isFinancialReportCommentField(fieldKey) ||
    isExcludedFinancialReportNormalizedField(
      normalizedFieldName,
      entityExcludedFields
    )
  );
};

const shouldExcludeCopiedEntityField = (
  reportType: ReportType | undefined,
  fieldKey: string
) => {
  if (reportType !== ReportType.FINANCIAL_REPORT) return true;

  const normalizedFieldName = getFieldKeySuffix(fieldKey);
  return !financialReportEntityIncludedNormalizedFieldNames.includes(
    normalizedFieldName
  );
};

function pruneEntityData(
  sourceFieldData: ReportFieldData,
  key: string,
  entityData: ReportFieldData[],
  possibleFields: string[],
  reportType?: ReportType
) {
  //adding fields to be copied over from entries
  const concatEntityFields = [...possibleFields, ...additionalFields];
  entityData.forEach((entity, index) => {
    // Delete any key existing in the source data not valid in our template, or any entity key that's not a name.
    if (!concatEntityFields.includes(key)) {
      delete sourceFieldData[key];
      return;
    }

    Object.keys(entity).forEach((entityKey) => {
      //check to see if the object is an array, this is for capturing substeps in the initiatives
      if (Array.isArray(entity[entityKey])) {
        pruneEntityData(
          sourceFieldData,
          key,
          entity[entityKey] as ReportFieldData[],
          possibleFields,
          reportType
        );
      } else if (
        shouldExcludeCopiedField(reportType, entityKey, key) ||
        (shouldExcludeCopiedEntityField(reportType, entityKey) &&
          !entityKey.includes("name") &&
          !concatEntityFields.includes(entityKey) &&
          !["key", "value"].includes(entityKey))
      ) {
        delete entityData[index][entityKey];
      }
    });

    if (Object.keys(entity).length === 0) {
      delete entityData[index];
    } else {
      entityData[index]["isCopied"] = true;
    }
  });

  //filter out any closeout data
  if (Array.isArray(sourceFieldData[key])) {
    const filteredData = (sourceFieldData[key] as ReportFieldData[]).filter(
      (field) => !field["isInitiativeClosed"]
    );
    sourceFieldData[key] = filteredData;
  }
  // Delete whole key if there's nothing in it.
  if (entityData.every((e) => e === null)) {
    delete sourceFieldData[key];
  }
}

export async function copyFieldDataFromSource(
  state: State,
  copyFieldDataSourceId: string,
  formTemplate: ReportJson,
  validatedFieldData: ReportFieldData
) {
  const sourceFieldData = await getReportFieldData({
    reportType: formTemplate.type,
    state,
    fieldDataId: copyFieldDataSourceId,
  });

  if (sourceFieldData) {
    const possibleFields = getPossibleFieldsFromFormTemplate(formTemplate);
    Object.keys(sourceFieldData).forEach((key: string) => {
      if (shouldExcludeCopiedField(formTemplate.type, key)) {
        delete sourceFieldData[key];
        return;
      }

      // Only iterate through entities, not choice lists
      if (Array.isArray(sourceFieldData[key])) {
        pruneEntityData(
          sourceFieldData,
          key,
          sourceFieldData[key] as ReportFieldData[],
          possibleFields,
          formTemplate.type
        );
      } else if (!possibleFields.includes(key)) {
        delete sourceFieldData[key];
      }
    });

    Object.assign(validatedFieldData, sourceFieldData);
  }

  return validatedFieldData;
}
