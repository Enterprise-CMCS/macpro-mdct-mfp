import { expect, test } from "@playwright/test";
import { currentYear } from "../../seeds/helpers";
import { createApprovedWorkPlan } from "../../seeds/options";
import {
  archiveExistingWPs,
  firstPeriod,
  loginSeedUsersWithTimeout,
  logInStateUser,
  stateAbbreviation,
  stateName,
} from "../helpers";

test("State user can create a SAR", async ({ page }) => {
  await archiveExistingWPs(page);
  await logInStateUser(page);

  // Seed WP
  await loginSeedUsersWithTimeout(page);
  await createApprovedWorkPlan(currentYear, firstPeriod);

  // View SARs
  await page.getByRole("button", { name: "Enter SAR online" }).click();
  await expect(page).toHaveURL("/sar/");
  await page.waitForResponse(`**/reports/SAR/${stateAbbreviation}`);

  // Create SAR
  await page
    .getByRole("button", {
      name: "Add new MFP SAR submission",
    })
    .click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal).toContainText("Add new MFP SAR submission");
  await expect(
    page.getByRole("textbox", { name: "Associated MFP Work Plan" })
  ).toHaveValue(
    `${stateName} MFP Work Plan ${currentYear} - Period ${firstPeriod}`
  );

  await page.getByRole("radio", { name: "No" }).click();
  await page.getByRole("button", { name: "Save" }).click();

  // Confirm created SAR is in table
  await expect(page.getByRole("table")).toBeVisible();

  const row = page.getByRole("row", {
    name: `${stateName} MFP SAR ${currentYear} - Period ${firstPeriod}`,
  });

  const editIcon = row.getByRole("button", { name: "Edit Report" });
  await expect(editIcon).toBeVisible();

  const editButton = row.getByRole("button", { name: "Edit", exact: true });
  await expect(editButton).toBeVisible();
});
