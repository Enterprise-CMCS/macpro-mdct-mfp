import { expect, Locator, Page } from "@playwright/test";

export default class BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly continueButton: Locator;
  readonly previousButton: Locator;
  readonly myAccountButton: Locator;
  readonly accountMenu: Locator;
  readonly manageAccountButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Money Follows the Person",
    });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.myAccountButton = page.getByRole("button", { name: "my account" });
    this.accountMenu = page.getByRole("menu");
    this.manageAccountButton = page.getByRole("menuitem", {
      name: "Manage Account",
    });
    this.logoutButton = page.getByRole("menuitem", { name: "Log Out" });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    await this.title.isVisible();
    return expect(this.page).toHaveURL(this.path);
  }

  public async manageAccount() {
    await this.myAccountButton.click();
    await this.accountMenu.isVisible();
    await this.manageAccountButton.click();
  }

  public async logOut() {
    await this.myAccountButton.click();
    await this.accountMenu.isVisible();
    await this.logoutButton.click();
  }
}
