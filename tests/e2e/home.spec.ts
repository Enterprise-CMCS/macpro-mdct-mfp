import { test, expect } from "@playwright/test";

test("Should see the correct home page as a state user", async ({
  login,
  page,
}) => {
  await login.goto();
  await login.stateUser();

  await expect(
    page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enter SAR online" })
  ).toBeVisible();
});

test("Should see the correct home page as an admin user", async ({
  login,
  page,
}) => {
  await login.goto();
  await login.adminUser();

  await expect(
    page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
  ).toBeVisible();
});
