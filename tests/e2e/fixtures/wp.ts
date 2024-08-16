import { test as base } from "@playwright/test";
import {
  WPDashboardPage,
  WPGeneralInformationPage,
  WPTransitionBenchmarksPage,
  WPTransitionBenchmarkStrategyPage,
  WPInitiativesInstructionsPage,
  WPInitiativesDashboardPage,
  WPInitiativeOverlayPage,
} from "../pages/wp.page";

type WPFixtures = {
  wpDashboardPage: WPDashboardPage;
  wpGeneralInformationPage: WPGeneralInformationPage;
  wpTransitionBenchmarksPage: WPTransitionBenchmarksPage;
  wpTransitionBenchmarkStrategyPage: WPTransitionBenchmarkStrategyPage;
  wpInitiativesInstructionsPage: WPInitiativesInstructionsPage;
  wpInitiativesDashboardPage: WPInitiativesDashboardPage;
  wpInitiativeOverlayPage: WPInitiativeOverlayPage;
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
  wpInitiativesInstructionsPage: async ({ page }, use) => {
    await use(new WPInitiativesInstructionsPage(page));
  },
  wpInitiativesDashboardPage: async ({ page }, use) => {
    await use(new WPInitiativesDashboardPage(page));
  },
  wpInitiativeOverlayPage: async ({ page }, use) => {
    await use(new WPInitiativeOverlayPage(page));
  },
});
