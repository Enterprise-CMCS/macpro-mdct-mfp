import { test } from "./fixtures/base";

test("Should see the correct home page as a state user", async ({
  loginPage,
  stateHomePage,
}) => {
  await loginPage.goto();
  await loginPage.loginStateUser();
  await stateHomePage.isReady();
});

test("Should see the correct home page as an admin user", async ({
  loginPage,
  adminHomePage,
}) => {
  await loginPage.goto();
  await loginPage.loginAdminUser();
  await adminHomePage.isReady();
});
