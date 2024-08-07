import { expect, Locator, Page } from "@playwright/test";

export default class AdminHomePage {
  public path = "/";

  readonly page: Page;
  readonly dropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    return expect(this.dropdown).toBeVisible();
  }
}
