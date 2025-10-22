import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  IAuthenticationCallback,
} from "amazon-cognito-identity-js";
import { Page, expect } from "@playwright/test";
import AWS from "aws-sdk";
import { EnvironmentConfig } from "./env";

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  awsCredentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  };
}

/**
 * Get AWS credentials from Cognito Identity Pool
 * @param idToken
 * @param config
 * @returns
 */
export async function getAwsCredentials(
  idToken: string,
  config: EnvironmentConfig
): Promise<AuthTokens["awsCredentials"]> {
  if (!config.identityPoolId) {
    console.log("⚠️ No Identity Pool ID - skipping AWS credentials");
    return undefined;
  }

  try {
    const region = config.cognitoRegion || "us-east-1";
    AWS.config.region = region;
    const cognitoIdentity = new AWS.CognitoIdentity();

    const identityParams = {
      IdentityPoolId: config.identityPoolId,
      Logins: {
        [`cognito-idp.${region}.amazonaws.com/${config.userPoolId}`]: idToken,
      },
    };

    const identityResult = await cognitoIdentity
      .getId(identityParams)
      .promise();
    if (!identityResult.IdentityId) {
      throw new Error("Failed to get Identity ID");
    }

    const credentialsParams = {
      IdentityId: identityResult.IdentityId,
      Logins: {
        [`cognito-idp.${region}.amazonaws.com/${config.userPoolId}`]: idToken,
      },
    };

    const credentialsResult = await cognitoIdentity
      .getCredentialsForIdentity(credentialsParams)
      .promise();

    if (!credentialsResult.Credentials) {
      throw new Error("Failed to get AWS credentials");
    }

    console.log(`✅ AWS credentials retrieved for Cognito region: ${region}`);

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

/**
 * Authenticate using SRP Protocol
 * @param username
 * @param password
 * @param config
 * @param userType
 * @returns
 */
export async function authenticateWithSRP(
  username: string,
  password: string,
  config: EnvironmentConfig,
  userType: string
): Promise<AuthTokens> {
  return new Promise<AuthTokens>((resolve, reject) => {
    const userPool = new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

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
          const awsCredentials = await getAwsCredentials(
            basicTokens.idToken,
            config
          );
          const tokens: AuthTokens = { ...basicTokens, awsCredentials };
          resolve(tokens);
        } catch (error) {
          console.log(
            `⚠️ Got JWT tokens but failed to get AWS credentials: ${error.message}`
          );
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

    cognitoUser.authenticateUser(
      authenticationDetails,
      authenticationCallbacks
    );
  });
}

/**
 * Set authentication tokens in browser storage
 * @param page
 * @param tokens
 * @param username
 * @param config
 * @param userType
 */
export async function setAuthTokensInBrowser(
  page: Page,
  tokens: AuthTokens,
  username: string,
  config: EnvironmentConfig,
  userType: string
): Promise<void> {
  await page.goto("/");

  await page.evaluate(
    ({ tokens, username, clientId, userType }) => {
      localStorage.clear();
      sessionStorage.clear();

      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("idToken", tokens.idToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

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
    { tokens, username, clientId: config.clientId, userType }
  );
}

/**
 * Fallback to UI authentication
 * @param page
 * @param username
 * @param password
 * @param expectedHeading
 * @param userType
 */
export async function authenticateWithUI(
  page: Page,
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

  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", { name: expectedHeading })
  ).toBeVisible();
  console.log(`✅ UI authentication successful for ${userType}`);
}

/**
 * Main authentication function that tries SRP first, then falls back to UI
 * @param page
 * @param username
 * @param password
 * @param expectedHeading
 * @param userType
 * @param config
 */
export async function authenticateUser(
  page: Page,
  username: string,
  password: string,
  expectedHeading: string,
  userType: string,
  config: EnvironmentConfig | null
): Promise<void> {
  // Attempt SRP authentication if config is available
  if (config) {
    try {
      const tokens = await authenticateWithSRP(
        username,
        password,
        config,
        userType
      );

      await setAuthTokensInBrowser(page, tokens, username, config, userType);
      console.log(`✅ SRP authentication successful for ${userType}`);
      return;
    } catch (error) {
      console.log(
        `⚠️ SRP authentication failed for ${userType}: ${error.message}`
      );
    }
  } else {
    console.log(
      `⚠️ No config available, skipping SRP authentication for ${userType}`
    );
  }

  // Fallback to UI authentication
  await authenticateWithUI(page, username, password, expectedHeading, userType);
}
