import { BrowserContext, Page } from "@playwright/test";
import { test, expect } from "../utils/fixtures/base";
import StateHomePage from "../utils/pageObjects/stateHome.page";
import { WPDashboardPage } from "../utils/pageObjects/wp/wpDashboard.page";
import AdminHomePage from "../utils/pageObjects/adminHome.page";

let userPage: Page;
let userContext: BrowserContext;
let adminPage: Page;
let adminContext: BrowserContext;
let homePage: StateHomePage;
let wpDashboard: WPDashboardPage;
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
});
