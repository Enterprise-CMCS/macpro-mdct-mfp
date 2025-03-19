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

  public async editPopulations() {
    await this.isReady();
    const hasWarnings = await this.page
      .getByRole("row", { name: "warning icon" })
      .count();

    if (hasWarnings) {
      const rows = await this.page
        .locator("tr", { has: this.page.getByRole("button") })
        .all();

      for (const row of rows) {
        const editButton = row.getByLabel("edit button");
        await editButton.click();
        const drawer = this.page.getByRole("dialog");
        await drawer.isVisible();
        await drawer.getByLabel("Yes").click();
        await this.fillBenchmarks();
        await drawer.getByRole("button", { name: "Save & Close" }).click();
        await drawer.waitFor({ state: "hidden" });
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
