import { test, expect, Locator } from "@playwright/test";
import { logInStateUser, logInAdminUser, logOut } from "./helpers";

const currentYear = new Date().getFullYear();

/* Recursive function to click any archive buttons that appear on screen. */
async function archiveReports(buttons: Locator) {
  const archiveButtons = await buttons.all();

  if (archiveButtons.length > 0) {
    await archiveButtons[0].click();
    await archiveReports(buttons);
  }
}

/* There is almost certainly a better way to do this via the API? */
test.beforeEach(async ({ page }) => {
  await logInAdminUser({ page });

  await page.getByRole("combobox").selectOption("Puerto Rico");
  await page.getByLabel("MFP Work Plan").click();
  await page.getByRole("button", { name: "Go to Report Dashboard" }).click();

  expect(page).toHaveURL("/wp");
  await expect(page.getByRole("table")).toBeVisible();

  const archiveButtons = await page.getByRole("button", { name: "Archive" });

  if (archiveButtons) {
    await archiveReports(archiveButtons);
  }

  await logOut({ page });
});

test("State user can create a work plan", async ({ page }) => {
  await logInStateUser({ page });

  await expect(
    page.getByText("Money Follows the Person (MFP) Portal")
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Enter Work Plan online" }).click();

  expect(page).toHaveURL("/wp");

  await expect(
    page.getByRole("button", { name: "Start MFP Work Plan" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Start MFP Work Plan" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Add new MFP Work Plan");

  await page.getByLabel(`${currentYear}`).click();
  await page.getByLabel(`First reporting period (January 1 - June 30)`).click();
  await page.getByRole("button", { name: "Start new" }).click();

  await expect(
    page.getByText(`Puerto Rico MFP Work Plan ${currentYear} - Period 1`)
  ).toBeVisible();
});
