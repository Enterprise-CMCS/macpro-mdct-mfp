import { mockTargetPopulationsReportPageJson } from "utils/testing/mockForm";
import { fillWorkPlanPage } from "./wp";
import { mockReportFieldData } from "utils/testing/mockReport";

describe("Test dev wp functions", () => {
  test("Test fillWorkPlanPage", () => {
    const newFieldData = fillWorkPlanPage(
      mockTargetPopulationsReportPageJson,
      mockReportFieldData
    );
    console.log(newFieldData);
  });
});
