import { Locator, Page } from "@playwright/test";

export default class LoginPage {
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
