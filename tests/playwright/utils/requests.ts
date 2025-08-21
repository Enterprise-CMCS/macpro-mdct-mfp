// TODO: Consider creating a requests directory and breaking this file into smaller modules
import { BrowserContext, APIRequestContext } from "@playwright/test";

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
      `Missing required auth data for ${userType} user. Make sure env.setup.ts has run properly.`
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
 * Generate common headers for AWS API requests
 * @param authData - Authentication data from browser
 * @returns Object containing common headers
 */
function generateAPIHeaders(authData: AuthData): Record<string, string> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  return {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Origin: authData.origin,
    Referer: authData.href,
    "x-api-key": authData.idToken,
    "x-amz-security-token": authData.awsSessionToken,
    "x-amz-date": amzDate,
  };
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

  const headers = {
    ...generateAPIHeaders(authData),
    ...additionalHeaders,
  };

  const requestOptions: any = { headers };

  if ((method === "POST" || method === "PUT") && body !== undefined) {
    requestOptions.data = JSON.stringify(body);
    if (!headers["Content-Type"] && !headers["content-type"]) {
      headers["Content-Type"] = "application/json";
    }
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
    throw new Error(
      `API request failed: ${response.status()} ${response.statusText()} Endpoint: ${endpoint}`
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
  console.log(`🔍 Fetching reports for state: ${state} using ${userType} auth`);

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
  console.log(`✅ Retrieved ${reports.length} reports for state ${state}`);

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
  console.log(
    `🗄️ Archiving report ${reportId} for state ${state} using ${userType} auth`
  );

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

    console.log(`✅ Successfully archived report ${reportId}`);
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
  console.log(
    `🗄️ Starting bulk archive process for state ${state} using ${userType} auth`
  );

  const allReports = await getReportsByState(state, context, userType);
  const unarchivedReports = allReports.filter((report) => !report.archived);

  console.log(
    `Found ${unarchivedReports.length} unarchived reports to process`
  );

  for (const report of unarchivedReports) {
    try {
      await archiveReport(state, report.id, context, userType);
    } catch (error) {
      console.log(
        `⚠️ Skipping report ${report.id} due to error: ${error.message}`
      );
    }
  }

  console.log(`✅ Completed archiving process for state ${state}`);
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
  console.log(`📝 Posting new banner: ${banner.title} using ${userType} auth`);

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

  console.log(`✅ Successfully posted new banner: ${createdBanner.title}`);
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
  console.log(`🔍 Fetching banners using ${userType} auth`);

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
  console.log(`✅ Retrieved ${banners.length} banners`);

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
  console.log(`🗑️ Deleting banner ${bannerId} using ${userType} auth`);

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
    console.log(`✅ Successfully deleted banner ${bannerId}`);
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
  console.log(
    `🗑️ Starting bulk delete process for all banners using ${userType} auth`
  );

  try {
    // First, get all existing banners
    const banners = await getBanners(context, userType);

    if (banners.length === 0) {
      console.log(`ℹ️ No banners found to delete`);
      return;
    }

    console.log(`Found ${banners.length} banners to delete`);

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

    console.log(`✅ Completed bulk delete process for banners`);
  } catch (error) {
    console.log(`❌ Failed to delete all banners: ${error.message}`);
    throw error;
  }
}
