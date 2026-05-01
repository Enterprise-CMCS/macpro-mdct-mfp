import { getReportFieldData } from "../../storage/reports";
import { isFeatureFlagEnabled } from "../featureFlags/featureFlags";
import { getPossibleFieldsFromFormTemplate } from "../formTemplates/formTemplates";
import {
  EntityType,
  ReportFieldData,
  ReportJson,
  ReportType,
  State,
} from "../types";

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

const isExcludedInitiativeV1Field = (
  fieldKey: string,
  sourceFieldData: ReportFieldData | undefined,
  options?: { [key: string]: boolean }
) => {
  if (!sourceFieldData?.[EntityType.INITIATIVE] || !options?.wpSarRelease2025) {
    return false;
  }

  const hasInitiativeV1 = (
    sourceFieldData[EntityType.INITIATIVE] as ReportFieldData[]
  ).some((t) => t.evaluationPlan || t.fundingSources);

  if (!hasInitiativeV1) return false;

  return (
    fieldKey.startsWith("defineInitiative") ||
    ["evaluationPlan", "fundingSources"].includes(fieldKey)
  );
};

const shouldExcludeCopiedField = (
  reportType: ReportType | undefined,
  fieldKey: string,
  entityType: string | undefined,
  sourceFieldData: ReportFieldData,
  options?: { [key: string]: boolean }
) => {
  switch (reportType) {
    case ReportType.WP:
      return isExcludedInitiativeV1Field(fieldKey, sourceFieldData, options);
    case ReportType.FINANCIAL_REPORT: {
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
    }
    default:
      return false;
  }
};

const shouldExcludeCopiedEntityField = (
  reportType: ReportType | undefined,
  fieldKey: string,
  sourceFieldData: ReportFieldData,
  options?: { [key: string]: boolean }
) => {
  switch (reportType) {
    case ReportType.WP:
      return isExcludedInitiativeV1Field(fieldKey, sourceFieldData, options);
    case ReportType.FINANCIAL_REPORT: {
      const normalizedFieldName = getFieldKeySuffix(fieldKey);
      return !financialReportEntityIncludedNormalizedFieldNames.includes(
        normalizedFieldName
      );
    }
    default:
      return true;
  }
};

const isNameField = (entityKey: string) => entityKey.includes("name");
const isChoiceField = (entityKey: string) =>
  ["key", "value"].includes(entityKey);

const pruneEntityData = async (
  sourceFieldData: ReportFieldData,
  key: string,
  entityData: ReportFieldData[],
  possibleFields: string[],
  reportType: ReportType | undefined,
  options?: { [key: string]: boolean }
) => {
  // adding fields to be copied over from entries
  const concatEntityFields = [...possibleFields, ...additionalFields];

  for (const [index, entity] of entityData.entries()) {
    // Delete any key existing in the source data not valid in our template, or any entity key that's not a name.
    if (!concatEntityFields.includes(key)) {
      delete sourceFieldData[key];
      continue;
    }

    for (const entityKey of Object.keys(entity)) {
      /**
       * Check to see if the object is an array,
       * this is for capturing entitySteps in initiatives v1
       *
       * In initiatives v2, only name and topic are copied
       */
      if (
        Array.isArray(entity[entityKey]) &&
        !isExcludedInitiativeV1Field(entityKey, sourceFieldData, options)
      ) {
        pruneEntityData(
          sourceFieldData,
          key,
          entity[entityKey] as ReportFieldData[],
          possibleFields,
          reportType,
          options
        );
      } else if (
        shouldExcludeCopiedField(
          reportType,
          entityKey,
          key,
          sourceFieldData,
          options
        ) ||
        (shouldExcludeCopiedEntityField(
          reportType,
          entityKey,
          sourceFieldData,
          options
        ) &&
          !isNameField(entityKey) &&
          !isChoiceField(entityKey) &&
          !concatEntityFields.includes(entityKey))
      ) {
        delete entityData[index][entityKey];
      }
    }

    if (Object.keys(entity).length === 0) {
      delete entityData[index];
    } else {
      entityData[index].isCopied = true;
    }
  }

  // filter out any closeout data
  if (Array.isArray(sourceFieldData[key])) {
    const filteredData = (sourceFieldData[key] as ReportFieldData[]).filter(
      (field) => !field.isInitiativeClosed
    );
    sourceFieldData[key] = filteredData;
  }
  // Delete whole key if there's nothing in it.
  if (entityData.every((e) => e === null)) {
    delete sourceFieldData[key];
  }
};

export async function copyFieldDataFromSource(
  state: State,
  copyFieldDataSourceId: string,
  formTemplate: ReportJson,
  validatedFieldData: ReportFieldData
) {
  const wpSarRelease2025 = await isFeatureFlagEnabled("wpSarRelease2025");
  const options = { wpSarRelease2025 };

  const sourceFieldData = await getReportFieldData({
    reportType: formTemplate.type,
    state,
    fieldDataId: copyFieldDataSourceId,
  });

  if (sourceFieldData) {
    const possibleFields = getPossibleFieldsFromFormTemplate(formTemplate);

    for (const key of Object.keys(sourceFieldData)) {
      if (
        shouldExcludeCopiedField(
          formTemplate.type,
          key,
          undefined,
          sourceFieldData,
          options
        )
      ) {
        delete sourceFieldData[key];
        continue;
      }

      // Only iterate through entities, not choice lists
      if (Array.isArray(sourceFieldData[key])) {
        pruneEntityData(
          sourceFieldData,
          key,
          sourceFieldData[key] as ReportFieldData[],
          possibleFields,
          formTemplate.type,
          options
        );
      } else if (!possibleFields.includes(key)) {
        delete sourceFieldData[key];
      }
    }

    Object.assign(validatedFieldData, sourceFieldData);
  }

  return validatedFieldData;
}
