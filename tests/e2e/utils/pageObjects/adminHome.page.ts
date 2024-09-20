import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class AdminHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "View State/Territory Reports",
    });
    this.dropdown = page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    });
  }

  public async selectWP() {
    await this.page.getByRole("radio", { name: "MFP Work Plan" }).click();
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
