import { expect, test as setup } from "@playwright/test";

import {
  adminAuthPath,
  adminPassword,
  adminUser,
  statePassword,
  stateUser,
  stateUserAuthPath,
} from "./consts";

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
  await page.context().storageState({ path: adminAuthPath });
});

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
  await page.context().storageState({ path: stateUserAuthPath });
});
