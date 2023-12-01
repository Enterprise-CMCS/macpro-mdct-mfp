import { AnyObject } from "../types";

/**
 * This function goes through the fieldData and looks to see if there are target populations
 * attached to any initiatives and removes those target populations from them if the user
 * has marked it as not applicable
 * @param {AnyObject} fieldData - The fieldData of the Form
 * @return {AnyObject} Returns fieldData, with the possible removal of target populations from initiatives
 */
export const removeNotApplicablePopsFromInitiatives = (
  fieldData: AnyObject
) => {
  // Gather the data we need
  const targetPopulations = fieldData.targetPopulations;
  const initiatives = fieldData.initiative;

  /*
   * If we can't find any data on targetPopulations or initiatives, we don't
   * need to do anything
   */
  if (!targetPopulations || !initiatives) return fieldData;

  /*
   * Find any targetPopulations that user has answered "No" to when asked
   * if this is applicable to the MFP demonstration. If none are found,
   * we don't need to do anything
   */
  const isNotApplicable = (population: AnyObject) => population
    .transitionBenchmarks_applicableToMfpDemonstration?.[0]?.value === "No";

  const getPopulationName = (population: AnyObject) => population.isRequired
    ? population.transitionBenchmarks_targetPopulationName
    : `Other: ${population.transitionBenchmarks_targetPopulationName}`;

  const notApplicablePopulationNames = targetPopulations
    .filter(isNotApplicable)
    .map(getPopulationName);

  if (notApplicablePopulationNames.length === 0) return fieldData;

  /*
   * Now knowing what target populations a user doesn't feel is applicable
   * to the MFP demonstration, we need to look through the initiatives
   * and remove it from the data
   */
  for (let initiative of initiatives) {
    initiative.defineInitiative_targetPopulations =
      initiative.defineInitiative_targetPopulations?.filter(
        (initiativePopulation: AnyObject) => 
          !notApplicablePopulationNames.includes(initiativePopulation.value)
      );
  }

  // Now set and return the cleaned up data!
  return fieldData;
};
