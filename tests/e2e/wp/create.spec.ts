import { BrowserContext, Page } from "@playwright/test";
import { test, expect } from "../utils/fixtures/base";
import { WPInitiativeOverlayPage } from "../utils/pageObjects/wp/wpInitiativeOverlay.page";
import StateHomePage from "../utils/pageObjects/stateHome.page";
import { WPDashboardPage } from "../utils/pageObjects/wp/wpDashboard.page";
import { WPGeneralInformationPage } from "../utils/pageObjects/wp/wpGeneral.page";
import { WPTransitionBenchmarkProjectionsPage } from "../utils/pageObjects/wp/wpTransitionBenchmarkProjections.page";
import { WPTransitionBenchmarkStrategyPage } from "../utils/pageObjects/wp/wpTransitionBenchmarkStrategy.page";
import { WPInitiativesInstructionsPage } from "../utils/pageObjects/wp/wpInitiativesInstructions.page";
import { WPInitiativesDashboardPage } from "../utils/pageObjects/wp/wpInitiativesDashboard.page";
import { WPReviewAndSubmitPage } from "../utils/pageObjects/wp/wpReviewAndSubmit.page";
import AdminHomePage from "../utils/pageObjects/adminHome.page";

let userPage: Page;
let userContext: BrowserContext;
let adminPage: Page;
let adminContext: BrowserContext;
let homePage: StateHomePage;
let wpDashboard: WPDashboardPage;
let wpGeneralInformation: WPGeneralInformationPage;
let wpTransitionBenchmarkProjections: WPTransitionBenchmarkProjectionsPage;
let wpTransitionBenchmarkStrategy: WPTransitionBenchmarkStrategyPage;
let wpInitiativesInstructions: WPInitiativesInstructionsPage;
let wpInitiativesDashboard: WPInitiativesDashboardPage;
let wpReviewAndSubmit: WPReviewAndSubmitPage;
let adminHomePage: AdminHomePage;
let adminWpDashboard: WPDashboardPage;

test.beforeAll(async ({ browser }) => {
  userContext = await browser.newContext({
    storageState: "playwright/.auth/user.json",
  });
  adminContext = await browser.newContext({
    storageState: "playwright/.auth/admin.json",
  });
  userPage = await userContext.newPage();
  adminPage = await adminContext.newPage();

  homePage = new StateHomePage(userPage);
  wpDashboard = new WPDashboardPage(userPage);
  wpGeneralInformation = new WPGeneralInformationPage(userPage);
  wpTransitionBenchmarkProjections = new WPTransitionBenchmarkProjectionsPage(
    userPage
  );
  wpTransitionBenchmarkStrategy = new WPTransitionBenchmarkStrategyPage(
    userPage
  );
  wpInitiativesInstructions = new WPInitiativesInstructionsPage(userPage);
  wpInitiativesDashboard = new WPInitiativesDashboardPage(userPage);
  wpReviewAndSubmit = new WPReviewAndSubmitPage(userPage);
  adminHomePage = new AdminHomePage(adminPage);
  adminWpDashboard = new WPDashboardPage(adminPage);
});

test.afterAll(async () => {
  await userContext.close();
});

test.describe("Creating a new Work Plan", () => {
  test("State user can create a Work Plan", async () => {
    await adminHomePage.goto();
    await adminHomePage.selectWP("PR");
    await adminWpDashboard.reportsReady();
    await adminWpDashboard.archiveAllReports();

    // View WPs
    await homePage.goto();
    await homePage.wpButton.click();
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
      await wpDashboard.page
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

  test("State user can fill and submit a Work Plan", async () => {
    await homePage.goto();
    await homePage.wpButton.click();

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
    await wpTransitionBenchmarkProjections.isReady();
    await wpTransitionBenchmarkProjections.editPopulations();

    // Transition Benchmark Strategy
    await wpTransitionBenchmarkProjections.continueButton.click();
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
      const overlayPage = new WPInitiativeOverlayPage(userPage);
      await overlayPage.isReady();

      await overlayPage.completeDefineInitiative(userPage);
      await overlayPage.completeEvaluationPlan(userPage);
      await overlayPage.completeFundingSources(userPage);
      await overlayPage.isReady();
      const errorIcons = await wpReviewAndSubmit.page
        .getByAltText("warning icon")
        .all();
      await expect(errorIcons.length).toBe(0);

      await overlayPage.backButton.click();
    }

    await wpInitiativesDashboard.isReady();

    // Review and Submit
    await wpInitiativesDashboard.continueButton.click();
    await wpReviewAndSubmit.isReady();
    const errorIcons = await wpReviewAndSubmit.page
      .getByAltText("Error notification")
      .all();
    await expect(errorIcons.length).toBe(0);

    await wpReviewAndSubmit.submitButton.click();
    await wpReviewAndSubmit.confirmSubmit();

    // Confirmation
    await wpReviewAndSubmit.isReady();
    await expect(
      wpReviewAndSubmit.page.getByRole("heading", {
        name: "Successfully Submitted",
      })
    ).toBeVisible();

    await wpDashboard.goto();
  });

  test("Admin user can deny a work plan", async () => {
    await adminWpDashboard.goto();
    await adminWpDashboard.isReady();
    const unlockButton = adminWpDashboard.page
      .getByRole("button", { name: "Unlock" })
      .first();
    await unlockButton.isVisible();
    await unlockButton.click();
    const modal = adminWpDashboard.page.getByRole("dialog");
    await modal
      .getByRole("heading", { name: "You unlocked this Work Plan" })
      .isVisible();
    await modal.getByRole("button", { name: "Return to dashboard" }).click();
    await expect(unlockButton).toBeDisabled();
  });

  test("State user can resubmit a work plan", async () => {
    await wpDashboard.goto();
    await wpDashboard.isReady();
    await wpDashboard.firstReport.isVisible();
    await wpDashboard.firstReport.getByRole("button", { name: "Edit" }).click();
    await wpGeneralInformation.isReady();
    await wpReviewAndSubmit.goto();
    await expect(wpReviewAndSubmit.submitButton).toBeEnabled();
    await wpReviewAndSubmit.submitButton.click();
    await wpReviewAndSubmit.confirmSubmit();
    await adminWpDashboard.goto();

    await expect(
      adminWpDashboard.firstReport.getByTestId("dashboard-submission-count")
    ).toContainText("2");
  });
});
