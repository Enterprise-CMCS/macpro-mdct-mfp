import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPTransitionBenchmarkStrategyPage extends BasePage {
  public path = "/wp/transition-benchmark-strategy";

  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Transition Benchmark Projections",
    });
  }

  public async fillTextFields() {
    const textFields = await this.page.getByRole("textbox").all();

    for (const textField of textFields) {
      await textField.fill("test");
    }
  }
}
