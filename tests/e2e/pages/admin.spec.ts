import { test } from "@playwright/test";
import { e2eA11y, logInAdminUser } from "../utils";

test("Is accessible on all device types for admin user", async ({ page }) => {
  await logInAdminUser(page);
  await e2eA11y(page, "/admin");
});
