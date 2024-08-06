import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
  public url = "http://localhost:3000";

  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByRole("textbox", { name: "email" });
    this.password = page.getByRole("textbox", { name: "password" });
    this.button = page.getByRole("button", { name: "Log In with Cognito" });
  }

  public async goto() {
    await this.page.goto(this.url);
  }

  public async loginStateUser() {
    await this.email.fill(process.env.SEED_STATE_USER_EMAIL!);
    await this.password.fill(process.env.SEED_STATE_USER_PASSWORD!);
    await this.button.click();
  }

  public async loginAdminUser() {
    await this.email.fill(process.env.SEED_ADMIN_USER_EMAIL!);
    await this.password.fill(process.env.SEED_ADMIN_USER_PASSWORD!);
    await this.button.click();
  }
}

export class StateHomePage {
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

export class AdminHomePage {
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
