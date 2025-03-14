import { expect, test } from "../utils/fixtures/base";
import { BrowserContext, Page } from "@playwright/test";
import ProfilePage from "../utils/pageObjects/profile.page";
import BannerEditorPage from "../utils/pageObjects/banner.page";

let adminPage: Page;
let userPage: Page;
let adminContext: BrowserContext;
let userContext: BrowserContext;
test.beforeAll(async ({ browser }) => {
  adminContext = await browser.newContext({
    storageState: "playwright/.auth/admin.json",
  });
  adminPage = await adminContext.newPage();

  userContext = await browser.newContext({
    storageState: "playwright/.auth/user.json",
  });
  userPage = await userContext.newPage();
});

test.afterAll(async () => {
  await adminContext.close();
  await userContext.close();
});
test.describe("Admin profile", () => {
  test(
    "Admin user can navigate to /admin",
    { tag: "@admin" },
    async ({ adminHomePage }) => {
      const profilePage = new ProfilePage(adminPage);
      const bannerEditorPage = new BannerEditorPage(adminPage);
      await adminHomePage.goto();
      await adminHomePage.isReady();
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
      const profilePage = new ProfilePage(adminPage);
      await profilePage.goto();
      await profilePage.e2eA11y();
    }
  );
});

test.describe("State user profile", { tag: "@user" }, () => {
  test("State user cannot navigate to /admin", async ({ stateHomePage }) => {
    const profilePage = new ProfilePage(userPage);
    const bannerEditorPage = new BannerEditorPage(userPage);

    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.manageAccount();
    await profilePage.goto();
    await expect(profilePage.bannerEditorButton).not.toBeVisible();
    await bannerEditorPage.goto();

    // Expect a redirect to the profile page
    await profilePage.isReady();
  });

  test("Profile page is accessible on all device types for state user", async () => {
    const profilePage = new ProfilePage(userPage);
    await profilePage.goto();
    await profilePage.e2eA11y();
  });
});
