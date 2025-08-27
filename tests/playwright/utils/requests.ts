// TODO: Create a requests directory and break this file into smaller modules
import { BrowserContext, APIRequestContext } from "@playwright/test";
import * as aws4 from "aws4";

interface CompletionStatus {
  [key: string]: boolean | CompletionStatus;
}

interface Report {
  id: string;
  state: string;
  reportType: string;
  reportYear: number;
  reportPeriod: number;
  submissionName: string;
  status: string;
  isComplete: boolean;
  locked: boolean;
  archived: boolean;
  dueDate: string;
  versionNumber: number;
  formTemplateId: string;
  fieldDataId: string;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
  lastSynced: number;
  completionStatus: CompletionStatus;
  previousRevisions: any[];
}

interface AuthData {
  idToken: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSessionToken: string;
  origin: string;
  href: string;
}

interface Banner {
  endDate: number;
  lastAltered: number;
  startDate: number;
  createdAt: number;
  description: string;
  key: string;
  title: string;
}

/**
 * Extract authentication tokens and location data from environment variables
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use
 * @returns AuthData - Authentication data from environment variables
 */
function getAuthDataFromEnv(userType: "ADMIN" | "STATE"): AuthData {
  const prefix = userType;
  const idToken = process.env[`${prefix}_ID_TOKEN`] || "";
  const awsAccessKeyId = process.env[`${prefix}_AWS_ACCESS_KEY_ID`] || "";
  const awsSecretAccessKey =
    process.env[`${prefix}_AWS_SECRET_ACCESS_KEY`] || "";
  const awsSessionToken = process.env[`${prefix}_AWS_SESSION_TOKEN`] || "";
  const origin = process.env[`${prefix}_ORIGIN`] || "";
  const href = process.env[`${prefix}_HREF`] || "";

  if (!idToken || !awsSessionToken) {
    throw new Error(
      `Missing required auth data for ${userType} user. Make sure env.setup.ts has run properly. Found env vars: ${Object.keys(
        process.env
      )
        .filter((key) => key.includes(prefix))
        .join(", ")}`
    );
  }

  return {
    idToken,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsSessionToken,
    origin,
    href,
  };
}

/**
 * Detect if we need AWS SigV4 signing based on environment
 */
function needsSigV4Signing(): boolean {
  const apiUrl = process.env.API_URL || "";
  const isCI =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
  const isProdLikeEnv =
    apiUrl.includes("execute-api") && apiUrl.includes("amazonaws.com");

  return isCI && isProdLikeEnv;
}

/**
 * Generate AWS SigV4 signed headers using aws4 library
 */
// TODO: Look for documentation around headers for SRP
function generateAPIHeaders(
  authData: AuthData,
  method?: string,
  endpoint?: string,
  body?: string
): Record<string, string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  const baseHeaders = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Origin: authData.origin,
    Referer: authData.href,
    "x-api-key": authData.idToken,
    "x-amz-security-token": authData.awsSessionToken,
    "x-amz-date": amzDate,
  };

  if (!needsSigV4Signing() || !method || !endpoint) {
    return baseHeaders;
  }

  try {
    const urlParts = new URL(endpoint);

    // Include Content-Type in headers BEFORE signing for POST/PUT requests
    const headersForSigning = {
      ...baseHeaders,
      Host: urlParts.host,
    };

    // Add Content-Type before signing if we have a body
    if (body && (method === "POST" || method === "PUT")) {
      headersForSigning["Content-Type"] = "application/json";
    }

    const requestOptions = {
      service: "execute-api",
      region: "us-east-1",
      method: method,
      host: urlParts.host,
      path: urlParts.pathname + urlParts.search,
      headers: headersForSigning,
      body: body || "",
    };

    // Sign the request using aws4
    const signedRequest = aws4.sign(requestOptions, {
      accessKeyId: authData.awsAccessKeyId,
      secretAccessKey: authData.awsSecretAccessKey,
      sessionToken: authData.awsSessionToken,
    });

    // Convert OutgoingHttpHeaders to Record<string, string>
    return Object.fromEntries(
      Object.entries(signedRequest.headers ?? {}).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.join(", ") : String(v),
      ])
    );
  } catch (error) {
    console.log(
      `❌ SigV4 signing failed: ${error.message}, falling back to simple auth`
    );
    return baseHeaders;
  }
}

/**
 * Make an authenticated API request
 * @param context - Browser context with authentication
 * @param method - HTTP method (GET, PUT, POST, DELETE)
 * @param endpoint - API endpoint URL
 * @param additionalHeaders - Additional headers specific to the request
 * @param body - Request body (optional, used for POST/PUT requests)
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 * @returns Promise<any> - API response data
 */
async function makeAuthenticatedRequest(
  context: BrowserContext,
  method: "GET" | "PUT" | "POST" | "DELETE",
  endpoint: string,
  additionalHeaders: Record<string, string> = {},
  body?: any,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<any> {
  const authData = getAuthDataFromEnv(userType);
  const apiContext: APIRequestContext = context.request;

  const bodyString =
    (method === "POST" || method === "PUT") && body !== undefined
      ? JSON.stringify(body)
      : undefined;

  // Get signed headers (Content-Type is already included if needed)
  const headers = {
    ...generateAPIHeaders(authData, method, endpoint, bodyString),
    ...additionalHeaders,
  };

  const requestOptions: any = { headers };

  if (bodyString) {
    requestOptions.data = bodyString;
  }

  let response;
  switch (method) {
    case "GET":
      response = await apiContext.get(endpoint, { headers });
      break;
    case "PUT":
      response = await apiContext.put(endpoint, requestOptions);
      break;
    case "POST":
      response = await apiContext.post(endpoint, requestOptions);
      break;
    case "DELETE":
      response = await apiContext.delete(endpoint, { headers });
      break;
  }

  if (!response.ok()) {
    const responseText = await response.text();
    console.log(
      `❌ Request failed: ${response.status()} ${response.statusText()}`
    );
    console.log(`📄 Response body: ${responseText}`);
    throw new Error(
      `API request failed: ${response.status()} ${response.statusText()} Endpoint: ${endpoint} Response: ${responseText}`
    );
  }

  if (method === "DELETE") {
    return null;
  }

  return await response.json();
}

/**
 * Fetch reports for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 * @returns Promise<Report[]> - Array of reports for the state
 */
export async function getReportsByState(
  state: string,
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<Report[]> {
  const apiUrl = process.env.API_URL;
  const endpoint = `${apiUrl}/reports/WP/${state}`;

  const reports: Report[] = await makeAuthenticatedRequest(
    context,
    "GET",
    endpoint,
    {},
    undefined,
    userType
  );

  return reports;
}

/**
 * Archive a report for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param reportId - The ID of the report to archive
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 */
export async function archiveReport(
  state: string,
  reportId: string,
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<void> {
  const apiUrl = process.env.API_URL;
  const endpoint = `${apiUrl}/reports/archive/WP/${state}/${reportId}`;

  try {
    await makeAuthenticatedRequest(
      context,
      "PUT",
      endpoint,
      {
        "Content-Type": "application/json",
      },
      undefined,
      userType
    );
  } catch (error) {
    console.log(`❌ Failed to archive report ${reportId}: ${error.message}`);
    throw error;
  }
}

/**
 * Archive all reports for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 */
export async function archiveAllReportsForState(
  state: string,
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<void> {
  const allReports = await getReportsByState(state, context, userType);
  const unarchivedReports = allReports.filter((report) => !report.archived);

  for (const report of unarchivedReports) {
    try {
      await archiveReport(state, report.id, context, userType);
    } catch (error) {
      console.log(
        `⚠️ Skipping report ${report.id} due to error: ${error.message}`
      );
    }
  }
}

/**
 * Post a new banner
 * @param banner - The banner data to post
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 * @returns Promise<Banner> - The created banner
 */
export async function postBanner(
  banner: Omit<Banner, "key" | "createdAt" | "lastAltered">,
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<Banner> {
  const apiUrl = process.env.API_URL;
  const endpoint = `${apiUrl}/banners`;

  const createdBanner: Banner = await makeAuthenticatedRequest(
    context,
    "POST",
    endpoint,
    {},
    banner,
    userType
  );

  return createdBanner;
}

/**
 * Fetch all banners from the banners endpoint
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 * @returns Promise<Banner[]> - Array of banners
 */
export async function getBanners(
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<Banner[]> {
  const apiUrl = process.env.API_URL;
  const endpoint = `${apiUrl}/banners`;

  const banners: Banner[] = await makeAuthenticatedRequest(
    context,
    "GET",
    endpoint,
    {},
    undefined,
    userType
  );

  return banners;
}

/**
 * Delete a banner by its ID
 * @param bannerId - The ID of the banner to delete
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 */
export async function deleteBanner(
  bannerId: string,
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<void> {
  const apiUrl = process.env.API_URL;
  const endpoint = `${apiUrl}/banners/${bannerId}`;

  try {
    await makeAuthenticatedRequest(
      context,
      "DELETE",
      endpoint,
      {},
      undefined,
      userType
    );
  } catch (error) {
    console.log(`❌ Failed to delete banner ${bannerId}: ${error.message}`);
    throw error;
  }
}

/**
 * Delete all banners by fetching them first and deleting each one individually
 * @param context - Playwright browser context with authentication
 * @param userType - 'ADMIN' or 'STATE' to specify which user's auth data to use (defaults to 'ADMIN')
 */
export async function deleteAllBanners(
  context: BrowserContext,
  userType: "ADMIN" | "STATE" = "ADMIN"
): Promise<void> {
  try {
    // First, get all existing banners
    const banners = await getBanners(context, userType);

    if (banners.length === 0) {
      return;
    }

    // Delete each banner individually using the deleteBanner function
    for (const banner of banners) {
      try {
        await deleteBanner(banner.key, context, userType);
      } catch (error) {
        console.log(
          `⚠️ Skipping banner ${banner.key} (${banner.title}) due to error: ${error.message}`
        );
      }
    }
  } catch (error) {
    console.log(`❌ Failed to delete all banners: ${error.message}`);
    throw error;
  }
}
