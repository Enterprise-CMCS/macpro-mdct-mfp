import { expect, Locator, Page } from "@playwright/test";

export default class StateHomePage {
  public path = "/";

  readonly page: Page;
  readonly wpButton: Locator;
  readonly sarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.wpButton = page.getByRole("button", {
      name: "Enter Work Plan online",
    });
    this.sarButton = page.getByRole("button", { name: "Enter SAR online" });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    return await Promise.all([
      expect(this.wpButton).toBeVisible(),
      expect(this.sarButton).toBeVisible(),
    ]);
  }
}
