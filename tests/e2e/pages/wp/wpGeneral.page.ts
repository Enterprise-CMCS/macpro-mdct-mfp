import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPGeneralInformationPage extends BasePage {
  public path = "/wp/general-information";

  readonly page: Page;
  readonly title: Locator;
  readonly disclosure: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", { name: "General Information" });
    this.disclosure = page.getByText("PRA Disclosure Statement");
  }
}
