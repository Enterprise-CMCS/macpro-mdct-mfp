import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";
import { stateAbbreviation } from "../../consts";

export class WPInitiativesDashboardPage extends BasePage {
  public path = "/wp/state-or-territory-specific-initiatives/initiatives";

  readonly page: Page;
  readonly title: Locator;
  readonly alert: Locator;
  readonly addInitiativeButton: Locator;
  readonly requiredTopics: string[];

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "State or Territory-Specific Initiatives",
    });
    this.alert = page.getByText(
      "This alert will disappear once you add initiatives that meet the topic requirements"
    );
    this.addInitiativeButton = page.getByRole("button", {
      name: "Add initiative",
    });
    this.requiredTopics = [
      "Transitions and transition coordination services",
      "Housing-related supports",
      "Quality measurement and improvement",
    ];
  }

  public async addInitiative(topic: string) {
    await this.addInitiativeButton.click();
    const modal = this.page.getByRole("dialog");
    await modal.isVisible();
    await modal.getByLabel("Initiative name").fill(`Initiative: ${topic}`);
    await modal.getByLabel(topic).click();
    await modal.getByRole("button", { name: "Save" }).click();
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(`/reports/WP/${stateAbbreviation}`) &&
        response.status() == 200
    );
    await modal.isHidden();
  }
}
