import { Page, Locator } from "@playwright/test";
import BasePage from "./base.page";
import BaseDialog from "./dialogs/baseDialog.page";

export default class WorkPlanPage extends BasePage {
  public path = "/wp";

  readonly page: Page;
  readonly admin: AdminWorkPlanElements;
  readonly state: StateWorkPlanElements;
  readonly wpTable: Locator;
  readonly wpDataRows: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.admin = new AdminWorkPlanElements(page);
    this.state = new StateWorkPlanElements(page);

    this.wpTable = this.page.getByRole("table");
    this.wpDataRows = this.wpTable.getByRole("row").filter({
      has: this.page.getByRole("gridcell"),
    });
  }
}

export class AdminWorkPlanElements {
  readonly page: Page;

  readonly stateSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stateSelect = page.locator('select[name="state"]');
  }

  async selectState(stateValue: string): Promise<void> {
    await this.stateSelect.selectOption(stateValue);
  }

  async selectReportType(reportType: string): Promise<void> {
    await this.page
      .locator(`input[name="report"][value="${reportType}"]`)
      .click();
  }
}

export class StateWorkPlanElements {
  readonly page: Page;
  readonly startWorkPlanButton: Locator;
  readonly addNewWorkPlanModal: Locator;
  readonly startNewButton: Locator;
  readonly editButton: Locator;
  readonly continueButton: Locator;
  readonly transitionBenchmarkDialog: BaseDialog;

  constructor(page: Page) {
    this.page = page;
    this.startWorkPlanButton = page.getByRole("button", {
      name: "Start MFP Work Plan",
    });
    this.addNewWorkPlanModal = page.getByRole("dialog", {
      name: "Add new MFP Work Plan",
    });
    this.startNewButton = this.addNewWorkPlanModal.getByRole("button", {
      name: "Start new",
    });
    this.transitionBenchmarkDialog = new BaseDialog(
      page,
      'div[id="wp-tbp-dialog"]'
    );
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.continueButton = page.getByRole("button", {
      name: "Continue",
    });
  }

  async selectReportYear(year: number | string): Promise<void> {
    await this.addNewWorkPlanModal
      .locator(`input[name="reportPeriodYear"][value="${year}"]`)
      .click();
  }

  async selectReportingPeriod(period: string): Promise<void> {
    await this.addNewWorkPlanModal
      .locator(`input[name="reportPeriod"][value*="${period}"]`)
      .click();
  }

  async startNewWorkPlan(year: number | string, period: string): Promise<void> {
    await this.startWorkPlanButton.click();
    await this.addNewWorkPlanModal.waitFor();
    await this.selectReportYear(year);
    await this.selectReportingPeriod(period);
    await this.startNewButton.click();
  }
}
