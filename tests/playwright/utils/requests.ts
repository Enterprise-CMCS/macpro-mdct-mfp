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

/**
 * Fetch reports for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param context - Playwright browser context with authentication
 * @returns Promise<Report[]> - Array of reports for the state
 */
export async function getReportsByState(
  state: string,
  context: BrowserContext
): Promise<Report[]> {
  console.log(`🔍 Fetching reports for state: ${state} via API context`);

  try {
    const apiContext: APIRequestContext = context.request;
    const apiUrl = process.env.API_URL;
    const endpoint = `${apiUrl}/reports/WP/${state}`;

    const response = await apiContext.get(endpoint, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok()) {
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()} Endpoint: ${endpoint}`
      );
    }

    const reports: Report[] = await response.json();
    console.log(`✅ Retrieved ${reports.length} reports for state ${state}`);
    return reports;
  } catch (error) {
    console.log(
      `❌ Failed to fetch reports for state ${state}: ${error.message}`
    );
    throw error;
  }
}

/**
 * Fetch unarchived reports for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param context - Playwright browser context with authentication
 * @returns Promise<Report[]> - Array of unarchived reports for the state
 */
export async function getUnarchivedReportsByState(
  state: string,
  context: BrowserContext
): Promise<Report[]> {
  const allReports = await getReportsByState(state, context);
  return allReports.filter((report) => !report.archived);
}

/**
 * Archive a report for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param reportId - The ID of the report to archive
 * @param context - Playwright browser context with authentication
 */
export async function putToArchiveReport(
  state: string,
  reportId: string,
  context: BrowserContext
): Promise<void> {
  console.log(`🗄️ Archiving report ${reportId} for state ${state}`);

  try {
    const apiContext: APIRequestContext = context.request;
    const apiUrl = process.env.API_URL;
    const endpoint = `${apiUrl}/reports/archive/WP/${state}/${reportId}`;

    const response = await apiContext.put(endpoint, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    if (!response.ok()) {
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()}`
      );
    }

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
 */
export async function archiveAllReportsForState(
  state: string,
  context: BrowserContext
): Promise<void> {
  console.log(`🗄️ Starting bulk archive process for state ${state}`);

  const allReports = await getReportsByState(state, context);
  const unarchivedReports = allReports.filter((report) => !report.archived);

  console.log(
    `Found ${unarchivedReports.length} unarchived reports to process`
  );

  for (const report of unarchivedReports) {
    try {
      await putToArchiveReport(state, report.id, context);
    } catch (error) {
      console.log(
        `⚠️ Skipping report ${report.id} due to error: ${error.message}`
      );
    }
  }

  console.log(`✅ Completed archiving process for state ${state}`);
}

/**
 * Delete a report for a specific state using Work Plan (WP) report type
 * @param state - The state code (e.g., "AL", "CA", "TX", "PR")
 * @param reportId - The ID of the report to delete
 * @param context - Playwright browser context with authentication
 */
export async function deleteReport(
  state: string,
  reportId: string,
  context: BrowserContext
): Promise<void> {
  console.log(`🗑️ Deleting report ${reportId} for state ${state}`);

  try {
    const apiContext: APIRequestContext = context.request;
    const apiUrl = process.env.API_URL;
    const endpoint = `${apiUrl}/reports/WP/${state}/${reportId}`;

    const response = await apiContext.delete(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    if (!response.ok()) {
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()}`
      );
    }

    console.log(`✅ Successfully deleted report ${reportId}`);
  } catch (error) {
    console.log(`❌ Failed to delete report ${reportId}: ${error.message}`);
    throw error;
  }
}
