import { expect, Page } from "@playwright/test";
import { cognitoIdentityRoute } from "./consts";

/**
 * Authenticate using UI login
 * @param page - Playwright page object
 * @param username - User's email/username
 * @param password - User's password
 * @param expectedHeading - Expected heading text after successful login
 * @param userType - 'ADMIN' or 'STATE' for environment variable prefixing
 */
export async function authenticateWithUI(
  page: Page,
  username: string,
  password: string,
  expectedHeading: string,
  userType: "ADMIN" | "STATE"
): Promise<void> {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();
  await interceptAndStoreIdentityRequest(page, userType);

  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", { name: expectedHeading })
  ).toBeVisible();
}

/**
 * Intercept Cognito Identity requests to capture AWS credentials
 * @param page - Playwright page object
 * @param userType - 'ADMIN' or 'STATE' for environment variable prefixing
 */
export async function interceptAndStoreIdentityRequest(
  page: Page,
  userType: "ADMIN" | "STATE"
): Promise<void> {
  let credentialsCaptured = false;

  const routeHandler = async (route: any) => {
    const request = route.request();

    try {
      // Only intercept POST requests
      if (request.method() === "POST") {
        const response = await route.fetch();

        // Check if this response contains credentials
        try {
          const responseBody = await response.json();

          if (
            responseBody.Credentials &&
            responseBody.Credentials.AccessKeyId
          ) {
            process.env[`${userType}_AWS_ACCESS_KEY_ID`] =
              responseBody.Credentials.AccessKeyId;
            process.env[`${userType}_AWS_SECRET_ACCESS_KEY`] =
              responseBody.Credentials.SecretKey;
            process.env[`${userType}_AWS_SESSION_TOKEN`] =
              responseBody.Credentials.SessionToken;
            credentialsCaptured = true;
          }
        } catch (error) {
          console.error("Error parsing cognito-identity response:", error);
        }

        route.fulfill({
          response: response,
        });
      } else {
        route.continue();
      }
    } catch (error) {
      // Handle case where page/context is closed
      if (
        error instanceof Error &&
        error.message.includes(
          "Target page, context or browser has been closed"
        )
      ) {
        console.warn("Route handler called after page closed, ignoring");
        return;
      }
      throw error;
    }
  };

  await page.route(cognitoIdentityRoute, routeHandler);

  // Wait for credentials to be captured or timeout
  const startTime = Date.now();
  const timeout = 10000; // 10 seconds

  while (!credentialsCaptured && Date.now() - startTime < timeout) {
    await page.waitForTimeout(100); // Poll every 100ms
  }

  if (!credentialsCaptured) {
    console.warn(
      `⚠️ AWS credentials not captured within timeout for ${userType} user`
    );
  }

  // Clean up the route to prevent further calls
  await page.unroute(cognitoIdentityRoute, routeHandler);
}

/**
 * Extract auth data from browser and store as environment variables
 * @param page - Playwright page object
 * @param userType - 'ADMIN' or 'STATE' for environment variable prefixing
 */
export async function extractAndStoreAuthData(
  page: Page,
  userType: "ADMIN" | "STATE"
): Promise<void> {
  await page.goto("/");

  // CognitoIdentityServiceProvider.{clientId}.{userId}.{tokenType}
  const authData = await page.evaluate(() => {
    const allKeys = Object.keys(localStorage);
    const cognitoIdTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".idToken")
    );
    const cognitoAccessTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".accessToken")
    );
    const cognitoRefreshTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".refreshToken")
    );
    const idToken = cognitoIdTokenKey
      ? localStorage.getItem(cognitoIdTokenKey) || ""
      : "";
    const accessToken = cognitoAccessTokenKey
      ? localStorage.getItem(cognitoAccessTokenKey) || ""
      : "";
    const refreshToken = cognitoRefreshTokenKey
      ? localStorage.getItem(cognitoRefreshTokenKey) || ""
      : "";

    return {
      idToken,
      accessToken,
      refreshToken,
      origin: window.location.origin,
      href: window.location.href,
    };
  });

  // Store auth data as environment variables with user type prefix
  process.env[`${userType}_ID_TOKEN`] = authData.idToken;
  process.env[`${userType}_ACCESS_TOKEN`] = authData.accessToken;
  process.env[`${userType}_REFRESH_TOKEN`] = authData.refreshToken;
  process.env[`${userType}_ORIGIN`] = authData.origin;
  process.env[`${userType}_HREF`] = authData.href;
}

/**
 * Extract environment configuration from window._env_ and store in process.env
 * @param page - Playwright page object
 * @returns Promise<boolean> - Returns true if config was found and set, false otherwise
 */
export async function extractAndStoreEnvironmentConfig(
  page: Page
): Promise<boolean> {
  await page.goto("/");

  const config = await page.evaluate(() => {
    if ((window as any)._env_) {
      const env = (window as any)._env_;
      return {
        API_URL: env.API_URL,
        COGNITO_USER_POOL_ID: env.COGNITO_USER_POOL_ID,
        COGNITO_USER_POOL_CLIENT_ID: env.COGNITO_USER_POOL_CLIENT_ID,
        COGNITO_IDENTITY_POOL_ID: env.COGNITO_IDENTITY_POOL_ID,
        COGNITO_REGION: env.COGNITO_REGION,
      };
    } else {
      console.log("❌ window._env_ not found");
      return null;
    }
  });

  if (config) {
    process.env.API_URL = config.API_URL;
    process.env.COGNITO_USER_POOL_ID = config.COGNITO_USER_POOL_ID;
    process.env.COGNITO_USER_POOL_CLIENT_ID =
      config.COGNITO_USER_POOL_CLIENT_ID;
    process.env.COGNITO_IDENTITY_POOL_ID = config.COGNITO_IDENTITY_POOL_ID;
    process.env.COGNITO_REGION = config.COGNITO_REGION;
    return true;
  }

  return false;
}
