import { test, expect } from "@playwright/test";

test("login as a state user", async ({ page }) => {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  await emailInput.fill(process.env.SEED_STATE_USER_EMAIL!);
  await passwordInput.fill(process.env.SEED_STATE_USER_PASSWORD!);
  await loginButton.click();

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();
});

test("login as an admin user", async ({ page }) => {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  await emailInput.fill(process.env.SEED_ADMIN_USER_EMAIL!);
  await passwordInput.fill(process.env.SEED_ADMIN_USER_PASSWORD!);
  await loginButton.click();

  await expect(
    page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
  ).toBeVisible();
});
