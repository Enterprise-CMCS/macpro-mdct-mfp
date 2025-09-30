import { test as base, BrowserContext, Page } from "@playwright/test";
import HomePage from "../pageObjects/home.page";
import { adminAuthPath, stateUserAuthPath } from "../consts";
import BannerPage from "../pageObjects/banner.page";
import ProfilePage from "../pageObjects/profile.page";
import WorkPlanPage from "../pageObjects/workPlan.page";
import HelpPage from "../pageObjects/help.page";

class StatePagesWrapper {
  public readonly home: HomePage;
  public readonly profile: ProfilePage;
  public readonly workPlan: WorkPlanPage;
  public readonly help: HelpPage;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.profile = new ProfilePage(page);
    this.workPlan = new WorkPlanPage(page);
    this.help = new HelpPage(page);
  }
}

class AdminPagesWrapper {
  public readonly home: HomePage;
  public readonly banner: BannerPage;
  public readonly profile: ProfilePage;
  public readonly help: HelpPage;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.banner = new BannerPage(page);
    this.profile = new ProfilePage(page);
    this.help = new HelpPage(page);
  }
}

type CustomFixtures = {
  stateContext: BrowserContext;
  adminContext: BrowserContext;
  statePage: StatePagesWrapper;
  adminPage: AdminPagesWrapper;
};

export const test = base.extend<CustomFixtures>({
  stateContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: stateUserAuthPath,
    });
    await use(context);
    await context.close();
  },

  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminAuthPath,
    });
    await use(context);
    await context.close();
  },

  statePage: async ({ stateContext }, use) => {
    const page = await stateContext.newPage();
    const wrapper = new StatePagesWrapper(page);
    await use(wrapper);
    await page.close();
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    const wrapper = new AdminPagesWrapper(page);
    await use(wrapper);
    await page.close();
  },
});

export * from "@playwright/test";
