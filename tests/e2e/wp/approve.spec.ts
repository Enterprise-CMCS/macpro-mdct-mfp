import { test, expect } from "../utils/fixtures/base";
import {
  archiveExistingWPs,
  logInAdminUser,
  stateAbbreviation,
} from "../helpers";

test.skip("Admin user can approve a Work Plan submission", async ({
  page,
  adminHomePage,
  wpDashboard,
  wpGeneralInformation,
  wpReviewAndSubmit,
}) => {
  await archiveExistingWPs(page);
  await logInAdminUser(page);

  // TODO: Seed WP

  // View WPs
  await adminHomePage.dropdown.selectOption(stateAbbreviation);
  await adminHomePage.selectWP();
  await adminHomePage.goToDashboard();

  // View submitted WP
  await wpDashboard.isReady();
  await wpDashboard.reportsReady();

  const editedBy = await wpDashboard.submittedReport
    .getByRole("gridcell")
    .nth(2)
    .textContent();
  await wpDashboard.submittedReport
    .getByRole("button", { name: "View", exact: true })
    .click();

  await wpGeneralInformation.isReady();

  // Approve WP
  await wpReviewAndSubmit.goto();
  await wpReviewAndSubmit.isReady();
  await wpReviewAndSubmit.approveButton.click();

  await expect(wpReviewAndSubmit.approveModal).toBeVisible();

  await wpReviewAndSubmit.approveReport();

  // Confirm approved WP is in table
  await wpDashboard.isReady();
  await expect(wpDashboard.page.getByRole("table")).toBeVisible();
  await expect(
    wpDashboard.page.getByRole("row", {
      name: `${editedBy} Approved`,
    })
  ).toBeVisible();
});
