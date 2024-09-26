import { expect, Locator, Page } from "@playwright/test";

export default class BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly continueButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Money Follows the Person",
    });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    await this.title.isVisible();
    return expect(this.page).toHaveURL(this.path);
  }
}
