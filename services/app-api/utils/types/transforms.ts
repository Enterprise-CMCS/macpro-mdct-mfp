import { Choice } from "./formFields";

/** This type is intended to be used exclusively in the form template transforms */
export type WorkPlanFieldDataForTransforms = {
  targetPopulations?: TargetPopulation[];
  initiative?: {
    id: string;
    initiative_name: string;
    initiative_wpTopic: Choice[];
    fundingSources: {
      id: string;
      fundingSources_wpTopic: Choice[];
    }[];
    evaluationPlan: any;
  }[];
};

/** This type is intended to be used exclusively in the form template transforms */
export type TargetPopulation = {
  transitionBenchmarks_applicableToMfpDemonstration: Choice[];
  transitionBenchmarks_targetPopulationName: string;
  isRequired?: boolean;
};

/** This type is intended to be used exclusively in the form template transforms */
export type Initiative = {
  id: string;
  initiative_name: string;
  initiative_wpTopic: Choice[];
  fundingSources: FundingSource[];
};

export type FundingSource = {
  id: string;
  fundingSources_wpTopic: Choice[];
  initiative_wp_otherTopic?: string;
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

  /*
   * In real life a work plan will always have targetPopulations.
   * We allow it to be optional here for ease of testing.
   * It is checked for nullishness before running the related transformation.
   */
  if (workPlanFieldData.targetPopulations !== undefined) {
    const populations = workPlanFieldData.targetPopulations;
    if (!Array.isArray(populations)) return false;
    if (!populations.every(isTargetPopulation)) return false;
  }

  // As with populations, this is optional only for east of testing.
  if (workPlanFieldData.initiative !== undefined) {
    const initiatives = workPlanFieldData.initiative;
    if (!Array.isArray(initiatives)) return false;
    if (!initiatives.every(isInitiative)) return false;
  }

  return true;
};

const isTargetPopulation = (pop: any): pop is TargetPopulation => {
  if (typeof pop !== "object") return false;
  if (pop.isRequired !== undefined && typeof pop.isRequired !== "boolean")
    return false;
  if (typeof pop.transitionBenchmarks_targetPopulationName !== "string")
    return false;
  if (!isChoiceArray(pop.transitionBenchmarks_applicableToMfpDemonstration))
    return false;
  if (pop.transitionBenchmarks_applicableToMfpDemonstration.length !== 1)
    return false;
  return true;
};

const isInitiative = (initiative: any): initiative is Initiative => {
  if (typeof initiative !== "object") return false;
  if (typeof initiative.id !== "string") return false;
  if (typeof initiative.initiative_name !== "string") return false;
  if (!isChoiceArray(initiative.initiative_wpTopic)) return false;
  if (!Array.isArray(initiative.fundingSources)) return false;
  if (!initiative.fundingSources.every(isFundingSource)) return false;
  for (let fundingSource of initiative.fundingSources) {
    if (!isChoiceArray(fundingSource.fundingSources_wpTopic)) return false;
  }
  return true;
};

const isFundingSource = (
  fundingSource: any
): fundingSource is FundingSource => {
  if (typeof fundingSource !== "object") return false;
  if (typeof fundingSource.id !== "string") return false;
  if (!isChoiceArray(fundingSource.fundingSources_wpTopic)) return false;
  if (
    fundingSource.initiative_wp_otherTopic !== undefined &&
    typeof fundingSource.initiative_wp_otherTopic !== "string"
  )
    return false;
  return true;
};

const isChoiceArray = (choices: any): choices is Choice[] => {
  if (!Array.isArray(choices)) return false;
  for (let choice of choices) {
    if (typeof choice.key !== "string") return false;
    if (typeof choice.value !== "string") return false;
  }
  return true;
};
