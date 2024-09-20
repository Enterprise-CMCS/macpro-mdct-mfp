import { archiveExistingWPs, logInStateUser } from "../utils";
import { test, expect } from "../utils/fixtures/base";
import { WPInitiativeOverlayPage } from "../utils/pageObjects/wp/wpInitiativeOverlay.page";

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
    wpInitiativesDashboard,
    wpReviewAndSubmit,
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

    // only edit the benchmarks that are incomplete (with warnings)
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

    // Initiatives Dashboard
    await wpInitiativesInstructions.continueButton.click();
    await wpInitiativesDashboard.isReady();

    if (await wpInitiativesDashboard.alert.isVisible()) {
      for (const topic of wpInitiativesDashboard.requiredTopics) {
        await wpInitiativesDashboard.addInitiative(topic);
      }
    }

    await expect(wpInitiativesDashboard.alert).not.toBeVisible();

    // Initiatives Overlays
    const initiatives = await wpInitiativesDashboard.page
      .getByRole("row", {
        name: "Edit",
      })
      .all();

    for (const initiative of initiatives) {
      await initiative.getByRole("button", { name: "edit button" }).click();
      const overlayPage = new WPInitiativeOverlayPage(page);
      await overlayPage.isReady();

      await overlayPage.completeDefineInitiative();
      await overlayPage.completeEvaluationPlan();
      await overlayPage.completeFundingSources();
      await overlayPage.backButton.click();
    }

    // Review and Submit
    await wpInitiativesDashboard.continueButton.click();
    await wpReviewAndSubmit.isReady();
    const errorIcons = await wpReviewAndSubmit.page
      .getByAltText("Error notification")
      .all();
    await expect(errorIcons.length).toBe(0);
  });
});
