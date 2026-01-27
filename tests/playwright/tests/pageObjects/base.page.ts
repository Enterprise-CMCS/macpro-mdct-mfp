import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected waitForApiResponse(
    method: string,
    status: number,
    urlPattern?: string
  ) {
    return this.page.waitForResponse((response) => {
      const matchesMethod = response.request().method() === method;
      const matchesStatus = response.status() === status;
      const matchesUrl = urlPattern
        ? response.url().includes(urlPattern)
        : true;
      return matchesMethod && matchesStatus && matchesUrl;
    });
  }

  protected waitForReportResponse(method: string, status: number) {
    return this.waitForApiResponse(method, status, "/reports/");
  }
}
