import {
  EntityShape,
  OverlayModalStepTypes,
  AnyObject,
  FormField,
  FormLayoutElement,
  ReportShape,
  ReportType,
} from "types";

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

// rendering dynamic target population fields on the form
export const renderTargetPopulationFields = (
  report: ReportShape | undefined,
  fields: (FormField | FormLayoutElement)[]
) => {
  const updatedTargetPopulations =
    report?.reportType === ReportType.SAR
      ? report?.fieldData?.workPlanData.targetPopulations
      : report?.fieldData?.targetPopulations;

  // handle the case of SAR RE&T section
  if (
    report?.reportType === ReportType.SAR &&
    updatedTargetPopulations.length > 4
  ) {
    // if there are "other" target populations, append them to the fields to render
    const retTextFields = updatedTargetPopulations?.map(
      (field: EntityShape) => {
        // append the other populations
        const fieldDisplayValue =
          field.transitionBenchmarks_targetPopulationName.match(/\(([^()]*)\)/)
            ? field.transitionBenchmarks_targetPopulationName.match(
                /\(([^()]*)\)/
              )[1]
            : field.transitionBenchmarks_targetPopulationName;

        return {
          id: field.id,
          type: "number",
          validation: "number",
          props: {
            label: field.isRequired
              ? `Number of ${fieldDisplayValue}`
              : `Other: ${fieldDisplayValue}`,
            name: field.transitionBenchmarks_targetPopulationName,
            value: "",
          },
        };
      }
    );
    return retTextFields;
  }

  // choice lists with target populations
  const formatChoiceList = updatedTargetPopulations?.map(
    (field: EntityShape) => {
      return {
        checked: false,
        id: field.id,
        label: field.isRequired
          ? field.transitionBenchmarks_targetPopulationName
          : `Other: ${field.transitionBenchmarks_targetPopulationName}`,
        name: field.transitionBenchmarks_targetPopulationName,
        value: field.transitionBenchmarks_targetPopulationName,
      };
    }
  );

  const updateTargetPopulationChoiceList = fields.map((field) => {
    return field.id.match("targetPopulations")
      ? {
          ...field,
          props: { ...field?.props, choices: [...formatChoiceList] },
        }
      : { ...field };
  });

  return updateTargetPopulationChoiceList;
};
