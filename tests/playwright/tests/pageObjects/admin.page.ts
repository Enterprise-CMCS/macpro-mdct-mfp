import { Page, expect } from "@playwright/test";
import { testBanner } from "../../utils/consts";
import { BasePage } from "./base.page";

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToReportDashboard(state: string, reportType: string) {
    await this.page.locator('select[name="state"]').selectOption(state);
    await this.page
      .locator(`input[name="report"][value="${reportType}"]`)
      .click();
    const getReportsResp = this.waitForReportResponse("GET", 200);
    await this.page
      .getByRole("button", { name: "Go to Report Dashboard" })
      .click();
    await getReportsResp;
    await this.page
      .locator("div")
      .filter({ hasText: /^Loading\.\.\.$/ })
      .nth(2)
      .waitFor({ state: "detached" });
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
    const postResp = this.waitForApiResponse("POST", 201);
    await this.page.getByRole("button", { name: "Create banner" }).click();
    await postResp;
  }

  async deleteAdminBanner() {
    const deleteResp = this.waitForApiResponse("DELETE", 200);
    await this.page.getByRole("button", { name: "Delete banner" }).click();
    await deleteResp;
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
        const deleteResp = this.waitForApiResponse("DELETE", 200, "banners");
        await button.click();
        await deleteResp;
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
    const putReportResp = this.waitForApiResponse(
      "PUT",
      200,
      "/reports/release/"
    );
    const getReportsResp = this.waitForReportResponse("GET", 200);
    await this.page.getByRole("button", { name: "Unlock" }).first().click();
    await Promise.all([putReportResp, getReportsResp]);
  }
}
