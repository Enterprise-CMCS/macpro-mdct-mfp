import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export class WPDefineInitiativePage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly backButton: Locator;
  readonly description: Locator;
  readonly olderAdultsCheckbox: Locator;
  readonly individualsPhysicalCheckbox: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly saveButton: Locator;

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
    this.olderAdultsCheckbox = page.getByLabel("Older adults");
    this.individualsPhysicalCheckbox = page.getByLabel(
      "Individuals with physical"
    );
    this.startDate = page.getByLabel("Start date");
    this.endDate = page.getByRole("group", {
      name: "Does the initiative have a projected end date?",
    });
    this.saveButton = page.getByRole("button", { name: "Save & return" });
  }

  public async fillFields() {
    await this.description.fill("test");
    await this.olderAdultsCheckbox.check();
    await this.olderAdultsCheckbox.blur();
    // ChoiceListField component has a hard timeout in the onblur handler to call the updateReport function and a hard timeout this is how we are working with that. :(
    await this.page.waitForTimeout(200);
    await this.individualsPhysicalCheckbox.check();
    await this.individualsPhysicalCheckbox.blur();
    await this.page.waitForTimeout(200);
    await this.startDate.fill("01/01/2024");
    await this.endDate.getByLabel("No").check();
    await this.endDate.getByLabel("No").blur();
    await this.page.waitForTimeout(200);
  }
}
