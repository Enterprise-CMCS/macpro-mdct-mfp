import { expect, test } from "../utils/fixtures/base";
import { BrowserContext, Page } from "@playwright/test";
import ProfilePage from "../utils/pageObjects/profile.page";
import BannerEditorPage from "../utils/pageObjects/banner.page";
import { adminAuthPath, stateUserAuthPath } from "../utils";

let adminPage: Page;
let userPage: Page;
let adminContext: BrowserContext;
let userContext: BrowserContext;
let profilePage: ProfilePage;
let bannerEditorPage: BannerEditorPage;

test.beforeAll(async ({ browser }) => {
  adminContext = await browser.newContext({
    storageState: adminAuthPath,
  });
  adminPage = await adminContext.newPage();

  userContext = await browser.newContext({
    storageState: stateUserAuthPath,
  });
  userPage = await userContext.newPage();
});

test.afterAll(async () => {
  await adminContext.close();
  await userContext.close();
});

test.describe("Admin profile", () => {
  test.beforeEach(async () => {
    profilePage = new ProfilePage(adminPage);
    bannerEditorPage = new BannerEditorPage(adminPage);
    await profilePage.goto();
    await profilePage.isReady();
  });

  test(
    "Admin user can navigate to /admin",
    { tag: "@admin" },
    async ({ adminHomePage }) => {
      await adminHomePage.manageAccount();
      await profilePage.goto();
      await expect(profilePage.bannerEditorButton).toBeVisible();

      await profilePage.bannerEditorButton.click();
      await bannerEditorPage.goto();
      await bannerEditorPage.isReady();
    }
  );

  test(
    "Profile page is accessible on all device types for admin user",
    { tag: "@admin" },
    async () => {
      await profilePage.e2eA11y();
    }
  );
});

test.describe("State user profile", { tag: "@user" }, () => {
  test.beforeEach(async () => {
    profilePage = new ProfilePage(userPage);
    bannerEditorPage = new BannerEditorPage(userPage);
    await profilePage.goto();
    await profilePage.isReady();
  });

  test("State user cannot navigate to /admin", async ({ stateHomePage }) => {
    await stateHomePage.manageAccount();
    await profilePage.goto();
    await expect(profilePage.bannerEditorButton).not.toBeVisible();
    await bannerEditorPage.goto();

    // Expect a redirect to the profile page
    await profilePage.isReady();
  });

  test("Profile page is accessible on all device types for state user", async () => {
    await profilePage.e2eA11y();
  });
});
