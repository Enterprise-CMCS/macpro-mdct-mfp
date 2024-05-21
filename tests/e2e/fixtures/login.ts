import type { Page, Locator } from "@playwright/test";

export class Login {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(public readonly page: Page) {
    this.emailInput = this.page.getByRole("textbox", { name: "email" });
    this.passwordInput = this.page.getByRole("textbox", { name: "password" });
    this.loginButton = this.page.getByRole("button", {
      name: "Log In with Cognito",
    });
  }

  async goto() {
    await this.page.goto("/");
  }

  async stateUser() {
    await this.emailInput.fill(process.env.MFP_STATE_EMAIL!);
    await this.passwordInput.fill(process.env.MFP_PW!);
    await this.loginButton.click();
    await this.goto();
  }

  async adminUser() {
    await this.emailInput.fill(process.env.MFP_ADMIN_EMAIL!);
    await this.passwordInput.fill(process.env.MFP_PW!);
    await this.loginButton.click();
    await this.goto();
  }
}
