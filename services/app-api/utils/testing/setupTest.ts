/*
 * These env vars are only used by storage/*.test.ts,
 * But they must be set before storage/*.ts is loaded,
 * So they live here in setupTest!
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

export const consoleSpy = {
  trace: vi.spyOn(console, "trace").mockImplementation(vi.fn()),
  debug: vi.spyOn(console, "debug").mockImplementation(vi.fn()),
  info: vi.spyOn(console, "info").mockImplementation(vi.fn()),
  warn: vi.spyOn(console, "warn").mockImplementation(vi.fn()),
  error: vi.spyOn(console, "error").mockImplementation(vi.fn()),
};
/*
 * This mock mutes all logger output during tests! Including console errors!
 *
 * Lots of our tests deliberately trigger console logs, warnings, and errors.
 * That adds a lot of noise to the console output of `yarn test` -
 * or it would, if we didn't mute it here.
 *
 * The only test where we need to observe logger output is debug-lib.test.ts,
 * which overrides this mock.
 */
vi.mock("../debugging/debug-lib", () => {
  const debug = consoleSpy.debug;
  const info = consoleSpy.info;
  const warn = consoleSpy.warn;
  const error = consoleSpy.error;
  const logger = { debug, info, warn, error };
  return {
    trace: vi.fn(),
    debug,
    info,
    warn,
    error,
    logger,
    init: vi.fn(),
    flush: vi.fn(),
  };
});

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
