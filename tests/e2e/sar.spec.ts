import { expect, test } from "@playwright/test";
import { currentYear } from "../seeds/helpers";
import { createApprovedWorkPlan, loginSeedUsers } from "../seeds/options";
import { logInStateUser } from "./helpers";

test("State user can create a SAR", async ({ page }) => {
  const reportPeriod = 1;

  await logInStateUser({ page });
  await expect(
    page.getByText("Money Follows the Person (MFP) Portal")
  ).toBeVisible();

  // Timeout to allow API to finish starting up before seeding
  await page.waitForTimeout(3000);
  await loginSeedUsers();
  await createApprovedWorkPlan(currentYear, reportPeriod);

  const sarButton = page.getByRole("button", { name: "Enter SAR online" });
  await expect(sarButton).toBeVisible();
  await sarButton.click();
  await expect(page).toHaveURL("/sar/");
  await expect(page.getByRole("table")).toBeVisible();

  const createButton = page.getByRole("button", {
    name: "Add new MFP SAR submission",
  });
  await expect(createButton).toBeVisible();
  await createButton.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal).toContainText("Add new MFP SAR submission");
  await expect(
    page.getByRole("textbox", { name: "Associated MFP Work Plan" })
  ).toHaveValue(
    `Puerto Rico MFP Work Plan ${currentYear} - Period ${reportPeriod}`
  );

  const radioButton = page.getByRole("radio", { name: "No" });
  await expect(radioButton).toBeVisible();
  await radioButton.click();

  const saveButton = page.getByRole("button", { name: "Save" });
  await expect(saveButton).toBeVisible();
  await saveButton.click();

  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("gridcell", {
      name: `Puerto Rico MFP SAR ${currentYear} - Period ${reportPeriod}`,
    })
  ).toBeVisible();

  const editIcon = page.getByRole("button", { name: "Edit Report" });
  await expect(editIcon).toBeVisible();

  const editButton = page.getByRole("button", { name: "Edit", exact: true });
  await expect(editButton).toBeVisible();
});
