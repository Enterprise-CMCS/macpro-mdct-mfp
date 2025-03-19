import { test } from "@playwright/test";
import { e2eA11y, stateUserAuthPath, adminAuthPath } from "../utils";

test.describe("State user help page", () => {
  test.use({ storageState: stateUserAuthPath });

  test("Help page is accessible on all device types for state user", async ({
    page,
  }) => {
    await e2eA11y(page, "/help");
  });
});

test.describe("Admin user help page", () => {
  test.use({ storageState: adminAuthPath });

  test("Help page is accessible on all device types for admin user", async ({
    page,
  }) => {
    await e2eA11y(page, "/help");
  });
});
