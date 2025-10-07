import { Page, Locator } from "@playwright/test";

export default class BaseDialog {
  readonly page: Page;
  readonly dialog: Locator;
  readonly closeButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly applicableYesRadio: Locator;
  readonly applicableNoRadio: Locator;

  constructor(page: Page, dialogSelector?: string) {
    this.page = page;
    this.dialog = dialogSelector
      ? page.locator(dialogSelector)
      : page.getByRole("dialog");

    this.closeButton = this.dialog.locator(
      ".chakra-modal__header button:has(svg.ds-c-icon--close)"
    );
    this.cancelButton = this.dialog.getByRole("button", { name: "Cancel" });
    this.saveButton = this.dialog.getByRole("button", { name: "Save & close" });
    this.applicableYesRadio = this.dialog.getByRole("radio", { name: "Yes" });
    this.applicableNoRadio = this.dialog.getByRole("radio", { name: "No" });
  }

  async waitForOpen(): Promise<void> {
    await this.dialog.waitFor({ state: "visible" });
  }

  async waitForClose(): Promise<void> {
    await this.dialog.waitFor({ state: "hidden" });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.waitForClose();
  }

  async selectApplicable(applicable: boolean): Promise<void> {
    if (applicable) {
      await this.applicableYesRadio.click();
    } else {
      await this.applicableNoRadio.click();
    }
  }
}
