import { mergeTests, test as base } from "@playwright/test";
import { test as sarTest } from "./sar.ts";
import { test as wpTest } from "./wp.ts";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import ProfilePage from "../pageObjects/profile.page.ts";
import BannerEditorPage from "../pageObjects/banner.page.ts";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
  profilePage: ProfilePage;
  bannerEditorPage: BannerEditorPage;
};

export const baseTest = base.extend<CustomFixtures>({
  stateHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const stateHomePage = new StateHomePage(await context.newPage());
    await use(stateHomePage);
    await context.close();
  },
  adminHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminHomePage = new AdminHomePage(await context.newPage());
    await use(adminHomePage);
    await context.close();
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  bannerEditorPage: async ({ page }, use) => {
    await use(new BannerEditorPage(page));
  },
});

export const test = mergeTests(baseTest, sarTest, wpTest);

export { expect } from "@playwright/test";
