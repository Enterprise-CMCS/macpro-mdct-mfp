import { Browser, test as setup } from "@playwright/test";
import {
  adminAuthPath,
  adminPassword,
  adminUser,
  statePassword,
  stateUser,
  stateUserAuthPath,
} from "./consts";

async function isAlreadyLoggedIn(page) {
  await page.waitForTimeout(1000);
  return !(await page
    .getByRole("textbox", { name: "email" })
    .isVisible()
    .catch(() => false));
}

async function getContext(browser: Browser, file: string) {
  try {
    return await browser.newContext({ storageState: file });
  } catch (error) {
    return await browser.newContext();
  }
}

setup("authenticate as admin", async ({ browser }) => {
  const context = await getContext(browser, adminAuthPath);

  const page = await context.newPage();
  await page.goto("/");

  if (await isAlreadyLoggedIn(page)) {
    return;
  }

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
  await page.waitForTimeout(2000);
  await page.context().storageState({ path: adminAuthPath });
});

setup("authenticate as user", async ({ browser }) => {
  const context = await getContext(browser, stateUserAuthPath);

  const page = await context.newPage();
  await page.goto("/");

  if (await isAlreadyLoggedIn(page)) {
    return;
  }

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
  await page.waitForTimeout(2000);
  await page.context().storageState({ path: stateUserAuthPath });
});
