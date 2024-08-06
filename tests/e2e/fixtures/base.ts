import { test as base } from "@playwright/test";
import { AdminHomePage, LoginPage, StateHomePage } from "../pages/common";

type CustomFixtures = {
  loginPage: LoginPage;
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

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
