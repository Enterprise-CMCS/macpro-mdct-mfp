export class Login {
  constructor(page) {
    this.page = page;
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
    await this.emailInput.fill(process.env.MFP_STATE_EMAIL);
    await this.passwordInput.fill(process.env.MFP_PW);
    await this.loginButton.click();
  }
  async adminUser() {
    await this.emailInput.fill(process.env.MFP_ADMIN_EMAIL);
    await this.passwordInput.fill(process.env.MFP_PW);
    await this.loginButton.click();
  }
}
