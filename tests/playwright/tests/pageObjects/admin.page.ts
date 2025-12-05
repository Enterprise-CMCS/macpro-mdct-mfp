import { Page, expect } from "@playwright/test";
import { testBanner } from "../../utils/consts";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToReportDashboard(state: string, reportType: string) {
    await this.page.locator('select[name="state"]').selectOption(state);
    await this.page
      .locator(`input[name="report"][value="${reportType}"]`)
      .click();
    await this.page
      .getByRole("button", { name: "Go to Report Dashboard" })
      .click();
  }

  // Profile page functionality
  async navigateToBannerEditor() {
    await this.page.getByRole("button", { name: "Banner Editor" }).click();
    await this.page.waitForURL("**/admin");
    return this;
  }

  // Banner page functionality
  async createAdminBanner() {
    await this.page.getByPlaceholder("New banner title").fill(testBanner.title);
    await this.page
      .getByPlaceholder("New banner description")
      .fill(testBanner.description);
    await this.page.getByLabel("Start date").fill(testBanner.startDate);
    await this.page.getByLabel("End date").fill(testBanner.endDate);
    await this.page.getByRole("button", { name: "Create banner" }).click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 201 && response.request().method() === "POST"
    );
  }

  async deleteAdminBanner() {
    await this.page.getByRole("button", { name: "Delete banner" }).click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 200 && response.request().method() === "DELETE"
    );
  }

  async deleteExistingBanners() {
    const noBannerText = this.page.getByText("There are no existing banners");
    const bannerText = this.page.getByText("Status");
    await expect(noBannerText.or(bannerText).first()).toBeVisible();

    if (await noBannerText.isVisible()) return;

    const deleteButtons = await this.page
      .getByRole("button", { name: "Delete banner" })
      .all();

    if (deleteButtons.length > 0) {
      for (const button of deleteButtons) {
        await button.click();
        await this.page.waitForResponse(
          (response) =>
            response.url().includes(`banners`) &&
            response.request().method() === "DELETE" &&
            response.status() == 200
        );
      }
    }
  }

  async findSubmittedReport() {
    const rows = this.page.locator('table[role="table"] tbody tr');
    const firstSubmitted = rows
      .filter({ has: this.page.getByRole("cell", { name: "Submitted" }) })
      .first();
    return firstSubmitted;
  }

  async unlockFirstSubmittedReport() {
    const report = await this.findSubmittedReport();
    await report.getByRole("button", { name: "Unlock" }).click();
    this.page.waitForResponse(
      (response) =>
        response.request().method() === "PUT" &&
        response.url().includes("/reports/release/") &&
        response.status() === 200
    );
  }
}
