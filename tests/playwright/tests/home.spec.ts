import { test, expect } from "./fixtures/base";
import { checkAccessbilityAcrossViewports } from "../utils/a11y";

test.describe("state user home page", () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.page.goto("/");
  });

  test("should render a visible work plan and sar buttons", async ({
    statePage,
  }) => {
    await expect(
      statePage.page.getByRole("button", { name: "Enter Work Plan online" })
    ).toBeVisible();
    await expect(
      statePage.page.getByRole("button", { name: "Enter SAR online" })
    ).toBeVisible();
  });

  test("should be accessible across all device viewports", async ({
    statePage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      statePage.page,
      "/"
    );
    expect(accessibilityErrors).toEqual([]);
  });
});

test.describe("admin user home page", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.page.goto("/");
  });

  test("should render a visible state dropdown", async ({ adminPage }) => {
    await expect(adminPage.page.locator('select[name="state"]')).toBeVisible();
  });

  test("should be accessible across all device viewports", async ({
    adminPage,
  }) => {
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      adminPage.page,
      "/"
    );
    expect(accessibilityErrors).toEqual([]);
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
    const accessibilityErrors = await checkAccessbilityAcrossViewports(
      page,
      "/"
    );
    expect(accessibilityErrors).toEqual([]);
    await page.close();
    await userContext.close();
  });
});
