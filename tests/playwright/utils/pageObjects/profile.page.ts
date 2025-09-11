import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import BannerPage from "./banner.page";

export default class ProfilePage extends BasePage {
  public path = "/profile";

  readonly page: Page;
  readonly title: Locator;
  readonly bannerEditorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "My Account",
    });
    this.bannerEditorButton = page.getByRole("button", {
      name: "Banner Editor",
    });
  }

  public async navigateToBannerEditor() {
    await this.bannerEditorButton.click();
    await this.page.waitForURL("**/admin");
    return new BannerPage(this.page);
  }
}
