import { mergeTests, test as base } from "@playwright/test";
import { test as wpTest } from "./wp.ts";
import LoginPage from "../pages/login.page";
import StateHomePage from "../pages/stateHome.page";
import AdminHomePage from "../pages/adminHome.page";

type CustomFixtures = {
  loginPage: LoginPage;
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

export const baseTest = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  stateHomePage: async ({ page }, use) => {
    await use(new StateHomePage(page));
  },
  adminHomePage: async ({ page }, use) => {
    await use(new AdminHomePage(page));
  },
});

export const test = mergeTests(baseTest, wpTest);

export { expect } from "@playwright/test";
