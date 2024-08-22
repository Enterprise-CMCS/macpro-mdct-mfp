import { test as base } from "@playwright/test";
import StateHomePage from "../pages/stateHome.page";
import AdminHomePage from "../pages/adminHome.page";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
};

export const test = base.extend<CustomFixtures>({
  stateHomePage: async ({ page }, use) => {
    await use(new StateHomePage(page));
  },
  adminHomePage: async ({ page }, use) => {
    await use(new AdminHomePage(page));
  },
});

export { expect } from "@playwright/test";
