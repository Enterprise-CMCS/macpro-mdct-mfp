import { test, expect } from "@playwright/test";
import { logInStateUser, logInAdminUser, e2eA11y } from "../helpers";

test("Should see the correct home page as a state user", async ({ page }) => {
  await logInStateUser(page);

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enter SAR online" })
  ).toBeVisible();
});

test("Should see the correct home page as an admin user", async ({ page }) => {
  await logInAdminUser(page);

  await expect(
    page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
  ).toBeVisible();
});

test("Is accessible on all device types for state user", async ({ page }) => {
  await logInStateUser(page);
  await e2eA11y(page, "/");
});

test("Is accessible on all device types for admin user", async ({ page }) => {
  await logInAdminUser(page);
  await e2eA11y(page, "/");
});

test("Is assessible when not logged in", async ({ page }) => {
  await e2eA11y(page, "/");
});
