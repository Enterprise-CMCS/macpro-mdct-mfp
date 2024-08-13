import { test, expect } from "@playwright/test";
import { currentYear } from "../seeds/helpers";
import { logInStateUser, archiveExistingWPs } from "./helpers";

test("State user can create a work plan", async ({ page }) => {
  await archiveExistingWPs({ page });
  await logInStateUser({ page });

  await expect(
    page.getByText("Money Follows the Person (MFP) Portal")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Enter Work Plan online" }).click();

  expect(page).toHaveURL("/wp");
  page.waitForResponse("**/reports/WP/PR");

  const createButton = await page.getByRole("button", {
    name: "Start MFP Work Plan",
  });

  expect(createButton).toBeVisible();
  await createButton.click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Add new MFP Work Plan");

  await page.getByLabel(`${currentYear}`).click();
  await page.getByLabel(`First reporting period (January 1 - June 30)`).click();
  await page.getByRole("button", { name: "Start new" }).click();

  await expect(
    page.getByText(`Puerto Rico MFP Work Plan ${currentYear} - Period 1`)
  ).toBeVisible();
});
