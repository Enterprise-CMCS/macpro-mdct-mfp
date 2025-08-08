import { Page, expect, test as setup } from "@playwright/test";
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
  expectedAdminHeading,
  expectedStateUserHeading,
} from "./consts";
import AWS from "aws-sdk";

interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  awsCredentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  };
}

interface CognitoConfig {
  UserPoolId: string;
  ClientId: string;
  IdentityPoolId?: string;
}

// Extract Cognito configuration from the deployed apps env-config.js
async function getCognitoConfig(page: Page): Promise<CognitoConfig | null> {
  await page.goto("/");

  const config = await page.evaluate(() => {
    // Check if window._env_ exists (from env-config.js)
    if ((window as any)._env_) {
      const env = (window as any)._env_;

      const userPoolId = env.COGNITO_USER_POOL_ID;
      const clientId = env.COGNITO_USER_POOL_CLIENT_ID;
      const identityPoolId = env.COGNITO_IDENTITY_POOL_ID; // Add this

      if (userPoolId && clientId) {
        return {
          UserPoolId: userPoolId,
          ClientId: clientId,
          IdentityPoolId: identityPoolId, // Include identity pool
          source: "window._env_",
        };
      }
    }

    return { error: "❌ Cognito config not found in window._env_" };
  });

  if (config.error) {
    console.log(`${config.error} - skipping headless authentication`);
    return null;
  }

  return {
    UserPoolId: config.UserPoolId,
    ClientId: config.ClientId,
    IdentityPoolId: config.IdentityPoolId,
  };
}

// Get AWS credentials from Identity Pool
async function getAwsCredentials(
  idToken: string,
  cognitoConfig: CognitoConfig
): Promise<AuthTokens["awsCredentials"]> {
  if (!cognitoConfig.IdentityPoolId) {
    console.log("⚠️ No Identity Pool ID - skipping AWS credentials");
    return undefined;
  }

  try {
    // Configure AWS SDK
    AWS.config.region = "us-east-1"; // Adjust to your region

    const cognitoIdentity = new AWS.CognitoIdentity();

    // Get Identity ID
    const identityParams = {
      IdentityPoolId: cognitoConfig.IdentityPoolId,
      Logins: {
        [`cognito-idp.us-east-1.amazonaws.com/${cognitoConfig.UserPoolId}`]:
          idToken,
      },
    };

    const identityResult = await cognitoIdentity
      .getId(identityParams)
      .promise();

    if (!identityResult.IdentityId) {
      throw new Error("Failed to get Identity ID");
    }

    // Get credentials for the identity
    const credentialsParams = {
      IdentityId: identityResult.IdentityId,
      Logins: {
        [`cognito-idp.us-east-1.amazonaws.com/${cognitoConfig.UserPoolId}`]:
          idToken,
      },
    };

    const credentialsResult = await cognitoIdentity
      .getCredentialsForIdentity(credentialsParams)
      .promise();

    if (!credentialsResult.Credentials) {
      throw new Error("Failed to get AWS credentials");
    }

    return {
      accessKeyId: credentialsResult.Credentials.AccessKeyId!,
      secretAccessKey: credentialsResult.Credentials.SecretKey!,
      sessionToken: credentialsResult.Credentials.SessionToken!,
    };
  } catch (error) {
    console.log(`❌ Failed to get AWS credentials: ${error.message}`);
    throw error;
  }
}

// Authenticate using SRP (Secure Remote Password) protocol
async function authenticateWithSRP(
  username: string,
  password: string,
  cognitoConfig: CognitoConfig,
  userType: string
): Promise<AuthTokens> {
  return new Promise<AuthTokens>((resolve, reject) => {
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
      onSuccess: async (session: CognitoUserSession) => {
        console.log(
          `✅ Headless SRP authentication successful for ${userType}`
        );

        const basicTokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        };

        try {
          // Get AWS credentials using the ID token
          const awsCredentials = await getAwsCredentials(
            basicTokens.idToken,
            cognitoConfig
          );

          const tokens: AuthTokens = {
            ...basicTokens,
            awsCredentials,
          };

          resolve(tokens);
        } catch (error) {
          console.log(
            `⚠️ Got JWT tokens but failed to get AWS credentials: ${error.message}`
          );
          // Still resolve with basic tokens
          resolve(basicTokens);
        }
      },

      onFailure: (error: Error) => {
        console.log(
          `❌ Headless SRP authentication failed for ${userType}`,
          error.message
        );
        reject(error);
      },
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
  username: string,
  cognitoConfig: CognitoConfig,
  userType: string
): Promise<void> {
  await page.goto("/");

  await page.evaluate(
    ({ tokens, username, clientId, userType }) => {
      // Clear any existing auth data
      localStorage.clear();
      sessionStorage.clear();

      // Standard token storage patterns
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("idToken", tokens.idToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      // Store AWS credentials if available
      if (tokens.awsCredentials) {
        localStorage.setItem(
          "aws_access_key_id",
          tokens.awsCredentials.accessKeyId
        );
        localStorage.setItem(
          "aws_secret_access_key",
          tokens.awsCredentials.secretAccessKey
        );
        localStorage.setItem(
          "aws_session_token",
          tokens.awsCredentials.sessionToken
        );
      }

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

      // Set appropriate token scopes based on user type
      const tokenScopes =
        userType === "admin"
          ? "aws.cognito.signin.user.admin"
          : "aws.cognito.signin.user";

      localStorage.setItem(
        `${keyPrefix}.${username}.tokenScopesString`,
        tokenScopes
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
    },
    { tokens, username, clientId: cognitoConfig.ClientId, userType }
  );
}

// UI authentication fallback
async function authenticateWithUI(
  page: any,
  username: string,
  password: string,
  expectedHeading: string,
  userType: string
): Promise<void> {
  console.log(`⚠️ Falling back to UI authentication for ${userType}`);

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
  console.log(`✅ UI authentication successful for ${userType}`);
}

// Verify authentication by checking protected page heading
async function verifyAuthentication(
  page: any,
  expectedHeading: string
): Promise<boolean> {
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: expectedHeading })
    ).toBeVisible({ timeout: 10000 });
    return true;
  } catch (error) {
    console.log(`❌ Authentication verification failed: ${error}`);
    return false;
  }
}

// Authentication function that attempts to get cognito config and authenticate otherwise falls back to UI
async function authenticateUser(
  page: Page,
  username: string,
  password: string,
  expectedHeading: string,
  userType: string
): Promise<void> {
  let authSuccessful = false;

  // Attempt to get Cognito config from the application under test
  const cognitoConfig = await getCognitoConfig(page);

  // Only attempt headless auth if we successfully retrieved Cognito config
  if (cognitoConfig) {
    try {
      console.log(
        `🔄 Cognito config found - attempting headless authentication for ${userType}`
      );

      const tokens = await authenticateWithSRP(
        username,
        password,
        cognitoConfig,
        userType
      );
      await setAuthTokensInBrowser(
        page,
        tokens,
        username,
        cognitoConfig,
        userType
      );

      authSuccessful = await verifyAuthentication(page, expectedHeading);

      if (authSuccessful) {
        console.log(`🚀 Headless authentication verified for ${userType}`);
      } else {
        console.log(
          `⚠️ Headless auth tokens set but verification failed for ${userType}, trying UI fallback`
        );
      }
    } catch (error) {
      console.log(
        `⚠️ Headless authentication failed for ${userType}: ${error.message}`
      );
    }
  } else {
    console.log(
      `⚠️ No Cognito config available - skipping headless authentication for ${userType}`
    );
  }

  // Fallback to UI authentication if headless failed or was skipped
  if (!authSuccessful) {
    await authenticateWithUI(
      page,
      username,
      password,
      expectedHeading,
      userType
    );
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

  await page.context().storageState({ path: adminAuthPath });
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

  await page.context().storageState({ path: stateUserAuthPath });
});
