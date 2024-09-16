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

  public async editBenchmark(population: Locator) {
    const editButton = population.getByLabel("edit button");
    await editButton.click();
    await this.page.getByRole("dialog").isVisible();
  }

  public async markApplicable() {
    const drawer = this.page.getByRole("dialog");
    await drawer.getByLabel("Yes").click();
    await this.fillBenchmarks();
    await drawer.getByRole("button", { name: "Save & Close" }).click();
    await drawer.isHidden();
  }

  public async markNotApplicable() {
    const drawer = this.page.getByRole("dialog");
    await drawer.getByLabel("No").click();
    await drawer.getByRole("button", { name: "Save & Close" }).click();
    await drawer.isHidden();
  }

  public async fillBenchmarks() {
    const drawer = this.page.getByRole("dialog");
    await drawer.getByLabel("Yes").click();
    const inputs = await drawer.getByRole("textbox").all();
    for (const input of inputs) {
      await input.fill("99");
    }
  }

  public async addNewPopulation(name: string) {
    await this.addNewButton.click();
    const modal = this.page.getByLabel("Add other target population");
    await modal.isVisible();
    const textInput = await modal.getByLabel(/Target population name/i);

    await textInput.fill(name);
    await modal.getByRole("button", { name: "Save" }).click();
    await modal.isHidden();
  }
}
