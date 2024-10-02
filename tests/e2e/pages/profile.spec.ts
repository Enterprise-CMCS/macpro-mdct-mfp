import { expect, test } from "../utils/fixtures/base";
import { e2eA11y, logInAdminUser, logInStateUser } from "../utils";

test("Admin user can navigate to /admin", async ({
  page,
  adminHomePage,
  profilePage,
  bannerEditorPage,
}) => {
  await logInAdminUser(page);
  await adminHomePage.isReady();
  await adminHomePage.manageAccount();
  await profilePage.isReady();
  await expect(profilePage.bannerEditorButton).toBeVisible();

  await profilePage.bannerEditorButton.click();
  await bannerEditorPage.isReady();
});

test("State user cannot navigate to /admin", async ({
  page,
  stateHomePage,
  profilePage,
  bannerEditorPage,
}) => {
  await logInStateUser(page);
  await stateHomePage.isReady();
  await stateHomePage.manageAccount();
  await profilePage.isReady();
  await expect(profilePage.bannerEditorButton).not.toBeVisible();
  await bannerEditorPage.goto();

  // Expect a redirect to the profile page
  await profilePage.isReady();
});

test("Is accessible on all device types for state user", async ({
  page,
  stateHomePage,
}) => {
  await logInStateUser(page);
  await stateHomePage.isReady();
  await e2eA11y(page, "/profile");
});

test("Is accessible on all device types for admin user", async ({
  page,
  adminHomePage,
}) => {
  await logInAdminUser(page);
  await adminHomePage.isReady();
  await e2eA11y(page, "/profile");
});
