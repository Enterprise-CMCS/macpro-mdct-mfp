import { test as setup } from "@playwright/test";
import {
  adminUser,
  adminPassword,
  stateUser,
  statePassword,
  expectedAdminHeading,
  expectedStateUserHeading,
  adminAuthPath,
  stateUserAuthPath,
} from "./consts";
import {
  authenticateWithUI,
  extractAndStoreAuthData,
  extractAndStoreEnvironmentConfig,
} from "./env";

setup("setup environment", async ({ page }) => {
  await extractAndStoreEnvironmentConfig(page);
});

setup("authenticate as admin user", async ({ page }) => {
  await authenticateWithUI(
    page,
    adminUser,
    adminPassword,
    expectedAdminHeading,
    "ADMIN"
  );
  await page.context().storageState({ path: adminAuthPath });
  await extractAndStoreAuthData(page, "ADMIN");
});

setup("authenticate as state user", async ({ page }) => {
  await authenticateWithUI(
    page,
    stateUser,
    statePassword,
    expectedStateUserHeading,
    "STATE"
  );
  await page.context().storageState({ path: stateUserAuthPath });
  await extractAndStoreAuthData(page, "STATE");
});
