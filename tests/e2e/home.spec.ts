import { test, expect } from "@playwright/test";
import { logInStateUser, logInAdminUser } from "./helpers";

test("Should see the correct home page as a state user", async ({ page }) => {
  await page.goto("/");
  await logInStateUser({ page });

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enter SAR online" })
  ).toBeVisible();
});

test("Should see the correct home page as an admin user", async ({ page }) => {
  await page.goto("/");
  await logInAdminUser({ page });

  await expect(
    page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
  ).toBeVisible();
});
