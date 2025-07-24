import { expect, test as setup } from "@playwright/test";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  IAuthenticationCallback,
} from "amazon-cognito-identity-js";
import {
  adminAuthPath,
  adminPassword,
  adminUser,
  statePassword,
  stateUser,
  stateUserAuthPath,
} from "./consts";

// Cognito configuration - remove hard coded dev values once proof of concept is complete
const cognitoConfig = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID || "us-east-1_z8B48Bul1",
  ClientId: process.env.COGNITO_CLIENT_ID || "6j0tplrspbd5ucmlib81ifa3jh",
};

interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

const expectedAdminHeading = "View State/Territory Reports";
const expectedStateUserHeading = "Money Follows the Person (MFP) Portal";

// Headless SRP authentication function
async function authenticateWithSRP(
  username: string,
  password: string
): Promise<AuthTokens> {
  return new Promise<AuthTokens>((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(`🔄 Attempting headless SRP authentication for: ${username}`);

    const userPool = new CognitoUserPool(cognitoConfig);
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    // Callback object to handle authentication responses
    const authenticationCallbacks: IAuthenticationCallback = {
      onSuccess: (session: CognitoUserSession) => {
        // eslint-disable-next-line no-console
        console.log(
          `✅ Headless SRP authentication successful for: ${username}`
        );

        const tokens: AuthTokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        };

        resolve(tokens);
      },

      onFailure: (error: Error) => {
        // eslint-disable-next-line no-console
        console.log(
          `❌ Headless SRP authentication failed for: ${username}`,
          error.message
        );
        reject(error);
      },

      // ToDo: Handle MFA challenges
    };

    // Start the SRP authentication
    cognitoUser.authenticateUser(
      authenticationDetails,
      authenticationCallbacks
    );
  });
}

// Set authentication tokens in browser storage
async function setAuthTokensInBrowser(
  page: any,
  tokens: AuthTokens,
  username: string
): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`🔧 Setting authentication tokens in browser for: ${username}`);

  await page.goto("/");

  await page.evaluate(
    ({ tokens, username, clientId }) => {
      // Clear any existing auth data
      localStorage.clear();
      sessionStorage.clear();

      // Standard token storage patterns
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("idToken", tokens.idToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      // AWS Cognito standard storage pattern
      const keyPrefix = `CognitoIdentityServiceProvider.${clientId}`;
      localStorage.setItem(`${keyPrefix}.LastAuthUser`, username);
      localStorage.setItem(
        `${keyPrefix}.${username}.accessToken`,
        tokens.accessToken
      );
      localStorage.setItem(`${keyPrefix}.${username}.idToken`, tokens.idToken);
      localStorage.setItem(
        `${keyPrefix}.${username}.refreshToken`,
        tokens.refreshToken
      );
      localStorage.setItem(`${keyPrefix}.${username}.clockDrift`, "0");

      // Additional auth state that our app might need
      localStorage.setItem(
        `${keyPrefix}.${username}.tokenScopesString`,
        "aws.cognito.signin.user.admin"
      );
      localStorage.setItem(
        `${keyPrefix}.${username}.userData`,
        JSON.stringify({
          UserAttributes: [],
          Username: username,
        })
      );

      // Set expiration timestamp
      const expirationTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem(
        `${keyPrefix}.${username}.idTokenExpiry`,
        expirationTime.toString()
      );
      localStorage.setItem(
        `${keyPrefix}.${username}.accessTokenExpiry`,
        expirationTime.toString()
      );

      // eslint-disable-next-line no-console
      console.log("🔑 Tokens stored in browser storage");
    },
    { tokens, username, clientId: cognitoConfig.ClientId }
  );
}

// UI authentication fallback
async function authenticateWithUI(
  page: any,
  username: string,
  password: string,
  expectedHeading: string
): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`🖱️  Falling back to UI authentication for: ${username}`);

  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  // Wait for redirect and verify login success
  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", { name: expectedHeading })
  ).toBeVisible({ timeout: 10000 });

  // eslint-disable-next-line no-console
  console.log(`✅ UI authentication successful for: ${username}`);
}

// Verify authentication by checking protected page
async function verifyAuthentication(
  page: any,
  expectedHeading: string
): Promise<boolean> {
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: expectedHeading })
    ).toBeVisible({ timeout: 5000 });
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`❌ Authentication verification failed: ${error}`);
    return false;
  }
}

// Authentication function that tries headless first, then UI fallback
async function authenticateUser(
  page: any,
  username: string,
  password: string,
  expectedHeading: string,
  userType: string
): Promise<void> {
  let authSuccessful = false;

  // Try headless SRP authentication first
  try {
    const tokens = await authenticateWithSRP(username, password);
    await setAuthTokensInBrowser(page, tokens, username);

    // Verify the authentication worked
    authSuccessful = await verifyAuthentication(page, expectedHeading);

    if (authSuccessful) {
      // eslint-disable-next-line no-console
      console.log(`🚀 Headless authentication successful for ${userType}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `⚠️  Headless auth tokens set but verification failed for ${userType}, trying UI fallback`
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `⚠️  Headless authentication failed for ${userType}: ${error.message}`
    );
  }

  // Fallback to UI authentication if headless failed
  if (!authSuccessful) {
    await authenticateWithUI(page, username, password, expectedHeading);
  }
}

// Admin authentication setup
setup("authenticate as admin", async ({ page }) => {
  await authenticateUser(
    page,
    adminUser,
    adminPassword,
    expectedAdminHeading,
    "admin"
  );

  // Save the authenticated state
  await page.context().storageState({ path: adminAuthPath });
  // eslint-disable-next-line no-console
  console.log("💾 Admin authentication state saved");
});

// State user authentication setup
setup("authenticate as user", async ({ page }) => {
  await authenticateUser(
    page,
    stateUser,
    statePassword,
    expectedStateUserHeading,
    "state user"
  );

  // Save the authenticated state
  await page.context().storageState({ path: stateUserAuthPath });
  // eslint-disable-next-line no-console
  console.log("💾 State user authentication state saved");
});
