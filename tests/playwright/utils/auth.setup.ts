import { APIResponse, Browser, Page, test, expect } from "@playwright/test";
import {
  adminAuthPath,
  adminPassword,
  adminUser,
  statePassword,
  stateUser,
  stateUserAuthPath,
} from "./consts";

async function isAlreadyLoggedIn(page) {
  try {
    await page.waitForResponse(
      (response: APIResponse) =>
        response.url().includes("assets") && response.status() === 200,
      { timeout: 1000 }
    );
    // eslint-disable-next-line no-empty
  } catch {}

  return !(await page
    .getByRole("textbox", { name: "email" })
    .isVisible()
    .catch(() => false));
}

async function getContext(browser: Browser, storageStatePath: string) {
  try {
    return await browser.newContext({ storageState: storageStatePath });
  } catch {
    return await browser.newContext();
  }
}

test("authenticate as admin", async ({ browser }) => {
  const context = await getContext(browser, adminAuthPath);

  const page = await context.newPage();
  await page.goto("/");

  if (await isAlreadyLoggedIn(page)) {
    return;
  }

  await loginUser(
    page,
    adminUser,
    adminPassword,
    "View State/Territory Reports"
  );
  await page.context().storageState({ path: adminAuthPath });
});

test("authenticate as user", async ({ browser }) => {
  const context = await getContext(browser, stateUserAuthPath);

  const page = await context.newPage();
  await page.goto("/");

  if (await isAlreadyLoggedIn(page)) {
    return;
  }

  await loginUser(
    page,
    stateUser,
    statePassword,
    "Money Follows the Person (MFP) Portal"
  );
  await page.context().storageState({ path: stateUserAuthPath });
});

async function waitForJwtResponse(page: Page) {
  await page.waitForResponse(async (response) => {
    if (
      response.url() === "https://cognito-idp.us-east-1.amazonaws.com/" &&
      response.request().method() === "POST" &&
      response.ok()
    ) {
      const data = await response.json();
      return (
        data?.AuthenticationResult && data.AuthenticationResult.AccessToken
      );
    }
    return false;
  });
}

async function loginUser(
  page: Page,
  email: string,
  password: string,
  finalHeading: string
) {
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await loginButton.click();
  await page.waitForURL("/");
  await waitForJwtResponse(page);
  await expect(page.getByRole("heading", { name: finalHeading })).toBeVisible();
}
