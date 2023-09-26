import { EntityShape, OverlayModalEntityTypes, AnyObject } from "types";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.[0].value;
};

const getQuarterValues = (entity: EntityShape | undefined, value: string) => {
  return entity?.[value];
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
        quarters: getQuarterValues(entity, "quarterlyProjections2023Q3"),
        additionalDetails: entity?.evaluationPlan_additionalDetails,
      };
    case OverlayModalEntityTypes.FUNDING_SOURCES:
      return {
        objectiveName: entity?.objectiveName,
        id: entity?.id,
        report_initiative: entity?.report_initiative,
        quarters: entity?.quarters,
      };
    default:
      return {};
  }
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
