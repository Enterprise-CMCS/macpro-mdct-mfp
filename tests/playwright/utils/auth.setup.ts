import { expect, test as setup } from "@playwright/test";

import { adminPassword, adminUser, statePassword, stateUser } from "./consts";

const adminFile = "playwright/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(adminUser);
  await passwordInput.fill(adminPassword);
  await loginButton.click();
  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", {
      name: "View State/Territory Reports",
    })
  ).toBeVisible();
  await page.context().storageState({ path: adminFile });
});

const userFile = "playwright/.auth/user.json";

setup("authenticate as user", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(stateUser);
  await passwordInput.fill(statePassword);
  await loginButton.click();
  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", {
      name: "Money Follows the Person (MFP) Portal",
    })
  ).toBeVisible();
  await page.context().storageState({ path: userFile });
});
