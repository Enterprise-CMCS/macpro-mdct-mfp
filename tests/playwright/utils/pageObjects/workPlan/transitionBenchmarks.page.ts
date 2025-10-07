import { Page, Locator } from "@playwright/test";
import BasePage from "../base.page";
import BaseDialog from "../dialogs/baseDialog.page";
import {
  TransitionBenchmarkQuarter,
  TransitionBenchmarks,
} from "../../types.ts";

export default class TransitionBenchmarksPage extends BasePage {
  public path = "/wp/transition-benchmarks";
  readonly editButton: Locator;
  readonly transitionBenchmarkDialog: BaseDialog;

  constructor(page: Page) {
    super(page);
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.transitionBenchmarkDialog = new BaseDialog(
      page,
      'div[id="wp-tbp-dialog"]'
    );
  }

  async clickEditButton(targetPopulation: string): Promise<void> {
    const row = this.page.getByRole("row").filter({
      hasText: new RegExp(targetPopulation),
    });
    await row.waitFor({ state: "visible" });
    await row.getByRole("button", { name: "edit button" }).click();
  }

  async editDialog(
    targetPopulation: string,
    applicable: boolean,
    quarterData: TransitionBenchmarkQuarter[]
  ): Promise<void> {
    await this.clickEditButton(targetPopulation);
    await this.transitionBenchmarkDialog.selectApplicable(applicable);
    if (applicable) {
      for (const { quarter, value } of quarterData) {
        await this.fillQuarterProjection(value, quarter);
      }
    }
    await this.transitionBenchmarkDialog.save();
  }

  // quarter argument needs to be passed in as "2025Q1"
  async fillQuarterProjection(value: string, quarter: string): Promise<void> {
    const quarterField = this.page.locator(`input[id="${quarter}"]`);
    await quarterField.waitFor({ state: "visible" });
    await quarterField.fill(value);
  }

  async fillAllQuarterProjections(
    transitionBenchmarks: TransitionBenchmarks[]
  ): Promise<void> {
    for (const { benchmarkName, isActive, quarters } of transitionBenchmarks) {
      await this.editDialog(benchmarkName, isActive, quarters);
    }
  }

  async completeTransitionBenchmarks(
    transitionBenchmarks: TransitionBenchmarks[]
  ): Promise<void> {
    await this.fillAllQuarterProjections(transitionBenchmarks);
    await this.continueButton.click();
  }
}
