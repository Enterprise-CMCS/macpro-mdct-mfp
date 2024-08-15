import { expect, Page, Response } from "@playwright/test";
import { loginSeedUsers } from "../seeds/options";

export const adminUser = process.env.SEED_ADMIN_USER_EMAIL!;
export const adminPassword = process.env.SEED_ADMIN_USER_PASSWORD!;
export const stateUser = process.env.SEED_STATE_USER_EMAIL!;
export const statePassword = process.env.SEED_STATE_USER_PASSWORD!;
export const stateAbbreviation = process.env.SEED_STATE || "PR";
export const stateName = process.env.SEED_STATE_NAME || "Puerto Rico";
export const firstPeriod: number = 1;

async function logInUser(page: Page, email: string, password: string) {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await loginButton.click();
}

async function logOutUser(page: Page) {
  const menuButton = page.getByRole("button", { name: "My Account" });
  const menu = page.getByTestId("header-menu-options-list");
  const logoutButton = page.getByTestId("header-menu-option-log-out");

  await menuButton.click();
  await expect(menu).toBeVisible();
  await logoutButton.click();
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/");
}

export async function logInStateUser(page: Page) {
  await logInUser(page, stateUser, statePassword);
  await expect(
    page.getByText("Money Follows the Person (MFP) Portal")
  ).toBeVisible();
}

export async function logInAdminUser(page: Page) {
  await logInUser(page, adminUser, adminPassword);
  await expect(page.getByText("View State/Territory Reports")).toBeVisible();
}

async function archiveReports(page: Page, pageType: string) {
  const archiveButtons = await page
    .getByRole("button", { name: "Archive", exact: true })
    .all();
  if (archiveButtons.length > 0) {
    await archiveButtons[0].click();
    await page.waitForResponse(
      (response: Response) =>
        response
          .url()
          .includes(`reports/archive/${pageType}/${stateAbbreviation}/`) &&
        response.status() == 200
    );
    await expect(page.getByRole("table")).toBeVisible();
    await archiveReports(page, pageType);
  }
}

async function archiveExisting(
  page: Page,
  pageType: string,
  label: string,
  url: string
) {
  await logInAdminUser(page);
  await page
    .getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
    .selectOption(stateAbbreviation);
  await page.getByLabel(label).click();
  await page.getByRole("button", { name: "Go to Report Dashboard" }).click();
  await expect(page).toHaveURL(url);
  await archiveReports(page, pageType);
  await logOutUser(page);
}

export async function archiveExistingWPs(page: Page) {
  await archiveExisting(page, "WP", "MFP Work Plan", "/wp");
}

export async function archiveExistingSARs(page: Page) {
  await archiveExisting(
    page,
    "SAR",
    "MFP Semi-Annual Progress Report (SAR)",
    "/sar"
  );
}

export async function loginSeedUsersWithTimeout(page: Page, timeout?: number) {
  // Timeout to allow API to finish starting up before seeding
  await page.waitForTimeout(timeout || 3000);
  await loginSeedUsers();
}
