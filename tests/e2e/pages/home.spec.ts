import { e2eA11y, logInAdminUser, logInStateUser } from "../utils";
import { test, expect } from "../utils/fixtures/base";

test("Should see the correct home page as a state user", async ({
  page,
  stateHomePage,
}) => {
  await page.goto("/");
  await logInStateUser(page);
  await stateHomePage.isReady();
  await expect(stateHomePage.wpButton).toBeVisible();
  await expect(stateHomePage.sarButton).toBeVisible();
});

test("Should see the correct home page as an admin user", async ({
  page,
  adminHomePage,
}) => {
  await page.goto("/");
  await logInAdminUser(page);
  await adminHomePage.isReady();
  await expect(adminHomePage.dropdown).toBeVisible();
});

test("Is accessible on all device types for state user", async ({ page }) => {
  await logInStateUser(page);
  await e2eA11y(page, "/");
});

test("Is accessible on all device types for admin user", async ({ page }) => {
  await logInAdminUser(page);
  await e2eA11y(page, "/");
});

test("Is assessible when not logged in", async ({ page }) => {
  await e2eA11y(page, "/");
});
