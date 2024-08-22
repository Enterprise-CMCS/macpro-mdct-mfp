import { test as base } from "@playwright/test";
import { WPDashboardPage } from "../pages/wp/wpDashboard.page";

type WPFixtures = {
  wpDashboard: WPDashboardPage;
};

export const test = base.extend<WPFixtures>({
  wpDashboard: async ({ page }, use) => {
    await use(new WPDashboardPage(page));
  },
});
