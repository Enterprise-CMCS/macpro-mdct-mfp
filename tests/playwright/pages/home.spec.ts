import { test, expect } from "../utils/fixtures/base";
import BasePage from "../utils/pageObjects/base.page";

test.describe("state user home page", () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.home.goto();
    await statePage.home.isReady();
  });

  test("should render a visible work plan button and sar button", async ({
    statePage,
  }) => {
    await expect(statePage.home.state.workPlanButton).toBeVisible();
    await expect(statePage.home.state.sarButton).toBeVisible();
  });

  test("should be accessible across all device viewports", async ({
    statePage,
  }) => {
    await statePage.home.runA11yScan();
  });
});

test.describe("admin user home page", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.home.goto();
    await adminPage.home.isReady();
  });

  test("should render a visible state dropdown", async ({ adminPage }) => {
    await expect(adminPage.home.admin.stateDropdown).toBeVisible();
  });

  test("should be accessible across all device viewports", async ({
    adminPage,
  }) => {
    await adminPage.home.runA11yScan();
  });
});

test.describe("unauthenticated home page", () => {
  test("should be accessible across all device viewports", async ({
    browser,
  }) => {
    const userContext = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [],
      },
    });
    const page = await userContext.newPage();
    const homePage = new BasePage(page);
    await homePage.goto();
    await homePage.isReady();
    await homePage.runA11yScan();
    await userContext.close();
  });
});
