import { Locator, Page } from "@playwright/test";
import { requiredWorkPlanTopics, quarters, WorkPlan } from "../../utils/consts";

export class StatePage {
  readonly page: Page;
  readonly addNewWorkPlanModal: Locator;
  readonly wpDataRows: Locator;
  readonly startDateInput: Locator;
  readonly saveAndReturnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addNewWorkPlanModal = this.page.getByRole("dialog", {
      name: "Add new MFP Work Plan",
    });
    this.wpDataRows = this.page
      .getByRole("table")
      .getByRole("row")
      .filter({
        has: this.page.getByRole("cell"),
      });
    this.startDateInput = this.page.getByRole("textbox", {
      name: "Start date",
    });
    this.saveAndReturnButton = this.page.getByRole("button", {
      name: "Save & return",
    });
  }

  async selectReportYear(year: number | string) {
    await this.addNewWorkPlanModal
      .locator(`input[name="reportPeriodYear"][value="${year}"]`)
      .click();
  }

  async selectReportingPeriod(period: string) {
    await this.addNewWorkPlanModal
      .locator(`input[name="reportPeriod"][value*="${period}"]`)
      .click();
  }

  async startNewWorkPlan(year: number | string, period: string) {
    await this.page
      .getByRole("button", { name: "Start MFP Work Plan" })
      .click();
    await this.page
      .getByRole("dialog", { name: "Add new MFP Work Plan" })
      .waitFor();
    await this.selectReportYear(year);
    await this.selectReportingPeriod(period);
    const postResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/WP/") &&
        response.request().method() === "POST" &&
        response.status() === 201
    );
    const getResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/WP/") &&
        response.request().method() === "GET" &&
        response.status() === 200
    );
    this.addNewWorkPlanModal.getByRole("button", { name: "Start new" }).click();
    await Promise.all([postResp, getResp]);
  }

  // Transition Benchmarks page functionality
  async clickEditBenchmarkButton(targetPopulation: string) {
    const row = this.page.getByRole("row").filter({
      hasText: new RegExp(targetPopulation),
    });
    await row.waitFor({ state: "visible" });
    await row.getByRole("button", { name: `Edit ${targetPopulation}` }).click();
  }

  async editTransitionBenchmarkProjection(
    targetPopulation: string,
    applicable: boolean,
    quarterValues: string[]
  ) {
    await this.clickEditBenchmarkButton(targetPopulation);
    const benchmarkDialog = this.page.getByRole("dialog");
    const overlay = this.page.locator(".chakra-modal__overlay");
    await benchmarkDialog.waitFor({ state: "visible" });
    await overlay.waitFor({ state: "visible" });

    if (applicable) {
      await benchmarkDialog.getByRole("radio", { name: "Yes" }).click();
      for (let i = 0; i < quarterValues.length && i < quarters.length; i++) {
        await this.fillQuarterProjection(quarterValues[i], quarters[i]);
      }
    } else {
      await benchmarkDialog.getByRole("radio", { name: "No" }).click();
    }
    const putResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await benchmarkDialog.getByRole("button", { name: "Save & close" }).click();
    await putResp;
    await benchmarkDialog.waitFor({ state: "detached" });
    await this.page
      .locator(".chakra-modal__overlay")
      .waitFor({ state: "detached" });
  }

  async fillQuarterProjection(value: string, quarter: string) {
    const quarterField = this.page.locator(
      `input[name="quarterlyProjections${quarter}"]`
    );
    await quarterField.waitFor({ state: "visible" });
    await quarterField.fill(value);
  }

  async fillAllQuarterProjections(
    transitionBenchmarks: {
      benchmarkName: string;
      isActive: boolean;
      quarterValues: string[];
    }[]
  ) {
    for (const {
      benchmarkName,
      isActive,
      quarterValues,
    } of transitionBenchmarks) {
      await this.editTransitionBenchmarkProjection(
        benchmarkName,
        isActive,
        quarterValues
      );
    }
  }

  async completeTransitionBenchmarkProjections(
    transitionBenchmarks: {
      benchmarkName: string;
      isActive: boolean;
      quarterValues: string[];
    }[]
  ) {
    await this.fillAllQuarterProjections(transitionBenchmarks);
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  // Transition Benchmark Strategy page functionality
  async completeTransitionBenchmarkStrategy(
    explanation: string,
    additionalDetails: string
  ) {
    await this.page.locator("#strategy_explaination").fill(explanation);
    await this.page
      .locator("#strategy_additionalDetails")
      .fill(additionalDetails);
    const putResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await this.page.getByRole("button", { name: "Continue" }).click();
    await putResp;
    await this.page.waitForURL(
      "**/wp/state-or-territory-specific-initiatives/instructions"
    );
  }

  // Initiatives Instructions page functionality
  async selectSelfDirectedInitiatives(option: boolean) {
    if (option) {
      await this.page.getByRole("radio", { name: "Yes" }).first().click();
    } else {
      await this.page.getByRole("radio", { name: "No" }).first().click();
    }
  }

  async selectTribalInitiatives(option: boolean) {
    if (option) {
      await this.page.getByRole("radio", { name: "Yes" }).last().click();
    } else {
      await this.page.getByRole("radio", { name: "No" }).last().click();
    }
  }

  async completeInitiativesInstructions(
    selfDirectedOption: boolean,
    tribalOption: boolean
  ) {
    await this.selectSelfDirectedInitiatives(selfDirectedOption);
    await this.selectTribalInitiatives(tribalOption);
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  // Initiatives Specific page functionality
  async addInitiative(initiativeName: string, topic: string) {
    await this.page.getByRole("button", { name: "Add initiative" }).click();
    const addInitiativeDialog = this.page.getByRole("dialog", {
      name: "Add initiative",
    });
    await addInitiativeDialog.waitFor({ state: "visible" });
    await addInitiativeDialog.locator("#initiative_name").fill(initiativeName);
    await addInitiativeDialog
      .locator('[role="radiogroup"]')
      .locator("label")
      .filter({ hasText: topic })
      .first()
      .click();
    const putResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await addInitiativeDialog.getByRole("button", { name: "Save" }).click();
    await putResp;
    await addInitiativeDialog.waitFor({ state: "detached" });
  }

  async addInitiatives(initiatives: { name: string; topic: string }[]) {
    for (const required of initiatives) {
      await this.addInitiative(required.name, required.topic);
    }
  }

  async clickEditInitiative(initiativeName: string) {
    const row = this.page.locator("tr").filter({ hasText: initiativeName });
    await row.getByRole("button", { name: `Edit ${initiativeName}` }).click();
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
      await this.page.getByRole("radio", { name: "Yes" }).check();
      if (startDate) {
        await this.startDateInput.fill(startDate);
      }
    } else {
      await this.page.getByRole("radio", { name: "No" }).check();
    }
  }

  async editDefineInitiativeSection(
    description: string,
    targetPopulations: string[],
    startDate: string,
    hasProjectedEndDate: boolean = false
  ) {
    await this.clickInitiativeSectionEditBtn("Define initiative");
    await this.page
      .getByRole("textbox", {
        name: "Describe the initiative, including key activities:",
      })
      .fill(description);
    await this.selectTargetPopulations(targetPopulations);
    await this.startDateInput.fill(startDate);
    await this.setProjectedEndDate(hasProjectedEndDate, startDate);
    await this.saveAndReturnButton.click();
  }

  async editSpecificInitiative(topic: {
    name: string;
    description: string;
    targetPopulations: string[];
    startDate: string;
    hasProjectedEndDate: boolean;
    evaluationPlan: {
      objective: string;
      description: string;
      targets: string;
      quantitativeTargets: boolean;
      additionalDetails: string;
    };
    fundingSources: { source: string; values: string[] };
  }) {
    await this.clickEditInitiative(topic.name);
    await this.editDefineInitiativeSection(
      topic.description,
      topic.targetPopulations,
      topic.startDate,
      topic.hasProjectedEndDate
    );
    await this.editEvaluationPlanSection(
      topic.evaluationPlan.objective,
      topic.evaluationPlan.description,
      topic.evaluationPlan.targets,
      topic.evaluationPlan.quantitativeTargets,
      topic.evaluationPlan.additionalDetails
    );
    await this.editFundingSourcesSection(
      topic.fundingSources.source,
      topic.fundingSources.values
    );
    await this.saveAndReturnButton.click();
    await this.page
      .getByRole("button", { name: "Return to all initiatives" })
      .nth(1)
      .click();
  }

  // Evaluation Plan section
  async editEvaluationPlanSection(
    objective: string,
    description: string,
    targets: string,
    quantitativeTargets: boolean,
    additionalDetails: string
  ) {
    await this.clickInitiativeSectionEditBtn("Evaluation plan");
    await this.page.getByRole("button", { name: "Add objective" }).click();
    await this.page
      .getByRole("textbox", { name: "Objective", exact: true })
      .fill(objective);
    await this.page.locator("#evaluationPlan_description").fill(description);
    await this.page.locator("#evaluationPlan_targets").fill(targets);

    if (quantitativeTargets) {
      await this.page.getByRole("radio", { name: "Yes" }).check();
    } else {
      await this.page.getByRole("radio", { name: "No" }).check();
    }

    await this.page
      .locator("#evaluationPlan_additionalDetails")
      .fill(additionalDetails);
    await this.page.getByRole("button", { name: "Save", exact: true }).click();
    await this.saveAndReturnButton.click();
  }

  async editFundingSourcesSection(
    fundingSource: string,
    fundingSourcesData: string[]
  ) {
    await this.clickInitiativeSectionEditBtn("Funding sources");
    await this.page.getByRole("button", { name: "Add funding source" }).click();
    const addFundingSourceDialog = this.page.getByRole("dialog", {
      name: "Add funding source and projected expenditures",
    });
    await addFundingSourceDialog.waitFor({ state: "visible" });
    await addFundingSourceDialog
      .getByRole("radio", { name: new RegExp(fundingSource, "i") })
      .check();
    for (let i = 0; i < fundingSourcesData.length && i < quarters.length; i++) {
      await this.fillQuarterFundingSources(fundingSourcesData[i], quarters[i]);
    }
    const putResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await addFundingSourceDialog.getByRole("button", { name: "Save" }).click();
    await putResp;
  }

  async fillQuarterFundingSources(value: string, quarter: string) {
    const quarterField = this.page.locator(
      `input[name="fundingSources_quarters${quarter}"]`
    );
    await quarterField.waitFor({ state: "visible" });
    await quarterField.fill(value);
  }

  async clickInitiativeSectionEditBtn(initiativeSection: string) {
    await this.page
      .getByRole("row")
      .filter({ hasText: initiativeSection })
      .getByRole("button", { name: "Edit" })
      .click();
  }

  async fillWorkPlan(workPlan: WorkPlan) {
    await this.page.getByRole("button", { name: "Edit" }).click();
    const putResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "PUT" &&
        response.status() === 200
    );
    await this.page.getByRole("button", { name: "Continue" }).click();
    await putResponse;
    await this.completeTransitionBenchmarkProjections(
      workPlan.transitionBenchmarkProjections
    );
    await this.completeTransitionBenchmarkStrategy(
      workPlan.transitionBenchmarkStrategy.explanation,
      workPlan.transitionBenchmarkStrategy.additionalDetails
    );
    await this.completeInitiativesInstructions(
      workPlan.initiativesInstructions.selfDirected,
      workPlan.initiativesInstructions.tribal
    );
    await this.addInitiatives(requiredWorkPlanTopics);
    await this.editSpecificInitiative(workPlan.initiatives[0]);
    await this.editSpecificInitiative(workPlan.initiatives[1]);
    await this.editSpecificInitiative(workPlan.initiatives[2]);
    await this.page.getByRole("button", { name: "Continue" }).click();
  }

  async submitWorkPlan() {
    await this.page
      .getByRole("button", { name: "Submit MFP Work Plan" })
      .click();
    const submitDialog = this.page.getByRole("dialog", {
      name: "Are you sure you want to submit MFP Work Plan?",
    });
    await submitDialog.waitFor({ state: "visible" });
    const postResp = this.page.waitForResponse(
      (response) =>
        response.url().includes("/reports/") &&
        response.request().method() === "POST" &&
        response.status() === 200
    );
    await submitDialog
      .getByRole("button", { name: "Submit MFP Work Plan" })
      .click();
    await postResp;
  }
}
