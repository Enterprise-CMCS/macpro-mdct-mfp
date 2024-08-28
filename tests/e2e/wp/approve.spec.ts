import { test, expect } from "../utils/fixtures/base";
import { currentYear } from "../../seeds/helpers";
import { createSubmittedWorkPlan } from "../../seeds/options";
import {
  archiveExistingWPs,
  firstPeriod,
  logInAdminUser,
  loginSeedUsersWithTimeout,
  stateAbbreviation,
} from "../helpers";

test("Admin user can approve a Work Plan submission", async ({
  page,
  adminHomePage,
  wpDashboard,
  wpGeneralInformation,
  wpReviewAndSubmit,
}) => {
  await archiveExistingWPs(page);
  await logInAdminUser(page);

  // Seed WP
  await loginSeedUsersWithTimeout(page);
  await createSubmittedWorkPlan(currentYear, firstPeriod);

  // View WPs
  await adminHomePage.dropdown.selectOption(stateAbbreviation);
  await adminHomePage.selectWP();
  await adminHomePage.goToDashboard();
  await expect(wpDashboard.page).toHaveURL(wpDashboard.path);

  // View submitted WP
  await wpDashboard.isReady();
  await expect(wpDashboard.page.getByRole("table")).toBeVisible();

  const editedBy = await wpDashboard.submittedReport
    .getByRole("gridcell")
    .nth(2)
    .textContent();
  await wpDashboard.submittedReport
    .getByRole("button", { name: "View", exact: true })
    .click();

  await wpGeneralInformation.isReady();
  await expect(wpGeneralInformation.page).toHaveURL(wpGeneralInformation.path);

  // Approve WP
  await wpReviewAndSubmit.goto();
  await expect(wpReviewAndSubmit.page).toHaveURL(wpReviewAndSubmit.path);
  await wpReviewAndSubmit.approveButton.click();

  await expect(wpReviewAndSubmit.approveModal).toBeVisible();

  await wpReviewAndSubmit.approveReport();

  // Confirm approved WP is in table
  await wpDashboard.isReady();
  await expect(wpDashboard.page).toHaveURL(wpDashboard.path);
  await expect(wpDashboard.page.getByRole("table")).toBeVisible();
  await expect(
    wpDashboard.page.getByRole("row", {
      name: `${editedBy} Approved`,
    })
  ).toBeVisible();
});
