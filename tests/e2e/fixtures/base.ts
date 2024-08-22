import { mergeTests, test as base } from "@playwright/test";
import { test as sarTest } from "./sar.ts";
import StateHomePage from "../pages/stateHome.page";
import AdminHomePage from "../pages/adminHome.page";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

export const baseTest = base.extend<CustomFixtures>({
  stateHomePage: async ({ page }, use) => {
    await use(new StateHomePage(page));
  },
  adminHomePage: async ({ page }, use) => {
    await use(new AdminHomePage(page));
  },
});

export const test = mergeTests(baseTest, sarTest);

export { expect } from "@playwright/test";
