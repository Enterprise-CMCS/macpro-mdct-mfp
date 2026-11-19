import { AnyObject, ReportRoute } from "types";
import { fillField, getAnswerFromField } from "./reports";

const checkboxTargetPopulation = (fieldData: AnyObject) => {
  return fieldData["targetPopulations"].map(
    (field: {
      id: string;
      transitionBenchmarks_targetPopulationName: string;
    }) => ({
      key: `targetPopulations-${field.id}`,
      value: field.transitionBenchmarks_targetPopulationName,
    })
  );
};

export const fillWorkPlanPage = (
  template: ReportRoute,
  fieldData: AnyObject
) => {
  const page = template.path.split("/").at(-1);
  switch (page) {
    case "transition-benchmarks":
      if ("drawerForm" in template) {
        const fieldId = template.drawerForm?.fields[0].id as string;
        const choiceId = template.drawerForm?.fields[0].props?.choices[1]?.id;
        const choiceChildren = template.drawerForm?.fields[0].props?.choices[1]
          .children as [];
        const projections = Object.fromEntries(
          choiceChildren?.map((child: { id: string }, index) => [
            child.id,
            (index + 1).toString(),
          ])
        );
        const checkbox = {
          ...projections,
          [fieldId]: [
            {
              key: `${fieldId}-${choiceId}`,
              value: "Yes",
            },
          ],
        };
        return {
          ["targetPopulations"]: fieldData["targetPopulations"].map(
            (target: any) => ({ ...target, ...checkbox })
          ),
        };
      }
      break;
    case "initiatives":
      const overlayFields =
        "overlayForm" in template ? fillField(template.overlayForm.fields) : {};

      if ("modalForm" in template) {
        const topicKey = "initiative_wpTopic";
        const topics = template.modalForm?.fields.find(
          (field) => field.id === topicKey
        );
        if (topics && topics.props) {
          const requiredTopics = (
            topics.props.choices as { id: string; label: string }[]
          )
            .filter((choice) => choice.label.includes("*"))
            .map((topic) => ({
              key: `${topicKey}-${topic.id}`,
              value: topic.label,
            }));
          const filledTopic = requiredTopics.map((topic) => ({
            id: crypto.randomUUID(),
            initiative_name: topic.value,
            initiative_wpTopic: [topic],
            type: "initiative",
            ...overlayFields,
            defineInitiative_expectedStartDate_value: "02/02/2022",
            defineInitiative_targetPopulations:
              checkboxTargetPopulation(fieldData),
          }));
          return {
            ["initiative"]: [
              ...(fieldData?.["initiative"] ?? []),
              ...filledTopic,
            ],
          };
        }
      }
      break;
    default:
      {
        if ("form" in template) {
          const entries =
            template.form?.fields.map((field) => [
              field.id,
              getAnswerFromField(field),
            ]) ?? [];
          const newFields = Object.fromEntries(entries);
          return { ...fieldData, ...newFields };
        }
      }
      return fieldData;
  }
};
