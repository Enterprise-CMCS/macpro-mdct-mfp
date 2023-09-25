import { EntityShape, OverlayModalEntityTypes, AnyObject } from "types";
import { nextTwelveQuartersKeys } from "utils";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.[0].value;
};

// returns an array of { planName: string, response: string } or undefined
export const getPlanValues = (entity?: EntityShape, plans?: AnyObject[]) =>
  plans?.map((plan: AnyObject) => ({
    name: plan.name,
    response: entity?.[`qualityMeasure_plan_measureResults_${plan.id}`],
  }));

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
        // TODO: add this functionality after guidance from BOs (per Design)
        includesTargets: getRadioValue(
          entity,
          "evaluationPlan_includesTargets"
        ),
        quarters: getRepeatedField(
          "twelveQuarters",
          "evaluationPlan_includesTargetQuarters",
          entity
        ),
        additionalDetails: entity?.evaluationPlan_additionalDetails,
      };
    case OverlayModalEntityTypes.FUNDING_SOURCES:
      return {};
    default:
      return {};
  }
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);

export const getRepeatedField = (
  rule: string,
  fieldName: string,
  entity: EntityShape | undefined
) => {
  switch (rule) {
    case "twelveQuarters":
      var keys = nextTwelveQuartersKeys(fieldName);
      var quarters = [];
      for (let key of keys) {
        const entityKey = `${key[0]}${key[1]}Q${key[2]}`;
        const displayKey = `${key[1]} Q${key[2]}`;
        quarters.push({ id: displayKey, value: entity?.[entityKey] });
      }
      return quarters;
    default:
      return null;
  }
};
