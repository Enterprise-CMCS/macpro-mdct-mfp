import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPFundingSourcesPage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly backButton: Locator;
  readonly modal: Locator;
  readonly addSourceButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives: I. Define initiative",
    });
    this.backButton = page
      .getByRole("button", {
        name: "Return to dashboard for this initiative",
      })
      .first();
    this.modal = page.getByRole("dialog");
    this.addSourceButton = page.getByRole("button", {
      name: "Add funding source",
    });
  }

  public async fillFields() {
    const radioGroup = this.modal.getByRole("group", {
      name: "Funding source:",
    });
    const quarterFields = await this.modal.getByRole("textbox").all();

    await radioGroup
      .getByLabel(
        "MFP cooperative agreement funds for qualified HCBS and demonstration services"
      )
      .click();

    for (const textInput of quarterFields) {
      await textInput.fill("99");
    }

    await this.modal.getByRole("button", { name: "Save" }).click();
    await this.modal.isHidden();
  }
}
