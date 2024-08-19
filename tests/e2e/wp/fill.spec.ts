import { test, expect } from "../fixtures/base";
import { archiveExistingWPs } from "../helpers";

test("State user can fill out work plan", async ({
  page,
  loginPage,
  wpDashboardPage,
  wpGeneralInformationPage,
  wpTransitionBenchmarksPage,
  wpTransitionBenchmarkStrategyPage,
  wpInitiativesInstructionsPage,
  wpInitiativesDashboardPage,
  wpInitiativeOverlayPage,
}) => {
  await archiveExistingWPs(page);

  await loginPage.goto();
  await loginPage.loginStateUser();
  // Timeout to allow API to finish starting up before seeding
  await page.waitForTimeout(3000);
  await wpDashboardPage.createWorkPlanPeriod1();
  await wpDashboardPage.goto();
  await wpDashboardPage.isReady();

  await page.getByRole("button", { name: "Edit" }).click();

  // General Information
  await expect(page).toHaveURL(wpGeneralInformationPage.path);
  await wpGeneralInformationPage.continue();

  // Transition Benchmarks
  await expect(page).toHaveURL(wpTransitionBenchmarksPage.path);
  const buttons = await wpTransitionBenchmarksPage.getEditButtons();

  for (const editButton of buttons) {
    await editButton.click();
    const overlay = wpTransitionBenchmarksPage.page.getByRole("dialog");
    await expect(overlay).toBeVisible();

    // Fill out quarterly targets for the first population
    if (buttons.indexOf(editButton) === 0) {
      await overlay.locator("//input[@value='Yes']").check();
      const inputs = await overlay.locator("input[type='text']");
      await expect(inputs.first()).toBeVisible();
      await wpTransitionBenchmarksPage.fillPopulationApplicable(inputs);
    } else {
      await overlay.locator("//input[@value='No']").check();
      await wpTransitionBenchmarksPage.saveAndClose.click();
    }
  }

  await wpTransitionBenchmarksPage.continue();

  // Transition Benchmark Strategy
  await expect(page).toHaveURL(wpTransitionBenchmarkStrategyPage.path);
  await wpTransitionBenchmarkStrategyPage.fillForm();
  await wpTransitionBenchmarkStrategyPage.continue();

  // State or Territory Initiatives Instructions
  await expect(page).toHaveURL(wpInitiativesInstructionsPage.path);
  await wpInitiativesInstructionsPage.checkSelfDirectedInitiativesNo();
  await wpInitiativesInstructionsPage.checkTribalInitiativesNo();
  await wpInitiativesInstructionsPage.continue();

  // State or Territory Initiatives Dashboard
  await expect(page).toHaveURL(wpInitiativesDashboardPage.path);
  await expect(
    wpInitiativesDashboardPage.page.getByRole("alert")
  ).toBeVisible();

  for (const topic of wpInitiativesDashboardPage.requiredTopics) {
    await wpInitiativesDashboardPage.addTopic(topic);
  }

  await expect(
    wpInitiativesDashboardPage.page.getByRole("alert")
  ).not.toBeVisible();

  /*
   * Initiative Overlays:
   * Define Initiative, Evaluation Plan, Funding Sources, Initiative Close-out
   */
  for (const topic of wpInitiativesDashboardPage.requiredTopics) {
    await wpInitiativesDashboardPage.editTopic(topic);
    await wpInitiativeOverlayPage.fillDefineInitiative();
    await wpInitiativeOverlayPage.fillEvaluationPlan();
    await wpInitiativeOverlayPage.fillFundingSources();
    await wpInitiativeOverlayPage.returnButton.click();
  }
});
