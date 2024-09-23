import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPDefineInitiativePage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly backButton: Locator;
  readonly description: Locator;
  readonly targetPopulations: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives: I. Define initiative",
    });
    this.backButton = page
      .getByRole("button", {
        name: "Return to dashboard for this initiative",
      })
      .first();
    this.description = page.getByLabel(
      "Describe the initiative, including key activities:"
    );
    this.targetPopulations = page.getByRole("checkbox");
    this.startDate = page.getByLabel("Start date");
    this.endDate = page.getByRole("radio", { name: "No" });
  }

  public async fillFields() {
    await this.description.fill("test");
    // Playwright is fast we gotta be really sure the checkboxes are fully loaded before trying to check them ¯\(°_o)/¯
    await this.targetPopulations.first().waitFor();
    await this.targetPopulations.first().check();
    await this.targetPopulations.nth(1).waitFor();
    await this.targetPopulations.nth(1).check();
    await this.startDate.fill("01/01/2024");
    await this.endDate.click();
  }
}
