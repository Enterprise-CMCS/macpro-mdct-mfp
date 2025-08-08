import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import { expectedAdminHeading } from "../consts";

export default class AdminHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: expectedAdminHeading,
    });
    this.dropdown = page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    });
  }

  public async selectWP(state: string) {
    await this.page
      .getByRole("combobox", {
        name: "List of states, including District of Columbia and Puerto Rico",
      })
      .selectOption(state);
    await this.page.getByRole("radio", { name: "MFP Work Plan" }).click();
    await this.goToDashboard();
  }

  public async selectSAR() {
    await this.page
      .getByRole("radio", {
        name: "MFP Semi-Annual Progress Report (SAR)",
      })
      .click();
  }

  public async goToDashboard() {
    await this.page
      .getByRole("button", {
        name: "Go to Report Dashboard",
      })
      .click();
  }
}
