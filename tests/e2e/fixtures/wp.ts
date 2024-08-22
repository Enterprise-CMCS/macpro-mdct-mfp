import { test as base } from "@playwright/test";
import { WPDashboardPage } from "../pages/wp/wpDashboard.page";
import { WPGeneralInformationPage } from "../pages/wp/wpGeneral.page";
import { WPReviewAndSubmitPage } from "../pages/wp/wpReviewAndSubmit.page";

type WPFixtures = {
  wpDashboard: WPDashboardPage;
  wpGeneralInformation: WPGeneralInformationPage;
  wpReviewAndSubmit: WPReviewAndSubmitPage;
};

export const test = base.extend<WPFixtures>({
  wpDashboard: async ({ page }, use) => {
    await use(new WPDashboardPage(page));
  },
  wpGeneralInformation: async ({ page }, use) => {
    await use(new WPGeneralInformationPage(page));
  },
  wpReviewAndSubmit: async ({ page }, use) => {
    await use(new WPReviewAndSubmitPage(page));
  },
});
