import { expect, test } from "../utils/fixtures/base";
import { archiveAllReportsForState } from "../utils/requests";
import { currentYear, stateAbbreviation, testWorkPlan } from "../utils/consts";

test.describe("State User", () => {
  test.beforeEach(async ({ statePage }) => {
    await archiveAllReportsForState(stateAbbreviation);
    await statePage.home.goto();
    await statePage.home.state.goToWPDashboard();
  });

  test("should be able to start a new Work Plan @wp", async ({ statePage }) => {
    await statePage.workPlan.state.startNewWorkPlan(
      currentYear,
      testWorkPlan.reportingPeriod
    );
    await expect(statePage.workPlan.wpDataRows).toBeVisible({ timeout: 10000 });
    await expect(statePage.workPlan.wpDataRows).toContainText(
      currentYear.toString()
    );
    await expect(statePage.workPlan.wpDataRows).toContainText(
      testWorkPlan.expName
    );
    await expect(statePage.workPlan.wpDataRows).toContainText(
      testWorkPlan.expStatus
    );
  });
});
