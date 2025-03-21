import { mergeTests, test as base } from "@playwright/test";
import { test as sarTest } from "./sar.ts";
import { test as wpTest } from "./wp.ts";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import { adminAuthPath, stateUserAuthPath } from "../consts.ts";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

export const baseTest = base.extend<CustomFixtures>({
  stateHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: stateUserAuthPath,
    });
    const stateHomePage = new StateHomePage(await context.newPage());
    await use(stateHomePage);
    await context.close();
  },
  adminHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminAuthPath,
    });
    const adminHomePage = new AdminHomePage(await context.newPage());
    await use(adminHomePage);
    await context.close();
  },
});

export const test = mergeTests(baseTest, sarTest, wpTest);

export { expect } from "@playwright/test";
