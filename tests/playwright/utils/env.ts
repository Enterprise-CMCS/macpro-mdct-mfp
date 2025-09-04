import { Page } from "@playwright/test";

export interface EnvironmentConfig {
  userPoolId: string;
  clientId: string;
  identityPoolId?: string;
  apiUrl: string;
  cognitoRegion?: string;
}

// Extract all environment configuration from env-config.js
export async function getEnvironmentConfig(
  page: Page
): Promise<EnvironmentConfig | null> {
  await page.goto("/");

  const config = await page.evaluate(() => {
    if ((window as any)._env_) {
      const env = (window as any)._env_;

      return {
        userPoolId: env.COGNITO_USER_POOL_ID,
        clientId: env.COGNITO_USER_POOL_CLIENT_ID,
        identityPoolId: env.COGNITO_IDENTITY_POOL_ID,
        apiUrl: env.API_URL,
        cognitoRegion: env.COGNITO_REGION,
      };
    }

    return null; // window._env_ not found
  });

  if (!config) {
    console.log("❌ window._env_ not found");
    return null;
  }

  return config;
}

// Store env config in process.env for global access
export function setEnvironmentVariables(config: EnvironmentConfig): void {
  process.env.API_URL = config.apiUrl;
  process.env.COGNITO_USER_POOL_ID = config.userPoolId;
  process.env.COGNITO_USER_POOL_CLIENT_ID = config.clientId;
  process.env.COGNITO_IDENTITY_POOL_ID = config.identityPoolId;
  process.env.COGNITO_REGION = config.cognitoRegion;
}
