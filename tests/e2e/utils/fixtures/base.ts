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
  stateHomePage: async ({ page }, use) => {
    await use(new StateHomePage(page));
  },
  adminHomePage: async ({ page }, use) => {
    await use(new AdminHomePage(page));
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
