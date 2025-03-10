import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class BannerEditorPage extends BasePage {
  public path = "/admin";

  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Banner Admin",
    });
  }
}
