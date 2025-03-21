import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";
import {
  currentYear,
  firstPeriod,
  secondPeriod,
  stateAbbreviation,
  stateName,
} from "../../consts";

export class WPDashboardPage extends BasePage {
  public path = "/wp";

  readonly page: Page;
  readonly title: Locator;
  readonly createButton: Locator;
  readonly copyoverButton: Locator;
  readonly modal: Locator;
  readonly firstReport: Locator;
  readonly copiedReport: Locator;
  readonly submittedReport: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = this.page.getByRole("heading", {
      name: `${stateName} MFP Work Plan`,
    });
    this.createButton = this.page.getByRole("button", {
      name: "Start MFP Work Plan",
    });
    this.copyoverButton = this.page.getByRole("button", {
      name: "Continue MFP Work Plan for next Period",
    });
    this.modal = this.page.getByRole("dialog");

    this.firstReport = this.page
      .getByRole("row", {
        name: `${stateName} MFP Work Plan ${currentYear} - Period ${firstPeriod}`,
      })
      .first();
    this.copiedReport = this.page.getByRole("row", {
      name: `${stateName} MFP Work Plan ${currentYear} - Period ${secondPeriod}`,
    });
    this.submittedReport = this.page
      .getByRole("row", { name: "Submitted" })
      .last();
  }

  public async reportsReady() {
    await this.getReports();
    await this.page.getByRole("rowheader", { name: "Submission name" });
  }

  public async getReports() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(`/reports/WP/${stateAbbreviation}`) &&
        response.status() == 200
    );
  }

  public async createNewWP() {
    await this.modal.getByLabel(`${currentYear}`).click();
    await this.modal
      .getByLabel(`First reporting period (January 1 - June 30)`)
      .click();
    await this.modal.getByRole("button", { name: "Start new" }).click();
  }

  public async archiveAllReports() {
    const table = await this.page.getByRole("table");
    const archiveButtons = await table
      .getByRole("button", {
        name: "Archive",
      })
      .all();

    if (archiveButtons.length > 0) {
      for (const button of archiveButtons) {
        await button.click();
        const modal = this.page.getByRole("dialog");
        await modal.isVisible();
        await modal.getByRole("textbox").fill("ARCHIVE");
        await modal.getByRole("button", { name: "Archive" }).click();
        await Promise.all([
          this.page.waitForResponse((response) =>
            response.url().includes(`reports/archive/WP/${stateAbbreviation}/`)
          ),
          this.getReports(),
        ]);
        await this.archiveAllReports();
      }
    }
  }
}
