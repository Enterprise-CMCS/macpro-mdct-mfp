import { Page, Locator } from "@playwright/test";
import BasePage from "../base.page";

export default class InitiativesInstructionsPage extends BasePage {
  public path = "/wp/state-territory-specific-initiatives-instructions";
  readonly pageTitle: Locator;
  readonly selfDirectedInitiativesYes: Locator;
  readonly selfDirectedInitiativesNo: Locator;
  readonly tribalInitiativesYes: Locator;
  readonly tribalInitiativesNo: Locator;
  readonly selfDirectedInitiativesFieldset: Locator;
  readonly tribalInitiativesFieldset: Locator;
  readonly previousButton: Locator;
  readonly continueButton: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives Instructions",
    });
    this.selfDirectedInitiativesYes = page
      .getByRole("radio", { name: "Yes" })
      .first();
    this.selfDirectedInitiativesNo = page
      .getByRole("radio", { name: "No" })
      .first();
    this.tribalInitiativesYes = page.getByRole("radio", { name: "Yes" }).last();
    this.tribalInitiativesNo = page.getByRole("radio", { name: "No" }).last();
    this.selfDirectedInitiativesFieldset = page.getByRole("radiogroup", {
      name: "Are self-directed initiatives applicable to your state or territory?",
    });
    this.tribalInitiativesFieldset = page.getByRole("radiogroup", {
      name: "Are Tribal Initiatives applicable to your state or territory?",
    });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.form = page.locator("#sdii");
  }

  async selectSelfDirectedInitiatives(option: boolean) {
    if (option) {
      await this.selfDirectedInitiativesYes.click();
    } else {
      await this.selfDirectedInitiativesNo.click();
    }
  }

  async selectTribalInitiatives(option: boolean) {
    if (option) {
      await this.tribalInitiativesYes.click();
    } else {
      await this.tribalInitiativesNo.click();
    }
  }

  async completeInitiativesInstructions(
    selfDirectedOption: boolean,
    tribalOption: boolean
  ): Promise<void> {
    await this.selectSelfDirectedInitiatives(selfDirectedOption);
    await this.selectTribalInitiatives(tribalOption);
    await this.continueButton.click();
  }
}
