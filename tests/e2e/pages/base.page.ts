import { expect, Locator, Page } from "@playwright/test";

export default class BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Money Follows the Person",
    });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }
}
