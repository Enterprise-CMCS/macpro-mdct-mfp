import { test, expect } from "@playwright/test";
import StateHomePage from "../utils/pageObjects/stateHome.page";
import { WPDashboardPage } from "../utils/pageObjects/wp/wpDashboard.page";
import { stateUserAuthPath } from "../utils/consts";

test.use({ storageState: stateUserAuthPath });

test.describe("List Work Plans", () => {
  test("displays a mocked work plan response", async ({ page }) => {
    const homePage = new StateHomePage(page);
    const wpDashboard = new WPDashboardPage(page);

    const mockResponse = [
      {
        dueDate: "05/01/2025",
        lastAltered: 1740683783781,
        status: "Not started",
        submissionName: "Work Plan",
        createdAt: 1740683783781,
        formTemplateId: "2taA7DSImLgrfkQ2kAMFhjDS9Zf",
        fieldDataId: "2tdZCOtPLDva0YsEMLf6qD48L71",
        lastAlteredBy: "Pedro Navaja",
        reportType: "WP",
        versionNumber: 1,
        state: "PR",
        archived: false,
        reportYear: 2025,
        locked: false,
        id: "2tdZCR9TrYDv9AS0atspi3WPQO4",
        isCopied: false,
        reportPeriod: 1,
        previousRevisions: [],
      },
    ];

    await page.route("**/reports/WP/PR", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    });

    await homePage.goto();
    await homePage.wpButton.click();
    await wpDashboard.isReady();

    await expect(
      wpDashboard.page.getByRole("gridcell", { name: "Work Plan" })
    ).toBeVisible();
  });
});
