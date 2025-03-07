import { test } from "@playwright/test";
import { e2eA11y, logInAdminUser, logInStateUser } from "../utils";

test("Help is accessible on all device types for state user", async ({
  page,
}) => {
  await logInStateUser(page);
  await e2eA11y(page, "/help");
});

test("Help is accessible on all device types for admin user", async ({
  page,
}) => {
  await logInAdminUser(page);
  await e2eA11y(page, "/help");
});
