import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import { expectedAdminHeading, expectedStateUserHeading } from "../consts";
import WorkPlanPage from "./workPlan.page";

export default class HomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly admin: AdminHomeElements;
  readonly state: StateHomeElements;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.admin = new AdminHomeElements(page);
    this.state = new StateHomeElements(page);
  }
}

export class AdminHomeElements {
  readonly page: Page;
  readonly title: Locator;
  readonly stateDropdown: Locator;
  readonly reportDashboardButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: expectedAdminHeading,
    });
    this.stateDropdown = page.locator('select[name="state"]');
    this.reportDashboardButton = page.getByRole("button", {
      name: "Go to Report Dashboard",
    });
  }

  async goToReportDashboard(state: string, reportType: string) {
    await this.stateDropdown.selectOption(state);
    await this.page
      .locator(`input[name="report"][value="${reportType}"]`)
      .click();
    await this.reportDashboardButton.click();
    return new WorkPlanPage(this.page).admin;
  }
}

export class StateHomeElements {
  readonly page: Page;
  readonly title: Locator;
  readonly workPlanButton: Locator;
  readonly sarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: expectedStateUserHeading,
    });
    this.workPlanButton = page.getByRole("button", {
      name: "Enter Work Plan online",
    });
    this.sarButton = page.getByRole("button", { name: "Enter SAR online" });
  }

  async goToWPDashboard() {
    await this.workPlanButton.click();
    return new WorkPlanPage(this.page).state;
  }
}
