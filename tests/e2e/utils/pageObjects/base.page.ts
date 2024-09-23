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

  public async isFinishedSaving(response) {
    return (
      response.url().includes("https://services/url") &&
      response.status() === 200
    );
  }

  public async savedFormResponse() {
    const response = await this.page.waitForResponse(
      async (response) => await this.isFinishedSaving(response)
    );
    return response;
  }
}
