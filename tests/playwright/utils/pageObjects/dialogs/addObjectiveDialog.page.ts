import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class AddObjectiveDialog extends BasePage {
  readonly objectiveTextarea: Locator;
  readonly descriptionTextarea: Locator;
  readonly targetsTextarea: Locator;
  readonly quantitativeTargetsNo: Locator;
  readonly quantitativeTargetsYes: Locator;
  readonly additionalDetailsTextarea: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.objectiveTextarea = page.locator("#evaluationPlan_objectiveName");
    this.descriptionTextarea = page.locator("#evaluationPlan_description");
    this.targetsTextarea = page.locator("#evaluationPlan_targets");
    this.quantitativeTargetsNo = page.getByRole("radio", { name: "No" });
    this.quantitativeTargetsYes = page.getByRole("radio", { name: "Yes" });
    this.additionalDetailsTextarea = page.locator(
      "#evaluationPlan_additionalDetails"
    );
    this.saveButton = page.getByTestId("modal-submit-button");
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.closeButton = page.getByRole("button", { name: "Close" });
  }

  async includeQuantitativeTargets(include: boolean): Promise<void> {
    if (include) {
      await this.quantitativeTargetsYes.click();
    } else {
      await this.quantitativeTargetsNo.click();
    }
  }
}

export default AddObjectiveDialog;
