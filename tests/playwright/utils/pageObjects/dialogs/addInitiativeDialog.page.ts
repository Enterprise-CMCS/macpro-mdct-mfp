import { Locator, Page } from "@playwright/test";

export class AddInitiativeDialog {
  readonly page: Page;

  readonly initiativeNameTextarea: Locator;
  readonly closeButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly topicRadioGroup: Locator;

  constructor(page: Page) {
    this.page = page;

    this.initiativeNameTextarea = this.page.locator("#initiative_name");
    this.closeButton = this.page.getByRole("button", { name: "Close" });
    this.saveButton = this.page.getByRole("button", { name: "Save" });
    this.cancelButton = this.page.getByRole("button", { name: "Cancel" });
    this.topicRadioGroup = this.page.locator('[role="radiogroup"]');
  }

  async fillInitiativeName(name: string): Promise<void> {
    await this.initiativeNameTextarea.fill(name);
  }

  async selectTopicByText(partialText: string): Promise<void> {
    const label = this.topicRadioGroup
      .locator("label")
      .filter({ hasText: partialText })
      .first();
    await label.click();
  }
}
