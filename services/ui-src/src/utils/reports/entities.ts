import { EntityShape, OverlayModalStepTypes, AnyObject } from "types";

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
        quarters.push({ id: `${id[0]} Q${id[1]}`, value: value });
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
    default:
      return {};
  }
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
