import { test } from "@playwright/test";
import { logInStateUser, logInAdminUser, e2eA11y } from "../helpers";

test("Is accessible on all device types for state user", async ({ page }) => {
  await logInStateUser(page);
  await e2eA11y(page, "/profile");
});

test("Is accessible on all device types for admin user", async ({ page }) => {
  await logInAdminUser(page);
  await e2eA11y(page, "/profile");
});
