import { ReportStatus } from "types";
import {
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockReviewSubmitPageJson,
} from "./mockForm";

export const mockReportRoutes = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [mockDrawerReportPageJson, mockModalDrawerReportPageJson],
  },
  mockReviewSubmitPageJson,
];

export const mockFlattenedReportRoutes = [
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockReviewSubmitPageJson,
];

export const mockReportJson = {
  name: "mock-report",
  type: "mock",
  basePath: "/mock",
  routes: mockReportRoutes,
  validationSchema: {},
};

export const mockReportKeys = {
  reportType: "WP",
  state: "NJ" as const,
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
  entityType: [{ name: "entity-name", entityType_one: "hello" }],
};

export const mockWPReport = {
  ...mockReportKeys,
  metadata: {
    reportType: "WP",
    submissionName: "testProgram",
    status: "Not started",
    lastAlteredBy: "Thelonious States",
    fieldDataId: "mockReportFieldData",
    formTemplateId: "mockReportJson",
  },
  formTemplate: mockReportJson,
  fieldData: mockReportFieldData,
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockWPDynamoData = {
  ...mockReportKeys,
  reportType: "WP",
  submissionName: "testProgram",
  status: "Not started",
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  isComplete: false,
  completionStatus: {
    "step-one": false,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockWPFullReport = {
  ...mockReportKeys,
  reportType: "WP",
  formTemplate: mockReportJson,
  submissionName: "2023 - Alabama 1",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
  reportPeriod: 1,
};

export const mockWPApprovedFullReport = {
  ...mockReportKeys,
  reportType: "WP",
  formTemplate: mockReportJson,
  submissionName: "2023 - Alabama 1",
  status: ReportStatus.APPROVED,
  dueDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: true,
  reportPeriod: 1,
};

export const mockReportsByState = [
  { ...mockWPFullReport, id: "mock-report-id-1" },
  { ...mockWPFullReport, id: "mock-report-id-2" },
  { ...mockWPFullReport, id: "mock-report-id-3" },
];

export const mockReportMethods = {
  archiveReport: jest.fn(),
  releaseReport: jest.fn(),
  fetchReport: jest.fn(),
  fetchReportsByState: jest.fn(),
  fetchReportForSarCreation: jest.fn(),
  createReport: jest.fn(),
  updateReport: jest.fn(),
  submitReport: jest.fn(),
  clearReportSelection: jest.fn(),
  clearReportsByState: jest.fn(),
  setReportSelection: jest.fn(),
  isReportPage: true,
  contextIsLoaded: true,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockWpReportContext = {
  ...mockReportMethods,
  ...mockWPFullReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockEmptyDashboardReportContext = {
  ...mockWpReportContext,
  reportsByState: [{}],
};

export const mockDashboardReportContext = {
  ...mockWpReportContext,
  reportsByState: [
    {
      ...mockWPReport,
      formTemplate: mockReportJson,
      fieldData: undefined,
    },
  ],
};
