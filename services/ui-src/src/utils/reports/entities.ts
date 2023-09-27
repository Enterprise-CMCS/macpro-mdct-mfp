import { EntityShape, OverlayModalEntityTypes, AnyObject } from "types";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.[0].value !== "Other, specify"
    ? entity?.[label]?.[0].value
    : entity?.[label + "-otherText"];
};

const getRepeatedField = (
  entity: EntityShape | undefined,
  repeatedKey: string
) => {
  const quarters = [];
  if (entity) {
    // for loop that grabs key and value of the object.entries(entity)
    for (const [key, value] of Object.entries(entity)) {
      if (key.includes(repeatedKey)) {
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
    case OverlayModalEntityTypes.EVALUATION_PLAN:
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
    case OverlayModalEntityTypes.FUNDING_SOURCES:
      return {
        id: entity?.id,
        fundingSource: getRadioValue(entity, "initiative_wpTopic"),
        quarters: getRepeatedField(entity, "initiativeQuarters"),
      };
    default:
      return {};
  }
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
