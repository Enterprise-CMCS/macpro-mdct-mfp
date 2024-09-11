import { test, expect } from "../utils/fixtures/base";
import { archiveExistingWPs, logInStateUser } from "../helpers";

test("State user can create a Work Plan", async ({
  page,
  stateHomePage,
  wpDashboard,
}) => {
  await archiveExistingWPs(page);
  await logInStateUser(page);

  // View WPs
  await stateHomePage.wpButton.click();
  await wpDashboard.isReady();

  // check if work plans exist already or not
  if (await wpDashboard.createButton.isVisible()) {
    await wpDashboard.createButton.click();
    await expect(wpDashboard.modal).toBeVisible();
    await expect(wpDashboard.modal).toContainText("Add new MFP Work Plan");

    await wpDashboard.createNewWP();

    // Confirm created WP is in table
    await wpDashboard.getReports();
    await expect(wpDashboard.firstReport).toBeVisible();
    const editNewWPButton = wpDashboard.firstReport.getByRole("button", {
      name: "Edit",
      exact: true,
    });
    await expect(editNewWPButton).toBeVisible();
  } else {
    await wpDashboard.copyoverButton.click();
    await expect(wpDashboard.modal).toBeVisible();
    await expect(wpDashboard.modal).toContainText("Continue");
    await page
      .getByRole("button", { name: "Continue from previous period" })
      .click();

    // Confirm created WP is in table
    await wpDashboard.getReports();
    await expect(wpDashboard.copiedReport).toBeVisible();
    const editCopiedReportButton = wpDashboard.copiedReport.getByRole(
      "button",
      {
        name: "Edit",
        exact: true,
      }
    );
    await expect(editCopiedReportButton).toBeVisible();
  }
});
