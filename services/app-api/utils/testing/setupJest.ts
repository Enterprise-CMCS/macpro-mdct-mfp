/*
 * These env vars are only used by storage/*.test.ts,
 * But they must be set before storage/*.ts is loaded,
 * So they live here in setupJest!
 */
process.env.WP_REPORT_TABLE_NAME = "local-wp-reports";
process.env.SAR_REPORT_TABLE_NAME = "local-sar-reports";
process.env.WP_FORM_BUCKET = "database-local-wp";
process.env.SAR_FORM_BUCKET = "database-local-sar";
process.env.FORM_TEMPLATE_TABLE_NAME = "local-form-template-versions";
process.env.BANNER_TABLE_NAME = "local-banners";
process.env.TEMPLATE_BUCKET = "local-templates";

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
