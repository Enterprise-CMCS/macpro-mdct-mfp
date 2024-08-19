import { expect, Locator, Page } from "@playwright/test";
import { currentYear } from "../../seeds/helpers";

export class WPDashboardPage {
  public path = "/wp";

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/WP/PR") && response.status() == 200
    );
    const table = this.page.getByRole("table");

    return expect(table).toContainText("Submission name");
  }

  public async createWorkPlanPeriod1() {
    await this.page
      .getByRole("button", { name: "Enter Work Plan online" })
      .click();

    this.page.waitForResponse("**/reports/WP/PR");

    const createButton = await this.page.getByRole("button", {
      name: "Start MFP Work Plan",
    });

    await createButton.click();

    await expect(this.page.getByRole("dialog")).toBeVisible();
    await expect(this.page.getByRole("dialog")).toContainText(
      "Add new MFP Work Plan"
    );

    await this.page.getByLabel(`${currentYear}`).click();
    await this.page
      .getByLabel(`First reporting period (January 1 - June 30)`)
      .click();
    await this.page.getByRole("button", { name: "Start new" }).click();

    await expect(
      this.page.getByText(`Puerto Rico MFP Work Plan ${currentYear} - Period 1`)
    ).toBeVisible();
  }
}

export class WPGeneralInformationPage {
  public path = "/wp/general-information";

  readonly page: Page;
  readonly continueButton: Locator;
  readonly disclosure: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.disclosure = page.getByText("PRA Disclosure Statement");
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async continue() {
    await this.continueButton.click();
  }

  public async isReady() {
    return expect(this.disclosure).toBeVisible();
  }
}

export class WPTransitionBenchmarksPage {
  public path = "/wp/transition-benchmarks";

  readonly page: Page;
  readonly continueButton: Locator;
  readonly title: Locator;
  readonly rowOlderPopulations: Locator;
  readonly rowPD: Locator;
  readonly rowIDD: Locator;
  readonly rowMHSUD: Locator;
  readonly saveAndClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.title = page.getByText("Transition Benchmark Projections");
    this.rowOlderPopulations = page
      .getByRole("row")
      .filter({ hasText: "Older adults" });
    this.rowPD = page
      .getByRole("row")
      .filter({ hasText: "Individuals with physical disabilities (PD)" });
    this.rowIDD = page.getByRole("row").filter({
      hasText:
        "Individuals with intellectual and developmental disabilities (I/DD)",
    });
    this.rowMHSUD = page.getByRole("row").filter({
      hasText:
        "Individuals with mental health and substance use disorders (MH/SUD)",
    });
    this.saveAndClose = page.getByRole("button", {
      name: "Save & close",
    });
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }

  public async continue() {
    await this.continueButton.click();
  }

  public async addTargetPopulation() {
    const addButton = this.page.getByRole("button", {
      name: "Add other target population",
    });

    await addButton.click();

    await expect(this.page.getByRole("dialog")).toBeVisible();
    await expect(this.page.getByRole("dialog")).toContainText(
      "Add other target population"
    );
    const input = this.page.getByLabel("Target population name");
    const saveButton = this.page.getByRole("button", { name: "Save" });

    await input.fill("Mock target population");
    await saveButton.click();
  }

  public async getEditButtons() {
    return await this.page.getByRole("button", { name: "Edit" }).all();
  }

  public async fillPopulationApplicable(inputs: Locator) {
    const textInputs = await inputs.all();

    for (const input of textInputs) {
      await input.fill("99");
    }

    await this.saveAndClose.click();
  }
}

export class WPTransitionBenchmarkStrategyPage {
  public path = "/wp/transition-benchmark-strategy";

  readonly page: Page;
  readonly continueButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.title = page.getByText("Transition Benchmark Strategy");
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async continue() {
    await this.continueButton.click();
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }

  public async fillForm() {
    const textInputs = await this.page.locator("textarea").all();

    for (const input of textInputs) {
      await input.fill("Mock form value");
    }
  }
}

export class WPInitiativesInstructionsPage {
  public path = "/wp/state-or-territory-specific-initiatives/instructions";

  readonly page: Page;
  readonly continueButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.title = page.getByText(
      "State or Territory-Specific Initiatives Instructions"
    );
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async continue() {
    await this.continueButton.click();
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }

  public async checkSelfDirectedInitiativesNo() {
    await this.page
      .getByRole("group", {
        name: "Are self-directed initiatives applicable to your state or territory?",
      })
      .getByLabel("No")
      .click();
  }

  public async checkTribalInitiativesNo() {
    await this.page
      .getByRole("group", {
        name: "Are Tribal Initiatives applicable to your state or territory?",
      })
      .getByLabel("No")
      .click();
  }
}

export class WPInitiativesDashboardPage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly continueButton: Locator;
  readonly title: Locator;
  readonly addInitiativeButton: Locator;
  readonly requiredTopics: string[];

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives",
    });
    this.addInitiativeButton = page.getByRole("button", {
      name: "Add initiative",
    });
    this.requiredTopics = [
      "Transitions and transition coordination services",
      "Housing-related supports",
      "Quality measurement and improvement",
    ];
  }

  public async goto() {
    await this.page.goto(this.path);
  }

  public async continue() {
    await this.continueButton.click();
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }

  public async addTopic(topic: string) {
    await this.addInitiativeButton.click();
    const modal = this.page.getByRole("dialog");
    await modal;
    await modal.getByLabel("Initiative name").fill(topic + " title");
    await modal.getByLabel(topic).click();
    await modal.getByRole("button", { name: "Save" }).click();
  }

  public async editTopic(topic: string) {
    const editTopicButton = this.page
      .getByRole("gridcell", { name: topic + " title" })
      .getByLabel("edit button");
    await editTopicButton.click();
  }
}

export class WPInitiativeOverlayPage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly returnButton: Locator;
  readonly sections: string[];

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives",
    });
    this.returnButton = page
      .getByRole("button", { name: "Return to all initiatives" })
      .first();
    this.sections = [
      "I. Define initiative",
      "II. Evaluation plan",
      "III. Funding sources",
      "IV. Initiative close-out information (if applicable)",
    ];
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }

  public async fillDefineInitiative() {
    const initiativeRow = this.page
      .getByRole("row")
      .filter({ hasText: this.sections[0] });

    await initiativeRow.getByRole("button", { name: "edit button" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "State or Territory-Specific Initiatives: " + this.sections[0],
      })
    ).toBeVisible();

    const description = this.page.getByLabel(
      "Describe the initiative, including key activities:"
    );
    const targetPopulations = this.page.getByRole("group", {
      name: "Target population(s):",
    });
    const startDate = this.page.getByLabel("Start date");
    const endDate = this.page.getByRole("group", {
      name: "Does the initiative have a projected end date?",
    });

    await description.fill("Mock text");
    await targetPopulations.getByLabel("Older adults").click();

    await startDate.fill("01/01/2024");
    await endDate.getByLabel("No").click();

    await this.page.getByRole("button", { name: "Save & return" }).click();
  }

  public async fillEvaluationPlan() {
    const initiativeRow = this.page
      .getByRole("row")
      .filter({ hasText: this.sections[1] });

    await initiativeRow.getByRole("button", { name: "edit button" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "State or Territory-Specific Initiatives: " + this.sections[1],
      })
    ).toBeVisible();

    const addObjectiveButton = this.page.getByRole("button", {
      name: "Add objective",
    });

    await addObjectiveButton.click();
    const modal = this.page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Add objective for ");

    // Add an objective with no quantitative targets
    const quantitativeTargets = await modal.getByRole("group", {
      name: "Does the performance measure include quantitative targets?",
    });
    await quantitativeTargets.getByLabel("No").click();
    const textareas = await modal.locator("textarea").all();
    for (const textbox of textareas) {
      await textbox.fill("Mock text");
    }
    await this.page.getByRole("button", { name: "Save" }).click();

    await addObjectiveButton.click();
    for (const textbox of textareas) {
      await textbox.fill("Mock text");
    }

    // Add an objective with quantitative targets
    await quantitativeTargets.getByLabel("Yes").click();
    const textInputs = await this.page.getByRole("textbox").all();

    for (const textInut of textInputs) {
      await textInut.fill("99");
    }
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page
      .getByRole("button", { name: "Return to dashboard for this initiative" })
      .first()
      .click();
  }

  public async fillFundingSources() {
    const initiativeRow = this.page
      .getByRole("row")
      .filter({ hasText: this.sections[2] });

    await initiativeRow.getByRole("button", { name: "edit button" }).click();
    await expect(
      this.page.getByRole("heading", {
        name: "State or Territory-Specific Initiatives: " + this.sections[2],
      })
    ).toBeVisible();

    const addFundingSourceButton = this.page.getByRole("button", {
      name: "Add funding source",
    });

    await addFundingSourceButton.click();
    const modal = this.page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(
      "Add funding source and projected expenditures for "
    );

    const fundingSource = await modal.getByRole("group", {
      name: "Funding source:",
    });
    await fundingSource
      .getByLabel(
        "MFP cooperative agreement funds for qualified HCBS and demonstration services"
      )
      .click();

    const textInputs = await modal.getByRole("textbox").all();

    for (const textInut of textInputs) {
      await textInut.fill("99");
    }

    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page
      .getByRole("button", { name: "Return to dashboard for this initiative" })
      .first()
      .click();
  }
}

export class WPReviewSubmitPage {
  public path = "/wp/review-and-submit";

  readonly page: Page;
  readonly title: Locator;
  readonly reviewPDFButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByRole("heading", {
      name: "Review & Submit",
    });
    this.reviewPDFButton = page.getByRole("link", { name: "Review PDF" });
    this.submitButton = page.getByRole("button", {
      name: "Submit MFP Work Plan",
    });
  }

  public async isReady() {
    return expect(this.title).toBeVisible();
  }
}
