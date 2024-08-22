import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPReviewAndSubmitPage extends BasePage {
  public path = "/wp/review-and-submit";

  readonly page: Page;
  readonly title: Locator;
  readonly reviewPDFButton: Locator;
  readonly submitButton: Locator;
  readonly approveButton: Locator;
  readonly unlockButton: Locator;
  readonly approveModal: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", { name: "Review & Submit" });
    this.reviewPDFButton = page.getByRole("button", { name: "Review PDF" });
    this.approveButton = page.getByRole("button", { name: "Approve" });
    this.unlockButton = page.getByRole("button", { name: "Unlock" });
    this.approveModal = page.getByRole("dialog", {
      name: "Are you sure you want to approve this MFP Work Plan?",
    });
  }

  public async approveReport() {
    await this.approveModal.getByRole("textbox").fill("APPROVE");
    await this.approveModal.getByRole("button", { name: "Approve" }).click();
  }
}
