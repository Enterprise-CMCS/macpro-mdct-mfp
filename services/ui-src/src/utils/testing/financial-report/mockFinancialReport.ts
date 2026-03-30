import {
  mockBannerStore,
  mockReportJson,
  mockReportKeys,
  mockReportMethods,
  mockReportPeriod,
  mockReportYear,
  mockStateUserStore,
} from "../setupJest";
import {
  AdminBannerState,
  MfpReportState,
  MfpUserState,
  ReportShape,
  ReportStatus,
  ReportType,
} from "types";
import { genericErrorContent } from "verbiage/errors";

export const mockFinancialReportKeys = {
  ...mockReportKeys,
  reportType: ReportType.FINANCIAL_REPORT,
};

export const mockFinancialReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
};

export const mockFinancialReportNotStartedReport = {
  ...mockFinancialReportKeys,
  id: "mock-financial-report-full-report-id",
  reportType: ReportType.FINANCIAL_REPORT,
  submissionName: `Financial Report Submission Period: ${mockReportPeriod} Year: ${mockReportYear} Status: ${ReportStatus.NOT_STARTED}`,
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  submittedOnDate: Date.now(),
  fieldData: mockFinancialReportFieldData,
  formTemplate: mockReportJson,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
  reportPeriod: mockReportPeriod,
  locked: false,
  reportYear: mockReportYear,
  versionNumber: 1,
  archived: false,
};

export const mockFinancialReportNoReportContext = {
  ...mockReportMethods,
  report: null,
  reportsByState: [],
  copyEligibleReportsByState: [],
  errorMessage: {
    title: "We've run into a problem",
    description: genericErrorContent,
  },
  lastSavedTime: "",
};

export const mockFinancialReportOneNotStartedReportContext = {
  ...mockReportMethods,
  report: mockFinancialReportNotStartedReport,
  reportsByState: [mockFinancialReportNotStartedReport],
  copyEligibleReportsByState: [mockFinancialReportNotStartedReport],
  errorMessage: {
    title: "We've run into a problem",
    description: genericErrorContent,
  },
  lastSavedTime: "2:00 PM",
};

export const mockNoFinancialReportStore: MfpUserState &
  AdminBannerState &
  MfpReportState = {
  report: undefined,
  reportsByState: [],
  submittedReportsByState: [],
  lastSavedTime: "2:00 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
  ...mockStateUserStore,
  ...mockBannerStore,
};

export const mockNotStartedFinancialReportStore: MfpUserState &
  AdminBannerState &
  MfpReportState = {
  ...mockNoFinancialReportStore,
  report: mockFinancialReportNotStartedReport as ReportShape,
  reportsByState: [mockFinancialReportNotStartedReport],
  submittedReportsByState: [],
};
