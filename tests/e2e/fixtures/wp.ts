import { test as base } from "@playwright/test";
import {
  WPDashboardPage,
  WPGeneralInformationPage,
  WPTransitionBenchmarksPage,
  WPTransitionBenchmarkStrategyPage,
} from "../pages/wp.page";

type WPFixtures = {
  wpDashboardPage: WPDashboardPage;
  wpGeneralInformationPage: WPGeneralInformationPage;
  wpTransitionBenchmarksPage: WPTransitionBenchmarksPage;
  wpTransitionBenchmarkStrategyPage: WPTransitionBenchmarkStrategyPage;
};

export const test = base.extend<WPFixtures>({
  wpDashboardPage: async ({ page }, use) => {
    await use(new WPDashboardPage(page));
  },
  wpGeneralInformationPage: async ({ page }, use) => {
    await use(new WPGeneralInformationPage(page));
  },
  wpTransitionBenchmarksPage: async ({ page }, use) => {
    await use(new WPTransitionBenchmarksPage(page));
  },
  wpTransitionBenchmarkStrategyPage: async ({ page }, use) => {
    await use(new WPTransitionBenchmarkStrategyPage(page));
  },
});
