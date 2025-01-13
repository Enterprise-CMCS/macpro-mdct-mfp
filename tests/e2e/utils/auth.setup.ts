import { Page, test as setup } from "@playwright/test";

import { adminPassword, adminUser, statePassword, stateUser } from "./consts";

const adminFile = "playwright/.auth/admin.json";

async function waitForCognitoLocalStorage(page: Page) {
  for (let i = 0; i < 30; i++) {
    const keys = await page.evaluate(() => Object.keys(localStorage));

    if (keys.some((key) => key.startsWith("CognitoIdentityServiceProvider"))) {
      break;
    }

    await page.waitForTimeout(100);
  }
}

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(adminUser);
  await passwordInput.fill(adminPassword);
  await loginButton.click();
  await page.waitForURL("/");
  await page
    .getByRole("heading", {
      name: "View State/Territory Reports",
    })
    .isVisible();
  await waitForCognitoLocalStorage(page);
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
  await page
    .getByRole("heading", {
      name: "Money Follows the Person (MFP) Portal",
    })
    .isVisible();
  await waitForCognitoLocalStorage(page);
  await page.context().storageState({ path: userFile });
});
