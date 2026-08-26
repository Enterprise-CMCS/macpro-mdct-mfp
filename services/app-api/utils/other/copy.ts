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

type CopyOptions = {
  wpSarRelease2025: boolean;
  hasInitiativeV1: boolean;
};

// Arrays that only exist on v1-shaped initiatives; their presence is how a
// v1 source is detected, and they are stripped along with defineInitiative*
const initiativeV1Fields = ["evaluationPlan", "fundingSources"];

const isExcludedInitiativeV1Field = (
  fieldKey: string,
  options: CopyOptions
) => {
  if (!options.wpSarRelease2025 || !options.hasInitiativeV1) {
    return false;
  }

  return (
    fieldKey.startsWith("defineInitiative") ||
    initiativeV1Fields.includes(fieldKey)
  );
};

/**
 * True if any open initiative in the source still uses the v1 shape.
 * Computed once per copy, before pruning begins: the pruning pass deletes
 * v1 fields and drops closed initiatives as it goes, so recomputing this
 * mid-pass would make the answer depend on entity order.
 */
const sourceHasInitiativeV1 = (sourceFieldData: ReportFieldData) => {
  const initiatives = sourceFieldData[EntityType.INITIATIVE];
  return (
    Array.isArray(initiatives) &&
    (initiatives as ReportFieldData[]).some(
      (initiative) =>
        initiative &&
        !initiative.isInitiativeClosed &&
        initiativeV1Fields.some((field) => initiative[field])
    )
  );
};

const shouldExcludeCopiedField = (
  reportType: ReportType | undefined,
  fieldKey: string,
  entityType: string | undefined,
  options: CopyOptions
) => {
  switch (reportType) {
    case ReportType.WP:
      return isExcludedInitiativeV1Field(fieldKey, options);
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
  options: CopyOptions
) => {
  switch (reportType) {
    case ReportType.WP:
      return isExcludedInitiativeV1Field(fieldKey, options);
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
const isCloseOutField = (entityKey: string) =>
  entityKey.startsWith("closeOutInformation_");

/**
 * Prunes one array of entities, dropping fields that should not be copied and
 * entities left with nothing at all. Returns a new array: emptied entries
 * are omitted rather than deleted in place, since they serialize to null and
 * crash the next copy of the resulting report.
 *
 * This mutates the entities it is handed, but never touches any other part of
 * the field data. Deciding the fate of the top-level key the array belongs to
 * is the caller's job.
 */
const pruneEntityData = (
  entityType: string,
  entityData: ReportFieldData[],
  concatEntityFields: Set<string>,
  reportType: ReportType | undefined,
  options: CopyOptions
): ReportFieldData[] => {
  const prunedEntities: ReportFieldData[] = [];

  for (const entity of entityData) {
    // guard against holes/nulls left behind by an older copy
    if (!entity) continue;

    for (const entityKey of Object.keys(entity)) {
      // Answering 'no' in the Close-out modal does not
      // carry over between Work Plans. (WP -> SAR copyover keeps them.)
      if (reportType === ReportType.WP && isCloseOutField(entityKey)) {
        delete entity[entityKey];
        continue;
      }

      /**
       * Check to see if the object is an array,
       * this is for capturing entitySteps in initiatives v1
       *
       * In initiatives v2, only name and topic are copied
       */
      if (
        Array.isArray(entity[entityKey]) &&
        !isExcludedInitiativeV1Field(entityKey, options)
      ) {
        entity[entityKey] = pruneEntityData(
          entityType,
          entity[entityKey] as ReportFieldData[],
          concatEntityFields,
          reportType,
          options
        );
      } else if (
        shouldExcludeCopiedField(reportType, entityKey, entityType, options) ||
        (shouldExcludeCopiedEntityField(reportType, entityKey, options) &&
          !isNameField(entityKey) &&
          !isChoiceField(entityKey) &&
          !concatEntityFields.has(entityKey))
      ) {
        delete entity[entityKey];
      }
    }

    if (Object.keys(entity).length === 0) continue;

    entity.isCopied = true;
    prunedEntities.push(entity);
  }

  return prunedEntities;
};

export async function copyFieldDataFromSource(
  state: State,
  copyFieldDataSourceId: string,
  formTemplate: ReportJson,
  validatedFieldData: ReportFieldData
) {
  const wpSarRelease2025 = await isFeatureFlagEnabled("wpSarRelease2025");

  const sourceFieldData = await getReportFieldData({
    reportType: formTemplate.type,
    state,
    fieldDataId: copyFieldDataSourceId,
  });

  if (sourceFieldData) {
    const options = {
      wpSarRelease2025,
      hasInitiativeV1: sourceHasInitiativeV1(sourceFieldData),
    };

    const possibleFields = new Set(
      getPossibleFieldsFromFormTemplate(formTemplate)
    );
    // possible fields, plus extra fields to be copied over from entities
    const concatEntityFields = new Set([
      ...possibleFields,
      ...additionalFields,
    ]);

    for (const key of Object.keys(sourceFieldData)) {
      if (
        shouldExcludeCopiedField(formTemplate.type, key, undefined, options)
      ) {
        delete sourceFieldData[key];
        continue;
      }

      // Only iterate through entities, not choice lists
      if (Array.isArray(sourceFieldData[key])) {
        // Drop entity arrays that don't exist in the target template.
        if (!concatEntityFields.has(key)) {
          delete sourceFieldData[key];
          continue;
        }

        // Closed-out entities are never copied, so drop them before doing the
        // work of pruning them. Nulls and [] left by older copies pass through
        // here and pruneEntityData discards them.
        const openEntities = (sourceFieldData[key] as ReportFieldData[]).filter(
          (entity) => !entity?.isInitiativeClosed
        );

        // Keep the key even if everything prunes away: downstream consumers
        // (e.g. SAR creation transformations) distinguish an empty entity
        // array from an absent key.
        sourceFieldData[key] = pruneEntityData(
          key,
          openEntities,
          concatEntityFields,
          formTemplate.type,
          options
        );
      } else if (!possibleFields.has(key)) {
        delete sourceFieldData[key];
      }
    }

    Object.assign(validatedFieldData, sourceFieldData);
  }

  return validatedFieldData;
}
