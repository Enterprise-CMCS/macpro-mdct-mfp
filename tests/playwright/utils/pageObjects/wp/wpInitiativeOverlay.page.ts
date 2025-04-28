import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";
import { WPDefineInitiativePage } from "./wpInitiativeDefine.page";
import { WPEvaluationPlanPage } from "./wpInitiativeEvaluation.page";
import { WPFundingSourcesPage } from "./wpInitiativeFunding.page";

export class WPInitiativeOverlayPage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly backButton: Locator;
  readonly defineInitiative: Locator;
  readonly evaluationPlan: Locator;
  readonly fundingSources: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives",
    });
    this.backButton = page
      .getByRole("button", { name: "Return to all initiatives" })
      .first();
    this.defineInitiative = page.getByRole("row", {
      name: "I. Define initiative",
    });
    this.evaluationPlan = page.getByRole("row", {
      name: "II. Evaluation plan",
    });
    this.fundingSources = page.getByRole("row", {
      name: "III. Funding sources",
    });
  }

  public async completeDefineInitiative(page: Page) {
    await this.defineInitiative.getByRole("button", { name: "Edit" }).click();
    const definePage = new WPDefineInitiativePage(page);
    await definePage.isReady();
    await definePage.fillFields();
    await definePage.saveButton.click();
  }

  public async completeEvaluationPlan(page: Page) {
    await this.evaluationPlan.getByRole("button", { name: "Edit" }).click();
    const evaluationPage = new WPEvaluationPlanPage(page);
    await evaluationPage.isReady();
    const noObjectivesText = evaluationPage.page.getByText(
      "Objective total count: 0"
    );
    if (noObjectivesText) {
      await evaluationPage.addObjectiveButton.click();
      await evaluationPage.fillFields();
    }
    await evaluationPage.backButton.click();
  }

  public async completeFundingSources(page: Page) {
    await this.fundingSources.getByRole("button", { name: "Edit" }).click();
    const fundingPage = new WPFundingSourcesPage(page);
    await fundingPage.isReady();
    const noFundingSourcesText =
      fundingPage.page.getByText("Funding Sources: 0");
    if (noFundingSourcesText) {
      await fundingPage.addSourceButton.click();
      await fundingPage.fillFields();
    }
    await fundingPage.backButton.click();
  }
}
