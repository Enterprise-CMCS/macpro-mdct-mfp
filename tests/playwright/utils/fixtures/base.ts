import { test as base, BrowserContext } from "@playwright/test";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import { adminAuthPath, stateUserAuthPath } from "../consts";
import BannerPage from "../pageObjects/banner.page";
import ProfilePage from "../pageObjects/profile.page";

type CustomFixtures = {
  stateContext: BrowserContext;
  adminContext: BrowserContext;
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
  adminBannerPage: BannerPage;
  stateProfilePage: ProfilePage;
  adminProfilePage: ProfilePage;
};

export const test = base.extend<CustomFixtures>({
  stateContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: stateUserAuthPath,
    });
    await use(context);
    await context.close();
  },

  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminAuthPath,
    });
    await use(context);
    await context.close();
  },

  stateHomePage: async ({ stateContext }, use) => {
    const page = new StateHomePage(await stateContext.newPage());
    await use(page);
  },

  adminHomePage: async ({ adminContext }, use) => {
    const page = new AdminHomePage(await adminContext.newPage());
    await use(page);
  },

  adminBannerPage: async ({ adminContext }, use) => {
    const page = new BannerPage(await adminContext.newPage());
    await use(page);
  },

  stateProfilePage: async ({ stateContext }, use) => {
    const page = new ProfilePage(await stateContext.newPage());
    await use(page);
  },

  adminProfilePage: async ({ adminContext }, use) => {
    const page = new ProfilePage(await adminContext.newPage());
    await use(page);
  },
});

export * from "@playwright/test";
