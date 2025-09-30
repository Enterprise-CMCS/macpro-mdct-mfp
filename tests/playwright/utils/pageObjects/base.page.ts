import { expect, Locator, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { a11yTags, a11yViewports } from "../consts";

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

  public async goto(url?: string) {
    if (url) {
      await this.page.goto(url);
    } else {
      await this.page.goto(this.path);
    }
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

  async runA11yScan(): Promise<void> {
    const accessibilityErrors: any[] = [];
    for (const [device, viewport] of Object.entries(a11yViewports)) {
      await this.page.setViewportSize(viewport);
      await this.page.locator("h1").first().waitFor({ state: "visible" });
      const axeBuilder = new AxeBuilder({ page: this.page })
        .withTags(a11yTags)
        .disableRules(["duplicate-id"]);
      const results = await axeBuilder.analyze();
      if (results.violations.length > 0) {
        accessibilityErrors.push({
          device,
          violations: results.violations,
        });
      }
    }
    expect(accessibilityErrors).toEqual([]);
  }
}
