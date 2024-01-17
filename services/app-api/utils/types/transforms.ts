import { Choice } from "./formFields";

/** This type is intended to be used exclusively in the form template transforms */
export type WorkPlanFieldDataForTransforms = {
  targetPopulations?: TargetPopulation[];
  initiative?: {
    id: string;
    initiative_name: string;
    initiative_wpTopic: Choice[];
    fundingSources: {
      fundingSources_wpTopic: Choice[];
    }[];
    evaluationPlan: any;
  }[];
};

/** This type is intended to be used exclusively in the form template transforms */
export type TargetPopulation = {
  transitionBenchmarks_applicableToMfpDemonstration: Choice[];
  transitionBenchmarks_targetPopulationName: string;
  isRequired: boolean;
};

export const isUsableForTransforms = (
  workPlanFieldData?: any
): workPlanFieldData is WorkPlanFieldDataForTransforms | undefined => {
  /*
   * If we are running a WP transformation,
   * we don't expect to have any WP field data at hand.
   * None of the WP transforms expect field data,
   * so leaving this undefined is perfectly fine.
   */
  if (workPlanFieldData === undefined) {
    return true;
  }

  const isChoiceArray = (choices: any): choices is Choice[] => {
    if (!Array.isArray(choices)) return false;
    for (let choice of choices) {
      if (typeof choice.key !== "string") return false;
      if (typeof choice.value !== "string") return false;
    }
    return true;
  };

  /*
   * In real life a work plan will always have targetPopulations.
   * We allow it to be optional here for ease of testing.
   * It is checked for nullishness before running the related transformation.
   */
  if (workPlanFieldData.targetPopulations !== undefined) {
    const populations = workPlanFieldData.targetPopulations;
    if (!Array.isArray(populations)) return false;
    for (let population of populations) {
      if (typeof population !== "object") return false;
      if (typeof population.isRequired !== "boolean") return false;
      if (
        typeof population.transitionBenchmarks_targetPopulationName !== "string"
      )
        return false;
      if (
        !isChoiceArray(
          population.transitionBenchmarks_applicableToMfpDemonstration
        )
      )
        return false;
      if (
        population.transitionBenchmarks_applicableToMfpDemonstration.length !==
        1
      )
        return false;
    }
  }

  // As with populations, this is optional only for east of testing.
  if (workPlanFieldData.initiative !== undefined) {
    const initiatives = workPlanFieldData.initiative;
    if (!Array.isArray(initiatives)) return false;
    for (let initiative of initiatives) {
      if (typeof initiative.id !== "string") return false;
      if (typeof initiative.initiative_name !== "string") return false;
      if (!isChoiceArray(initiative.initiative_wpTopic)) return false;
      if (!Array.isArray(initiative.fundingSources)) return false;
      for (let fundingSource of initiative.fundingSources) {
        if (!isChoiceArray(fundingSource.fundingSources_wpTopic)) return false;
      }
    }
  }

  return true;
};
