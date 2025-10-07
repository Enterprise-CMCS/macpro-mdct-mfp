import { Page, Locator } from "@playwright/test";
import BasePage from "../base.page";

export default class TransitionBenchmarkStrategyPage extends BasePage {
  public path = "/wp/transition-benchmark-strategy";
  readonly page: Page;
  readonly strategyExplanationField: Locator;
  readonly strategyAdditionalDetailsField: Locator;
  readonly previousButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.strategyExplanationField = page.locator("#strategy_explaination");
    this.strategyAdditionalDetailsField = page.locator(
      "#strategy_additionalDetails"
    );
    this.previousButton = page.locator('button:has-text("Previous")');
    this.continueButton = page.locator(
      'button[form="tbs"]:has-text("Continue")'
    );
  }

  async completeTransitionBenchmarkStrategy(
    strategyExplanation: string,
    strategyAdditionalDetails: string
  ): Promise<void> {
    await this.strategyExplanationField.fill(strategyExplanation);
    await this.strategyAdditionalDetailsField.fill(strategyAdditionalDetails);
    await this.continueButton.click();
  }
}
