import { Page, test as setup } from "@playwright/test";
import {
  getEnvironmentConfig,
  setEnvironmentVariables,
  EnvironmentConfig,
} from "./env";
import { authenticateUser } from "./auth";
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

let globalEnvConfig: EnvironmentConfig | null = null;

/**
 * Extract auth data from browser and store as environment variables
 * @param page - Authenticated page
 * @param userType - 'ADMIN' or 'STATE' for environment variable prefixing
 */
async function extractAndStoreAuthData(
  page: Page,
  userType: "ADMIN" | "STATE"
): Promise<void> {
  await page.goto("/");

  const authData = await page.evaluate(() => {
    const idToken = localStorage.getItem("idToken") || "";
    const awsAccessKeyId = localStorage.getItem("aws_access_key_id") || "";
    const awsSecretAccessKey =
      localStorage.getItem("aws_secret_access_key") || "";
    const awsSessionToken = localStorage.getItem("aws_session_token") || "";

    return {
      idToken,
      awsAccessKeyId,
      awsSecretAccessKey,
      awsSessionToken,
      origin: window.location.origin,
      href: window.location.href,
    };
  });

  // Store auth data as environment variables with user type prefix
  process.env[`${userType}_ID_TOKEN`] = authData.idToken;
  process.env[`${userType}_AWS_ACCESS_KEY_ID`] = authData.awsAccessKeyId;
  process.env[`${userType}_AWS_SECRET_ACCESS_KEY`] =
    authData.awsSecretAccessKey;
  process.env[`${userType}_AWS_SESSION_TOKEN`] = authData.awsSessionToken;
  process.env[`${userType}_ORIGIN`] = authData.origin;
  process.env[`${userType}_HREF`] = authData.href;
}

// Environment setup - runs first
setup("setup environment", async ({ page }) => {
  globalEnvConfig = await getEnvironmentConfig(page);

  if (globalEnvConfig) {
    setEnvironmentVariables(globalEnvConfig);
    console.log(`✅ Environment setup complete`);
  } else {
    console.log(
      "⚠️ Environment config not available - will use UI authentication fallback"
    );
  }
});

// Admin authentication setup
setup("authenticate as admin", async ({ page }) => {
  await authenticateUser(
    page,
    adminUser,
    adminPassword,
    expectedAdminHeading,
    "admin",
    globalEnvConfig
  );
  await page.context().storageState({ path: adminAuthPath });

  // Extract and store admin auth data
  await extractAndStoreAuthData(page, "ADMIN");
});

// State user authentication setup
setup("authenticate as user", async ({ page }) => {
  await authenticateUser(
    page,
    stateUser,
    statePassword,
    expectedStateUserHeading,
    "state user",
    globalEnvConfig
  );
  await page.context().storageState({ path: stateUserAuthPath });

  // Extract and store state user auth data
  await extractAndStoreAuthData(page, "STATE");
});
