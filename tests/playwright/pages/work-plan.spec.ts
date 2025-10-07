import { expect, test } from "../utils/fixtures/base";
import { archiveAllReportsForState } from "../utils/requests";
import {
  currentYear,
  requiredWorkPlanTopics,
  stateAbbreviation,
  testWorkPlan,
  wpTransitionBenchmarkTestData,
} from "../utils/consts";

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

  test("should be able to fill and submit a Work Plan @wp", async ({
    statePage,
  }) => {
    await statePage.workPlan.state.startNewWorkPlan(
      currentYear,
      testWorkPlan.reportingPeriod
    );
    await statePage.workPlan.state.editButton.click();
    await statePage.workPlan.state.continueButton.click();
    await statePage.transitionBenchmarks.completeTransitionBenchmarks(
      wpTransitionBenchmarkTestData
    );
    await statePage.transitionBenchmarkStrategy.completeTransitionBenchmarkStrategy(
      "test",
      "test"
    );
    await statePage.initiativesInstructions.completeInitiativesInstructions(
      false,
      false
    );
    await statePage.initiativesSpecific.addInititives(requiredWorkPlanTopics);
    await statePage.initiativesSpecific.clickEditInitiative(
      requiredWorkPlanTopics[0].name
    );
    await statePage.initiativesSpecific.editDefineInitiativeSection(
      "Test",
      ["Older adults"],
      "01/01/2024",
      false
    );
    await statePage.initiativesSpecific.editEvaluationPlanSection(
      "Test Objective",
      "Test Description",
      "Test Targets",
      false,
      "Test Additional Details"
    );
    // Edit funding sources section
    await statePage.initiativesSpecific.editPage.fundingSourcesEditButton.click();
    // End edit funding sources
  });
});
