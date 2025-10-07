import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";
import { currentDate } from "../../consts";
import AddObjectiveDialog from "../dialogs/addObjectiveDialog.page";

export default class InitiativesSpecificEditPage extends BasePage {
  readonly returnButton: Locator;
  readonly defineInitiativeEditButton: Locator;
  readonly evaluationPlanEditButton: Locator;
  readonly fundingSourcesEditButton: Locator;
  readonly defineInitiative: DefineInitiativeElements;
  readonly evaluationPlan: EvaluationPlanElements;
  readonly fundingSources: FundingSourcesElements;

  constructor(page: Page) {
    super(page);
    this.returnButton = page.getByRole("button", {
      name: "Return to all initiatives",
    });
    this.defineInitiativeEditButton = page
      .getByRole("button", { name: "Edit", exact: true })
      .first();
    this.evaluationPlanEditButton = page
      .getByRole("button", { name: "Edit", exact: true })
      .nth(1);
    this.fundingSourcesEditButton = page
      .getByRole("button", { name: "Edit", exact: true })
      .nth(2);
    this.defineInitiative = new DefineInitiativeElements(page);
    this.evaluationPlan = new EvaluationPlanElements(page);
    this.fundingSources = new FundingSourcesElements(page);
  }
}

export class DefineInitiativeElements {
  readonly page: Page;
  readonly returnToDashboardButton: Locator;
  readonly describeInitiativeTextarea: Locator;
  readonly targetPopulations: {
    readonly olderAdults: Locator;
    readonly physicalDisabilities: Locator;
    readonly intellectualDevelopmental: Locator;
    readonly mentalHealthSubstanceUse: Locator;
    readonly hcbsInfrastructure: Locator;
  };
  readonly startDateInput: Locator;
  readonly projectedEndDate: {
    readonly yes: Locator;
    readonly no: Locator;
  };
  readonly saveAndReturnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.returnToDashboardButton = page.getByRole("button", {
      name: "Return to dashboard for this initiative",
    });
    this.describeInitiativeTextarea = page.getByRole("textbox", {
      name: "Describe the initiative, including key activities:",
    });

    this.targetPopulations = {
      olderAdults: page.getByRole("checkbox", { name: "Older adults" }),
      physicalDisabilities: page.getByRole("checkbox", {
        name: "Individuals with physical disabilities (PD)",
      }),
      intellectualDevelopmental: page.getByRole("checkbox", {
        name: "Individuals with intellectual and developmental disabilities (I/DD)",
      }),
      mentalHealthSubstanceUse: page.getByRole("checkbox", {
        name: "Individuals with mental health and substance use disorders (MH/SUD)",
      }),
      hcbsInfrastructure: page.getByRole("checkbox", {
        name: "HCBS infrastructure/system-level development",
      }),
    };

    this.startDateInput = page.getByRole("textbox", { name: "Start date" });

    this.projectedEndDate = {
      yes: page.getByRole("radio", { name: "Yes" }),
      no: page.getByRole("radio", { name: "No" }),
    };

    this.saveAndReturnButton = page.getByRole("button", {
      name: "Save & return",
    });
  }

  async selectTargetPopulations(populations: string[]) {
    for (const population of populations) {
      const checkbox = this.page.getByRole("checkbox", {
        name: new RegExp(population, "i"),
      });
      await checkbox.check();
    }
  }

  async setProjectedEndDate(hasEndDate: boolean, startDate?: string) {
    if (hasEndDate) {
      await this.projectedEndDate.yes.check();
      await this.startDateInput.fill(startDate || currentDate);
    } else {
      await this.projectedEndDate.no.check();
    }
  }
}

export class EvaluationPlanElements {
  readonly page: Page;
  readonly returnToDashboardButton: Locator;
  readonly addObjectiveButton: Locator;
  readonly saveAndReturnButton: Locator;
  readonly addObjectiveDialog: AddObjectiveDialog;

  constructor(page: Page) {
    this.page = page;
    this.returnToDashboardButton = page.getByRole("button", {
      name: "Return to dashboard for this initiative",
    });
    this.addObjectiveButton = page.getByRole("button", {
      name: "Add objective",
    });
    this.saveAndReturnButton = page.getByRole("button", {
      name: "Save & return",
    });
    this.addObjectiveDialog = new AddObjectiveDialog(page);
  }
}

export class FundingSourcesElements {
  readonly page: Page;
  readonly returnToDashboardButton: Locator;
  readonly addFundingSourceButton: Locator;
  readonly saveAndReturnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.returnToDashboardButton = page.getByRole("button", {
      name: "Return to dashboard for this initiative",
    });
    this.addFundingSourceButton = page.getByRole("button", {
      name: "Add funding source",
    });
    this.saveAndReturnButton = page.getByRole("button", {
      name: "Save & return",
    });
  }
}
