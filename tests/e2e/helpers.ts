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
async function archiveReports(buttons: Locator, page) {
  const archiveButtons = await buttons.all();

  if (archiveButtons.length > 0) {
    await archiveButtons[0].click();
    await page.getByRole("dialog");
    const archiveTextbox = page.getByTestId("modal-input");
    await archiveTextbox.fill("Archive");
    await page.getByTestId("modal-archive-button").click();
    await page.waitForResponse("**/reports/archive/WP/PR/**");
    await page.waitForTimeout(1000);
    await archiveReports(buttons, page);
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
  await page.waitForResponse("**/reports/WP/PR");
  await page.waitForTimeout(1000);
  const archiveButtons = await page.locator('button:text-is("Archive")');
  if (archiveButtons) {
    await archiveReports(archiveButtons, page);
  }

  await logOut({ page });
}
