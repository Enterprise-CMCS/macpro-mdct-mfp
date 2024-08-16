import { test, expect } from "@playwright/test";
import { currentYear } from "../../seeds/helpers";
import {
  archiveExistingWPs,
  firstPeriod,
  logInStateUser,
  stateAbbreviation,
  stateName,
} from "../helpers";

test("State user can create a Work Plan", async ({ page }) => {
  await archiveExistingWPs(page);
  await logInStateUser(page);

  // View WPs
  await page.getByRole("button", { name: "Enter Work Plan online" }).click();
  await expect(page).toHaveURL("/wp");
  await page.waitForResponse(`**/reports/WP/${stateAbbreviation}`);

  // Create WP
  await page
    .getByRole("button", {
      name: "Start MFP Work Plan",
    })
    .click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal).toContainText("Add new MFP Work Plan");

  await page.getByLabel(`${currentYear}`).click();
  await page.getByLabel(`First reporting period (January 1 - June 30)`).click();
  await page.getByRole("button", { name: "Start new" }).click();

  // Confirm created WP is in table
  await expect(page.getByRole("table")).toBeVisible();

  const row = page.getByRole("row", { name: "Not Started" });
  await expect(
    row.getByRole("gridcell", {
      name: `${stateName} MFP Work Plan ${currentYear} - Period ${firstPeriod}`,
    })
  ).toBeVisible();

  const editButton = row.getByRole("button", { name: "Edit", exact: true });
  await expect(editButton).toBeVisible();
});
