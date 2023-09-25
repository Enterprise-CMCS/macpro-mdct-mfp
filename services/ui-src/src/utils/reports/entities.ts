import { EntityShape, OverlayModalEntityTypes, AnyObject } from "types";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label].value;
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
        // TODO: add this functionality after guidance from BOs (per Design)
        includesTargets: getRadioValue(
          entity,
          "evaluationPlan_includesTargets"
        ),
        additionalDetails: entity?.evaluationPlan_additionalDetails,
      };
    case OverlayModalEntityTypes.FUNDING_SOURCES:
      return {
        objectiveName: "{Funding Source}",
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
