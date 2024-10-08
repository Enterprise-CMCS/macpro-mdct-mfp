import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class StateHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly wpButton: Locator;
  readonly sarButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Money Follows the Person (MFP) Portal",
    });
    this.wpButton = page.getByRole("button", {
      name: "Enter Work Plan online",
    });
    this.sarButton = page.getByRole("button", { name: "Enter SAR online" });
  }
}
