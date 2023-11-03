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

// rendering dynamic Target Population fields on the WP and SAR forms
export const renderTargetPopulationFields = (
  report: ReportShape | undefined,
  fields: (FormField | FormLayoutElement)[],
  location: AnyObject
) => {
  const updatedTargetPopulations =
    report?.reportType === ReportType.SAR
      ? report?.fieldData?.workPlanData.targetPopulations
      : report?.fieldData?.targetPopulations;

  // choice lists with target populations
  const formattedFields = updatedTargetPopulations?.map(
    (field: EntityShape) => {
      if (report?.reportType === ReportType.SAR) {
        const fieldDisplayValue =
          field.transitionBenchmarks_targetPopulationName.match(/\(([^()]*)\)/)
            ? field.transitionBenchmarks_targetPopulationName.match(
                /\(([^()]*)\)/
              )[1]
            : field.transitionBenchmarks_targetPopulationName;

        // number fields (RE&T sections)
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

      // choice list fields (Work Plan sections)
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

  // only return target population text fields when rendering RE&T forms
  if (location.pathname.startsWith("/sar/recruitment-enrollment-transitions")) {
    return formattedFields;
  }

  const updatedTargetPopulationChoiceList = fields.map((field) => {
    return field.id.match("targetPopulations")
      ? {
          ...field,
          props: { ...field?.props, choices: [...formattedFields] },
        }
      : { ...field };
  });

  return updatedTargetPopulationChoiceList;
};
