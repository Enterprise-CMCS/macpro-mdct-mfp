import {
  mockStandardReportPageJson,
  mockTransitionBenchmarks,
} from "utils/testing/mockForm";
import { fillWorkPlanPage } from "./wp";
import { mockReportFieldData } from "utils/testing/mockReport";

describe("Test dev wp functions", () => {
  test("Test fillWorkPlanPage", () => {
    const newFieldData = fillWorkPlanPage(
      mockStandardReportPageJson,
      mockReportFieldData
    );
    console.log(newFieldData);
  });
  test("Test fillWorkPlanPage for transition benchmark", () => {
    const newFieldData = fillWorkPlanPage(
      mockTransitionBenchmarks as any,
      mockReportFieldData
    );
    console.log(newFieldData);
  });
  test("Test fillWorkPlanPage for initiative", () => {
    const newFieldData = fillWorkPlanPage(
      {
        name: "mock-init",
        path: "initiatives",
        overlayForm: { fields: [{}] },
        modalForm: { fields: [{}] },
      } as any,
      mockReportFieldData
    );
    console.log(newFieldData);
  });
});
