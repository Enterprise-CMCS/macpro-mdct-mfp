import { AnyObject } from "types";

// pass in field data to this function
// check if ID exists
// match up with section in table -- logic for this???
// if doesn't exist -- check with Anna
export const outputTotals = (formData: AnyObject | undefined) => {
  if (!formData) return;

  if ("qualifiedHcbs_statePlanServices-totalComputable" in formData)
    console.log("hello this exists");
  /**
   * list of ids:
   * ---
   * qualifiedHcbs_statePlanServices-totalComputable
   * qualifiedHcbs_statePlanServices-totalFederalShare
   * qualifiedHcbs_statePlanServices-totalStateTerritoryShare
   * ---
   * qualifiedHcbs_1915cWaiverServices-totalComputable
   * qualifiedHcbs_1915cWaiverServices-totalFederalShare
   * qualifiedHcbs_1915cWaiverServices-totalStateTerritoryShare
   * ---
   * demonstrationServices_statePlanServices-totalComputable
   * demonstrationServices_statePlanServices-totalFederalShare
   * demonstrationServices_statePlanServices-totalStateTerritoryShare
   * ---
   * demonstrationServices_1915cWaiverServices-totalComputable
   * demonstrationServices_1915cWaiverServices-totalFederalShare
   * demonstrationServices_1915cWaiverServices-totalStateTerritoryShare
   * ---
   * supplementalServices_category-totalComputable
   * supplementalServices_category-totalFederalShare
   * supplementalServices_category-totalStateTerritoryShare
   * ---
   * totals 1
   * ---
   * administrativeCosts_budgetCategory-totalComputable
   * administrativeCosts_budgetCategory-totalFederalShare
   * administrativeCosts_budgetCategory-totalStateTerritoryShare
   * ---
   * ????
   * ---
   * totals 2
   * ---
   *
   *
   *
   *
   *
   *
   *
   *
   */
};
