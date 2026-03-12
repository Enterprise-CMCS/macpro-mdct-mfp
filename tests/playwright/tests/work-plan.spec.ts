import { expect, test } from "./fixtures/base";
import {
  archiveAllReportsForState,
  hasActiveReportsWithSars,
  postReport,
  submitReport,
  updateReport,
} from "../utils/requests";
import {
  currentYear,
  fillWorkPlanTestData,
  reportType,
  stateAbbreviation,
  stateName,
  testWorkPlan,
} from "../utils/consts";
import { fillWorkPlan, newWorkPlan } from "../../seeds/fixtures/work-plan";

test.describe("Work Plan Page", () => {
  test.beforeAll(async () => {
    const hasActiveSarReports =
      await hasActiveReportsWithSars(stateAbbreviation);

    if (hasActiveSarReports) {
      test.skip(
        true,
        "Skipping Work Plan tests: Active reports with associated SARs found that cannot be archived"
      );
    }
  });

  test.beforeEach(async ({ statePage }) => {
    await archiveAllReportsForState(stateAbbreviation);
    await statePage.navigateToWorkPlanDashboard();
  });

  test.describe("State User", () => {
    test("should be able to start a new Work Plan", async ({ statePage }) => {
      await statePage.startNewWorkPlan(
        currentYear,
        testWorkPlan.reportingPeriod
      );
      await expect(statePage.wpDataRows).toBeVisible();
      await expect(statePage.wpDataRows).toContainText(currentYear.toString());
      await expect(statePage.wpDataRows).toContainText(testWorkPlan.expName);
      await expect(statePage.wpDataRows).toContainText(testWorkPlan.expStatus);
    });

    test("should be able to fill and submit a Work Plan @flaky", async ({
      statePage,
    }) => {
      const wpReport = newWorkPlan({}, stateName, currentYear, 1);
      await postReport(wpReport, stateAbbreviation);
      await statePage.page.reload();
      await statePage.fillWorkPlan(fillWorkPlanTestData);
      await statePage.submitWorkPlan();
      await expect(
        statePage.page.getByRole("heading", { name: "Successfully Submitted" })
      ).toBeVisible();
    });
  });

  test.describe("Admin User", () => {
    test("should be able to deny a Work Plan by unlocking it @flaky", async ({
      adminPage,
    }) => {
      const wpReport = newWorkPlan({}, stateName, currentYear, 1);
      const reportId = await postReport(wpReport, stateAbbreviation);
      const updatedData = fillWorkPlan({}, currentYear, 1);
      await updateReport(reportId, updatedData, reportType, stateAbbreviation);
      await submitReport(reportId, reportType, stateAbbreviation);
      await adminPage.page.goto("/");
      await adminPage.goToReportDashboard(stateName, "MFP Work Plan");
      await adminPage.unlockFirstSubmittedReport();
      await expect(
        adminPage.page.getByRole("heading", {
          name: "You unlocked this Work Plan",
        })
      ).toBeVisible();
    });
  });
});
