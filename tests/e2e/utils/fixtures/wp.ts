import { test as base } from "@playwright/test";
import { WPDashboardPage } from "../pageObjects/wp/wpDashboard.page";
import { WPGeneralInformationPage } from "../pageObjects/wp/wpGeneral.page";
import { WPReviewAndSubmitPage } from "../pageObjects/wp/wpReviewAndSubmit.page";
import { WPTransitionBenchmarkProjectionsPage } from "../pageObjects/wp/wpTransitionBenchmarkProjections.page";

type WPFixtures = {
  wpDashboard: WPDashboardPage;
  wpGeneralInformation: WPGeneralInformationPage;
  wpTransitionBenchmarksProjections: WPTransitionBenchmarkProjectionsPage;

  wpReviewAndSubmit: WPReviewAndSubmitPage;
};

export const test = base.extend<WPFixtures>({
  wpDashboard: async ({ page }, use) => {
    await use(new WPDashboardPage(page));
  },
  wpGeneralInformation: async ({ page }, use) => {
    await use(new WPGeneralInformationPage(page));
  },
  wpTransitionBenchmarksProjections: async ({ page }, use) => {
    await use(new WPTransitionBenchmarkProjectionsPage(page));
  },
  wpReviewAndSubmit: async ({ page }, use) => {
    await use(new WPReviewAndSubmitPage(page));
  },
});
