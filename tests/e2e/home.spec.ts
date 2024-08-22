import { test, expect } from "./fixtures/base";
import { logInStateUser, logInAdminUser } from "./helpers";

test("Should see the correct home page as a state user", async ({
  page,
  stateHomePage,
}) => {
  await page.goto("/");
  await logInStateUser(page);
  await stateHomePage.isReady();
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
