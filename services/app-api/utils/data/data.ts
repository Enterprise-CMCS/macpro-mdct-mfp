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
  const targetPopulations = fieldData?.targetPopulations;
  const initiatives = fieldData?.initiative;

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
  const notApplicablePopulations = targetPopulations.filter(
    (population: AnyObject) => {
      const isApplicable =
        population?.transitionBenchmarks_applicableToMfpDemonstration?.[0]
          ?.value;
      return isApplicable === "No";
    }
  );
  if (!notApplicablePopulations || notApplicablePopulations.length === 0)
    return fieldData;

  /*
   * Now knowing what target populations a user doesn't feel is applicable
   * to the MFP demonstration, we need to look through the initiatives
   * and remove it from the data
   */
  const cleanedInitiatives = initiatives.map((initiative: AnyObject) => {
    initiative.defineInitiative_targetPopulations =
      initiative?.defineInitiative_targetPopulations?.filter(
        (initiativePopulation: AnyObject) => {
          for (const population of notApplicablePopulations) {
            const populationName = population?.isRequired
              ? population?.transitionBenchmarks_targetPopulationName
              : `Other: ${population?.transitionBenchmarks_targetPopulationName}`;
            if (populationName == initiativePopulation?.value) {
              return false;
            }
          }
          return true;
        }
      );
    return initiative;
  });

  // Now set and return the cleaned up data!
  fieldData.initiative = cleanedInitiatives;
  return fieldData;
};
