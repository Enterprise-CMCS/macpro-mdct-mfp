import { test as base } from "@playwright/test";
import LoginPage from "../pages/login.page";
import StateHomePage from "../pages/stateHome.page";
import AdminHomePage from "../pages/adminHome.page";

type CustomFixtures = {
  loginPage: LoginPage;
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<CustomFixtures>({
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

export { expect } from "@playwright/test";
