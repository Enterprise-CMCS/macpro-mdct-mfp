import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPTransitionBenchmarkProjectionsPage extends BasePage {
  public path = "/wp/transition-benchmarks";

  readonly page: Page;
  readonly title: Locator;
  readonly addNewButton: Locator;
  readonly reviewPdfButton: Locator;
  readonly drawer: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Transition Benchmark Projections",
    });
    this.addNewButton = page.getByRole("button", {
      name: "Add other target population",
    });
    this.reviewPdfButton = page.getByRole("button", { name: "Review PDF" });
    this.drawer = page.locator("dialog", {
      hasText: "Report transition benchmarks for",
    });
  }

  public async getIncompletePopulations() {
    const warningIcon = await this.page.getByAltText("warning icon");
    const warnings = await this.page
      .getByRole("row")
      .filter({ has: warningIcon })
      .all();

    return warnings;
  }

  public async editPopulations() {
    const populations = await this.getIncompletePopulations();

    if (populations.length > 0) {
      for (const [index, population] of populations.entries()) {
        const editButton = population.getByLabel("edit button");
        await editButton.click();
        const drawer = this.page.getByRole("dialog");
        await drawer.isVisible();

        // Fill out benchmarks for just one population for the sake of brevity
        if (index === 0) {
          await drawer.getByLabel("Yes").click();
          await this.fillBenchmarks();
        } else {
          await drawer.getByLabel("No").click();
        }

        await drawer.getByRole("button", { name: "Save & Close" }).click();
        await drawer.waitFor({ state: "hidden" });
        await this.editPopulations();
      }
    }
  }

  public async fillBenchmarks() {
    const drawer = this.page.getByRole("dialog");
    await drawer.getByLabel("Yes").click();
    const inputs = await drawer.getByRole("textbox").all();
    for (const input of inputs) {
      await input.fill("99");
    }
  }
}
