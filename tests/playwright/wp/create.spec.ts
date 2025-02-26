import { BrowserContext, Page } from "@playwright/test";
import { test, expect } from "../utils/fixtures/base";
import { WPInitiativeOverlayPage } from "../utils/pageObjects/wp/wpInitiativeOverlay.page";
import StateHomePage from "../utils/pageObjects/stateHome.page";
import { WPDashboardPage } from "../utils/pageObjects/wp/wpDashboard.page";
import { WPGeneralInformationPage } from "../utils/pageObjects/wp/wpGeneral.page";

import { WPInitiativesDashboardPage } from "../utils/pageObjects/wp/wpInitiativesDashboard.page";
import { WPReviewAndSubmitPage } from "../utils/pageObjects/wp/wpReviewAndSubmit.page";
import AdminHomePage from "../utils/pageObjects/adminHome.page";

import { stateAbbreviation } from "../utils/consts";

let userPage: Page;
let userContext: BrowserContext;
let adminPage: Page;
let adminContext: BrowserContext;
let homePage: StateHomePage;
let wpDashboard: WPDashboardPage;
let wpGeneralInformation: WPGeneralInformationPage;
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
    await adminHomePage.selectWP(stateAbbreviation);
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

    // Initiatives Dashboard
    await wpInitiativesDashboard.goto();
    await wpInitiativesDashboard.isReady();
    await wpInitiativesDashboard.addInitiative(
      wpInitiativesDashboard.requiredTopics[0]
    );

    const initiative = await wpInitiativesDashboard.page
      .getByRole("row", {
        name: "Edit",
      })
      .first();
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
  });
});
