import { Browser, mergeTests, test as base } from "@playwright/test";
import { test as sarTest } from "./sar";
import { test as wpTest } from "./wp";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import { adminAuthPath, stateUserAuthPath } from "../consts";
import BannerPage from "../pageObjects/banner.page";
import ProfilePage from "../pageObjects/profile.page";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
  bannerPage: BannerPage;
  profilePage: ProfilePage;
};

async function addPageObject(
  PageObject: any,
  browser: Browser,
  use: any,
  storageState: string
) {
  const context = await browser.newContext({ storageState });
  const page = new PageObject(await context.newPage());
  // Init page
  await page.goto();
  await use(page);
  await context.close();
}

async function adminPage(PageObject: any, browser: Browser, use: any) {
  await addPageObject(PageObject, browser, use, adminAuthPath);
}

async function statePage(PageObject: any, browser: Browser, use: any) {
  await addPageObject(PageObject, browser, use, stateUserAuthPath);
}

export const baseTest = base.extend<CustomFixtures>({
  stateHomePage: async ({ browser }, use) => {
    await statePage(StateHomePage, browser, use);
  },
  adminHomePage: async ({ browser }, use) => {
    await adminPage(AdminHomePage, browser, use);
  },
  bannerPage: async ({ browser }, use) => {
    await adminPage(BannerPage, browser, use);
  },
  profilePage: async ({ browser }, use) => {
    await statePage(ProfilePage, browser, use);
  },
});

export const test = mergeTests(baseTest, sarTest, wpTest);

export { expect } from "@playwright/test";
