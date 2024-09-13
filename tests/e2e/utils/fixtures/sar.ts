import { test as base } from "@playwright/test";
import { SARDashboardPage } from "../pageObjects/sar/sarDashboard.page";

type SARFixtures = {
  sarDashboard: SARDashboardPage;
};

export const test = base.extend<SARFixtures>({
  sarDashboard: async ({ page }, use) => {
    await use(new SARDashboardPage(page));
  },
});
