import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPEvaluationPlanPage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly backButton: Locator;
  readonly addObjectiveButton: Locator;
  readonly modal: Locator;

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
    this.addObjectiveButton = page
      .getByRole("button", {
        name: "Add objective",
      })
      .first();
    this.modal = page.getByRole("dialog");
  }

  public async fillFields() {
    const modal = this.page.getByRole("dialog");
    const textAreas = await modal.getByRole("textbox").all();
    const radioGroup = await modal.getByRole("group", {
      name: "Does the performance measure include quantitative targets?",
    });

    // Fill all the text boxes in the modal
    for (const textArea of textAreas) {
      await textArea.fill("test");
    }

    // Click the "No" radio option so we don't have to fill out conditional fields
    await radioGroup.getByLabel("No").click();
    await modal.getByRole("button", { name: "Save" }).click();
    await expect(this.page.getByRole("alert")).not.toBeVisible();
    await modal.isHidden();
  }
}
