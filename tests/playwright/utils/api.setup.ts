import { test as setup } from "@playwright/test";

interface ApiConfig {
  apiUrl: string;
}

// Extract API configuration from the deployed app's env-config.js
async function getApiConfig(page: any): Promise<ApiConfig | null> {
  console.log("🔍 Retrieving API configuration from deployed app...");

  await page.goto("/");

  const config = await page.evaluate(() => {
    if ((window as any)._env_) {
      const env = (window as any)._env_;
      const apiUrl = env.API_URL;

      if (apiUrl) {
        return {
          apiUrl: apiUrl,
          source: "window._env_",
        };
      }
    }

    return { error: "❌ API_URL not found in window._env_" };
  });

  if (config.error) {
    console.log(`${config.error} - API requests may fail`);
    return null;
  }

  console.log(`✅ Retrieved API config from ${config.source}`);
  return { apiUrl: config.apiUrl };
}

// API configuration setup
setup("setup api config", async ({ page }) => {
  const apiConfig = await getApiConfig(page);

  if (apiConfig) {
    // Store in environment variable for the current process
    process.env.API_URL = apiConfig.apiUrl;
    console.log(`💾 API URL stored: ${apiConfig.apiUrl}`);
  } else {
    console.log("⚠️ API config not available - using fallback values");
    process.env.API_URL = "http://localhost:3000/api";
  }
});
