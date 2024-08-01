import { Locator, Response } from "@playwright/test";

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

async function archiveReports(buttons: Locator, page) {
  const archiveButtons = await buttons.all();
  if (archiveButtons.length > 0) {
    const archivePromise = page.waitForResponse(
      (response: Response) =>
        response.url().includes("/reports/archive/WP/PR/") &&
        response.status() == 200
    );

    await archiveButtons[0].click();
    await archivePromise;
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
  const reportsPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/reports/WP/PR") && response.status() == 200
  );
  await reportsPromise;
  await archiveReports(page.getByRole("button", { name: "Archive" }), page);
  await logOut({ page });
}
