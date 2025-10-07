import BasePage from "../base.page";
import { Locator, Page } from "@playwright/test";
import { AddInitiativeDialog } from "../dialogs/addInitiativeDialog.page";
import InitiativesSpecificEditPage from "./initiativesSpecificEdit.page";

export default class InitiativesSpecificPage extends BasePage {
  public path = `/wp/state-or-territory-specific-initiatives/initiatives`;
  readonly addInitiativeButton: Locator;
  readonly previousButton: Locator;
  readonly continueButton: Locator;
  readonly previousPageLink: Locator;
  readonly addInitiativeDialog: AddInitiativeDialog;
  readonly editPage: InitiativesSpecificEditPage;

  constructor(page: Page) {
    super(page);

    this.addInitiativeButton = this.page.getByRole("button", {
      name: "Add initiative",
    });
    this.addInitiativeDialog = new AddInitiativeDialog(page);
    this.editPage = new InitiativesSpecificEditPage(page);
    this.previousButton = this.page.getByRole("button", { name: "Previous" });
    this.continueButton = this.page.getByRole("button", { name: "Continue" });
    this.previousPageLink = this.page.getByRole("link", {
      name: "previous page",
    });
  }

  async addInitiative(initiativeName: string, topic: string): Promise<void> {
    await this.addInitiativeButton.click();
    await this.addInitiativeDialog.fillInitiativeName(initiativeName);
    await this.addInitiativeDialog.selectTopicByText(topic);
    await this.addInitiativeDialog.saveButton.click();
  }

  async addInititives(
    initiatives: { name: string; topic: string }[]
  ): Promise<void> {
    for (const required of initiatives) {
      await this.addInitiative(required.name, required.topic);
    }
  }

  async clickEditInitiative(initiativeName: string): Promise<void> {
    const row = this.page.locator("tr").filter({ hasText: initiativeName });
    await row.getByRole("button", { name: "Edit" }).click();
  }

  async editDefineInitiativeSection(
    description: string,
    targetPopulations: string[],
    startDate: string,
    hasProjectedEndDate: boolean = false
  ): Promise<void> {
    await this.editPage.defineInitiativeEditButton.click();
    await this.editPage.defineInitiative.describeInitiativeTextarea.fill(
      description
    );
    await this.editPage.defineInitiative.selectTargetPopulations(
      targetPopulations
    );
    await this.editPage.defineInitiative.startDateInput.fill(startDate);
    await this.editPage.defineInitiative.setProjectedEndDate(
      hasProjectedEndDate
    );
    await this.editPage.defineInitiative.saveAndReturnButton.click();
  }

  async editEvaluationPlanSection(
    objective: string,
    description: string,
    targets: string,
    quantitiveTargets: boolean,
    additionalDetails: string
  ): Promise<void> {
    await this.editPage.evaluationPlanEditButton.click();
    await this.editPage.evaluationPlan.addObjectiveButton.click();
    await this.editPage.evaluationPlan.addObjectiveDialog.objectiveTextarea.fill(
      objective
    );
    await this.editPage.evaluationPlan.addObjectiveDialog.descriptionTextarea.fill(
      description
    );
    await this.editPage.evaluationPlan.addObjectiveDialog.targetsTextarea.fill(
      targets
    );
    await this.editPage.evaluationPlan.addObjectiveDialog.includeQuantitativeTargets(
      quantitiveTargets
    );
    await this.editPage.evaluationPlan.addObjectiveDialog.additionalDetailsTextarea.fill(
      additionalDetails
    );
    await this.editPage.evaluationPlan.addObjectiveDialog.saveButton.click();
    await this.editPage.evaluationPlan.saveAndReturnButton.click();
  }

  async editFundingSourcesSection(): Promise<void> {
    await this.editPage.fundingSourcesEditButton.click();
    await this.editPage.fundingSources.addFundingSourceButton.click();
    await this.editPage.fundingSources.saveAndReturnButton.click();
  }
}
