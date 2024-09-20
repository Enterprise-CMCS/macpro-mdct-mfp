import { mergeTests, test as base } from "@playwright/test";
import { test as sarTest } from "./sar.ts";
import { test as wpTest } from "./wp.ts";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";

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

export const test = mergeTests(baseTest, sarTest, wpTest);

export { expect } from "@playwright/test";
