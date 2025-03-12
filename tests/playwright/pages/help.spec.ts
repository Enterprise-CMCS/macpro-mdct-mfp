import { test } from "@playwright/test";
import { e2eA11y } from "../utils";

test("Is accessible on all device types for state user", async ({ page }) => {
  await e2eA11y(page, "/help");
});

test("Is accessible on all device types for admin user", async ({ page }) => {
  await e2eA11y(page, "/help");
});
