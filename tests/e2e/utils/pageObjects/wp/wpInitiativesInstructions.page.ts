import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPInitiativesInstructionsPage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/instructions";

  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives Instructions",
    });
  }

  public async fillFormFields() {
    const radioButtons = await this.page.getByLabel("No").all();

    for (const radio of radioButtons) {
      await radio.click();
    }
  }
}
