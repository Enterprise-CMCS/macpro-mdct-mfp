import { AnyObject } from "../types";

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
            if (
              population?.transitionBenchmarks_targetPopulationName ==
              initiativePopulation?.value
            ) {
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
