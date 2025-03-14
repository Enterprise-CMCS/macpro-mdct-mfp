import { test } from "@playwright/test";
import { e2eA11y } from "../utils";

test("Help page is accessible on all device types for state user", async ({
  page,
}) => {
  await e2eA11y(page, "/help");
});

test("Help page is accessible on all device types for admin user", async ({
  page,
}) => {
  await e2eA11y(page, "/help");
});
