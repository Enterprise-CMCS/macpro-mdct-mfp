import { test, expect } from "./fixtures/base";

test("login as a state user", async ({ loginPage, stateHomePage }) => {
  await loginPage.goto();
  await loginPage.loginStateUser();

  await expect(
    stateHomePage.page.getByRole("button", { name: "Enter Work Plan online" })
  ).toBeVisible();
});

test("login as an admin user", async ({ loginPage, adminHomePage }) => {
  await loginPage.goto();
  await loginPage.loginAdminUser();

  await expect(
    adminHomePage.page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    })
  ).toBeVisible();
});
