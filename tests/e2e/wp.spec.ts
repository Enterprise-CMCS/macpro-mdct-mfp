import { test, expect } from "./fixtures/base";
import { currentYear } from "../seeds/helpers";
import { archiveExistingWPs } from "./helpers";

test("State user can create a work plan", async ({
  page,
  loginPage,
  stateHomePage,
}) => {
  await archiveExistingWPs({ page });
  await loginPage.loginStateUser();
  await stateHomePage.isReady();

  await page.getByRole("button", { name: "Enter Work Plan online" }).click();

  expect(page).toHaveURL("/wp");
  page.waitForResponse("**/reports/WP/PR");

  const createButton = await page.getByRole("button", {
    name: "Start MFP Work Plan",
  });

  expect(createButton).toBeVisible();
  await createButton.click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Add new MFP Work Plan");

  await page.getByLabel(`${currentYear}`).click();
  await page.getByLabel(`First reporting period (January 1 - June 30)`).click();
  await page.getByRole("button", { name: "Start new" }).click();

  await expect(
    page.getByText(`Puerto Rico MFP Work Plan ${currentYear} - Period 1`)
  ).toBeVisible();
});

test("State user can fill out work plan", async ({
  page,
  loginPage,
  wpDashboardPage,
  wpGeneralInformationPage,
  wpTransitionBenchmarksPage,
  wpTransitionBenchmarkStrategyPage,
}) => {
  await archiveExistingWPs({ page });

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
});
