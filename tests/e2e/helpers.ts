import { Locator } from "@playwright/test";

export async function logInStateUser({ page }) {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(process.env.SEED_STATE_USER_EMAIL!);
  await passwordInput.fill(process.env.SEED_STATE_USER_PASSWORD!);
  await loginButton.click();
}

export async function logInAdminUser({ page }) {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(process.env.SEED_ADMIN_USER_EMAIL!);
  await passwordInput.fill(process.env.SEED_ADMIN_USER_PASSWORD!);
  await loginButton.click();
}

export async function logOut({ page }) {
  const menuButton = page.getByRole("button", { name: "My Account" });
  const menu = page.getByTestId("header-menu-options-list");
  const logoutButton = page.getByTestId("header-menu-option-log-out");

  await menuButton.click();
  await menu;
  await logoutButton.click();
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/");
}

/* Recursive function to click any archive buttons that appear on screen. */
async function archiveReports(buttons: Locator) {
  const archiveButtons = await buttons.all();

  if (archiveButtons.length > 0) {
    await archiveButtons[0].click();
    await archiveReports(buttons);
  }
}

export async function archiveExistingWPs({ page }) {
  await logInAdminUser({ page });

  await page
    .getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
    .selectOption("Puerto Rico");

  await page.getByLabel("MFP Work Plan").click();
  await page.getByRole("button", { name: "Go to Report Dashboard" }).click();
  await page.waitForResponse(`**/reports/WP/PR`);

  const archiveButtons = await page.getByRole("button", { name: "Archive" });

  if (archiveButtons) {
    await archiveReports(archiveButtons);
  }

  await logOut({ page });
}
