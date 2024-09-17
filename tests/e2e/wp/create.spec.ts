import { archiveExistingWPs, logInStateUser } from "../utils";
import { test, expect } from "../utils/fixtures/base";

test.describe("Creating a new Work Plan", () => {
  test("State user can create a Work Plan", async ({
    page,
    stateHomePage,
    wpDashboard,
  }) => {
    await archiveExistingWPs(page);
    await logInStateUser(page);

    // View WPs
    await stateHomePage.wpButton.click();
    await wpDashboard.isReady();

    // check if work plans exist already or not
    if (await wpDashboard.createButton.isVisible()) {
      await wpDashboard.createButton.click();
      await expect(wpDashboard.modal).toBeVisible();
      await expect(wpDashboard.modal).toContainText("Add new MFP Work Plan");

      await wpDashboard.createNewWP();

      // Confirm created WP is in table
      await wpDashboard.getReports();
      await expect(wpDashboard.firstReport).toBeVisible();
      const editNewWPButton = wpDashboard.firstReport.getByRole("button", {
        name: "Edit",
        exact: true,
      });
      await expect(editNewWPButton).toBeVisible();
    } else {
      await wpDashboard.copyoverButton.click();
      await expect(wpDashboard.modal).toBeVisible();
      await expect(wpDashboard.modal).toContainText("Continue");
      await page
        .getByRole("button", { name: "Continue from previous period" })
        .click();

      // Confirm created WP is in table
      await wpDashboard.getReports();
      await expect(wpDashboard.copiedReport).toBeVisible();
      const editCopiedReportButton = wpDashboard.copiedReport.getByRole(
        "button",
        {
          name: "Edit",
          exact: true,
        }
      );
      await expect(editCopiedReportButton).toBeVisible();
    }
  });

  test("State user can fill and submit a Work Plan", async ({
    page,
    stateHomePage,
    wpDashboard,
    wpGeneralInformation,
    wpTransitionBenchmarksProjections,
    wpTransitionBenchmarkStrategy,
    wpInitiativesInstructions,
  }) => {
    await logInStateUser(page);
    await stateHomePage.wpButton.click();

    // Dashboard
    await wpDashboard.isReady();
    const editNewWPButton = wpDashboard.firstReport.getByRole("button", {
      name: "Edit",
      exact: true,
    });
    await editNewWPButton.click();

    // General Information
    await wpGeneralInformation.isReady();
    await expect(wpGeneralInformation.disclosure).toBeVisible();

    // Transition Benchmarks
    await wpGeneralInformation.continueButton.click();
    await wpTransitionBenchmarksProjections.isReady();

    const warnings = await wpTransitionBenchmarksProjections.page
      .getByRole("row", { name: "Select 'Edit' to report data." })
      .all();
    await wpTransitionBenchmarksProjections.editPopulations(warnings);

    await expect(warnings.length).toBe(0);

    // Transition Benchmark Strategy
    await wpTransitionBenchmarksProjections.continueButton.click();
    await wpTransitionBenchmarkStrategy.isReady();
    await wpTransitionBenchmarkStrategy.fillTextFields();

    // Initiatives Instructions
    await wpTransitionBenchmarkStrategy.continueButton.click();
    await wpInitiativesInstructions.isReady();
    await wpInitiativesInstructions.fillFormFields();
  });
});
