/*
 * These env vars are only used by storage/*.test.ts,
 * But they must be set before storage/*.ts is loaded,
 * So they live here in setupJest!
 */
process.env.WpReportsTable = "local-wp-reports";
process.env.SarReportsTable = "local-sar-reports";
process.env.FinancialReportsTable = "local-financial-reports";
process.env.WP_FORM_BUCKET = "database-local-wp";
process.env.SAR_FORM_BUCKET = "database-local-sar";
process.env.FINANCIAL_REPORT_FORM_BUCKET = "database-local-financial";
process.env.FormTemplateVersionsTable = "local-form-template-versions";
process.env.BannerTable = "local-banners";

process.env.brokerString = "broker1,broker2";
process.env.STAGE = "local";

// GLOBALS

global.structuredClone = (val: any) =>
  val ? JSON.parse(JSON.stringify(val)) : val;

// Mock data

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
};

// BANNER
export * from "./mocks/mockBanner";
// DYNAMO
export * from "./mocks/mockDynamo";
// FORM
export * from "./mocks/mockForm";
// Report
export * from "./mocks/mockReport";
