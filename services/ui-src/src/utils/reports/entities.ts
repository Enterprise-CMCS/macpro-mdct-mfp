import { EntityShape, OverlayModalStepTypes, AnyObject } from "types";
import { convertToThousandsSeparatedString } from "utils";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  const radioLabelValue = entity?.[label]?.[0].value;
  return radioLabelValue !== "Other, specify"
    ? radioLabelValue
    : entity?.initiative_wp_otherTopic;
};

const getRepeatedField = (
  entity: EntityShape | undefined,
  repeatedKey: string
) => {
  const quarters = [];
  if (entity) {
    // for loop that grabs key and value of the object.entries(entity)
    for (const [key, value] of Object.entries(entity)) {
      if (key.includes(repeatedKey) && value) {
        const id = key.replace(repeatedKey, "").split("Q");
        quarters.push({
          id: `${id[0]} Q${id[1]}`,
          value: convertToThousandsSeparatedString(value).maskedValue,
        });
      }
    }
  }
  return quarters;
};

export const getFormattedEntityData = (
  entityType: string,
  entity?: EntityShape
) => {
  switch (entityType) {
    case OverlayModalStepTypes.EVALUATION_PLAN:
      return {
        objectiveName: entity?.evaluationPlan_objectiveName,
        description: entity?.evaluationPlan_description,
        targets: entity?.evaluationPlan_targets,
        includesTargets: getRadioValue(
          entity,
          "evaluationPlan_includesTargets"
        ),
        quarters: getRepeatedField(entity, "quarterlyProjections"),
        additionalDetails: entity?.evaluationPlan_additionalDetails,
      };
    case OverlayModalStepTypes.FUNDING_SOURCES:
      return {
        id: entity?.id,
        fundingSource: getRadioValue(entity, "fundingSources_wpTopic"),
        quarters: getRepeatedField(entity, "fundingSources_quarters"),
      };
    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
      return {
        objectiveName: entity?.objectiveProgress_objectiveName,
        description: entity?.objectiveProgress_description,
        targets: entity?.objectiveProgress_targets,
        quarterProjections: getRepeatedField(
          entity,
          "objectiveTargets_projections_"
        ),
        quarterActuals: getRepeatedField(entity, "objectiveTargets_actual_"),
        performanceMeasureProgress:
          entity?.objectivesProgress_performanceMeasuresIndicators,
        targetsMet: getRadioValue(entity, "objectivesProgress_deliverablesMet"),
        missedTargetReason:
          entity?.objectivesProgress_deliverablesMet_otherText,
        additionalDetails: entity?.evaluationPlan_additionalDetails,
      };
    default:
      return {};
  }
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
