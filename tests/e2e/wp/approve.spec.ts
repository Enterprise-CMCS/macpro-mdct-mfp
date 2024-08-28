import { expect, test } from "@playwright/test";
import {
  archiveExistingWPs,
  logInAdminUser,
  stateAbbreviation,
} from "../helpers";

// TODO: Unskip
test.skip("Admin user can approve a Work Plan submission", async ({ page }) => {
  await archiveExistingWPs(page);
  await logInAdminUser(page);

  // TODO: Seed WP

  // View WPs
  await page
    .getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
    .selectOption(stateAbbreviation);
  await page.getByRole("radio", { name: "MFP Work Plan" }).click();
  await page.getByRole("button", { name: "Go to Report Dashboard" }).click();
  await expect(page).toHaveURL("/wp");
  await page.waitForResponse(`**/reports/WP/${stateAbbreviation}`);

  // View submitted WP
  await expect(page.getByRole("table")).toBeVisible();

  const row = page.getByRole("row", { name: "Submitted" }).last();
  const editedBy = await row.getByRole("gridcell").nth(2).textContent();
  await row.getByRole("button", { name: "View", exact: true }).click();
  await expect(page).toHaveURL("/wp/general-information");

  // Approve WP
  await page.getByRole("link", { name: "Review & Submit" }).click();
  await expect(page).toHaveURL("/wp/review-and-submit");
  await page.getByRole("button", { name: "Approve" }).click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal).toContainText(
    "Are you sure you want to approve this MFP Work Plan?"
  );
  await page.getByRole("textbox").fill("APPROVE");
  await page.getByRole("button", { name: "Approve" }).click();

  // Confirm approved WP is in table
  await expect(page).toHaveURL("/wp");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("row", {
      name: `${editedBy} Approved`,
    })
  ).toBeVisible();
});
