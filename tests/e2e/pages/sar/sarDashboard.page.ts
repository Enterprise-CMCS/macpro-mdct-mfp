import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";
import { firstPeriod, stateAbbreviation, stateName } from "../../helpers";
import { currentYear } from "../../../seeds/helpers";

export class SARDashboardPage extends BasePage {
  public path = "/sar/";

  readonly page: Page;
  readonly title: Locator;
  readonly createButton: Locator;
  readonly modal: Locator;
  readonly associatedWP: Locator;
  readonly firstReport: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = this.page.getByRole("heading", {
      name: `${stateName} MFP Semi-Annual Progress Report (SAR)`,
    });
    this.createButton = this.page.getByRole("button", {
      name: "Add new MFP SAR submission",
    });
    this.modal = this.page.getByRole("dialog");
    this.associatedWP = this.modal.getByRole("textbox", {
      name: "Associated MFP Work Plan",
    });
    this.firstReport = this.page
      .getByRole("row", {
        name: `${stateName} MFP SAR ${currentYear} - Period ${firstPeriod}`,
      })
      .first();
  }

  public async isReady() {
    await this.title.isVisible();
    await this.getReports();
    await this.page.getByRole("rowheader", { name: "Submission name" });
  }

  public async getReports() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(`/reports/SAR/${stateAbbreviation}`) &&
        response.status() == 200
    );
  }

  public async createNewSAR() {
    const radioNo = this.modal.getByRole("radio", { name: "No" });
    const saveButton = this.modal.getByRole("button", { name: "Save" });

    await radioNo.click();
    await saveButton.click();
  }
}
