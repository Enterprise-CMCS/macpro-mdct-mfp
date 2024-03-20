import { ReportStatus } from "types";
import {
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockTargetPopulationsReportPageJson,
  mockReviewSubmitPageJson,
  mockModalOverlayReportPageJson,
  mockDynamicModalOverlayReportPageJson,
} from "./mockForm";

export const mockReportRoutes = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [
      mockDrawerReportPageJson,
      mockModalDrawerReportPageJson,
      mockModalOverlayReportPageJson,
      mockDynamicModalOverlayReportPageJson,
    ],
  },
  mockReviewSubmitPageJson,
];

export const mockFlattenedReportRoutes = [
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockTargetPopulationsReportPageJson,
  mockModalOverlayReportPageJson,
  mockDynamicModalOverlayReportPageJson,
  mockReviewSubmitPageJson,
];

export const mockReportJson = {
  name: "mock-report",
  type: "mock",
  basePath: "/mock",
  routes: mockReportRoutes,
  flatRoutes: mockFlattenedReportRoutes,
  validationSchema: {},
};

export const mockReportKeys = {
  reportType: "WP",
  state: "NJ" as const,
  id: "mock-report-id",
};

export const mockEvaluationPlan = [
  {
    id: "mock-eval-plan-1",
    evaluationPlan_objectiveName: "mock-eval-plan-objective-name-1",
    evaluationPlan_description: "2",
    evaluationPlan_targets: "3",
    evaluationPlan_includesTargets: [
      {
        key: "evaluationPlan_includesTargets",
        value: "Yes",
      },
    ],
    evaluationPlan_additionalDetails: "2",
    quarterlyProjections2024Q1: "1",
    quarterlyProjections2024Q2: "2",
    quarterlyProjections2024Q3: "2",
    quarterlyProjections2024Q4: "2",
    quarterlyProjections2025Q1: "2",
    quarterlyProjections2025Q2: "2",
    quarterlyProjections2025Q3: "2",
    quarterlyProjections2025Q4: "2",
    quarterlyProjections2026Q1: "2",
    quarterlyProjections2026Q2: "2",
    quarterlyProjections2026Q3: "22",
    quarterlyProjections2026Q4: "2",
  },
  {
    id: "mock-eval-plan-objective-name-1",
    evaluationPlan_objectiveName: "x",
    evaluationPlan_description: "0",
    evaluationPlan_targets: "9",
    evaluationPlan_includesTargets: [
      {
        key: "evaluationPlan_includesTargets",
        value: "Yes",
      },
    ],
    evaluationPlan_additionalDetails: "4",
    quarterlyProjections2024Q1: "8",
    quarterlyProjections2024Q2: "8",
    quarterlyProjections2024Q3: "8",
    quarterlyProjections2024Q4: "8",
    quarterlyProjections2025Q1: "8",
    quarterlyProjections2025Q2: "8",
    quarterlyProjections2025Q3: "8",
    quarterlyProjections2025Q4: "8",
    quarterlyProjections2026Q1: "8",
    quarterlyProjections2026Q2: "8",
    quarterlyProjections2026Q3: "8",
    quarterlyProjections2026Q4: "8",
  },
];

export const mockObjectiveProgress = [
  {
    id: "mock-objective-1",
    objectiveProgress_objectiveName: "mock-objective-name-1",
    objectiveProgress_description: "2",
    objectiveProgress_targets: "3",
    objectiveTargets_projections_2024Q1: "1",
  },
  {
    id: "mock-objective-2",
    objectiveProgress_objectiveName: "mock-objective-name-2",
    objectiveProgress_description: "0",
    objectiveProgress_targets: "9",
    objectiveTargets_projections_2024Q1: "8",
  },
];

export const mockReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
  entityType: [
    {
      id: "mock-entity-id",
      initiative_wpTopic: [
        {
          key: "initiative_wpTopic",
          value: "Transitions and transition coordination services ",
        },
      ],
      name: "entity-name",
      entityType_one: "hello",
      transitionBenchmarks_targetPopulationName: "mock benchmark name",
    },
  ],
  initiative: [
    {
      id: "mock-initative-id",
      name: "mock-name",
      mockObjectiveProgress: [
        {
          id: "mock-objective-1",
          objectiveProgress_objectiveName: "mock-objective-name-1",
          objectiveProgress_description: "2",
          objectiveProgress_targets: "3",
          objectiveTargets_projections_2024Q1: "1",
        },
        {
          id: "mock-objective-2",
          objectiveProgress_objectiveName: "mock-objective-name-2",
          objectiveProgress_description: "0",
          objectiveProgress_targets: "9",
          objectiveTargets_projections_2024Q1: "8",
        },
      ],
      "mock-initative-id": [[]],
    },
  ],
  evaluationPlan: mockEvaluationPlan,
};

export const mockSARReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
  entityType: [
    {
      id: "mock-entity-id",
      initiative_wpTopic: [
        {
          key: "initiative_wpTopic",
          value: "Transitions and transition coordination services ",
        },
      ],
      name: "entity-name",
      entityType_one: "hello",
      transitionBenchmarks_targetPopulationName: "mock benchmark name",
    },
  ],
  initiative: [
    {
      id: "mock-initative-id",
      name: "mock-name",
      mockObjectiveProgress: [
        {
          id: "mock-objective-1",
          objectiveProgress_objectiveName: "mock-objective-name-1",
          objectiveProgress_description: "2",
          objectiveProgress_targets: "3",
          objectiveTargets_projections_2024Q1: "1",
        },
        {
          id: "mock-objective-2",
          objectiveProgress_objectiveName: "mock-objective-name-2",
          objectiveProgress_description: "0",
          objectiveProgress_targets: "9",
          objectiveTargets_projections_2024Q1: "8",
        },
      ],
    },
  ],
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
    reportPeriod: 1,
    reportYear: 2023,
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
  locked: false,
  reportYear: 2023,
  versionNumber: 2,
};

export const mockSARFullReport = {
  ...mockReportKeys,
  reportType: "SAR",
  formTemplate: mockReportJson,
  submissionName: "2023 - Alabama 1",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  submittedOnDate: Date.now(),
  fieldData: mockSARReportFieldData,
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
  locked: false,
  reportYear: 2023,
};

export const mockWPSubmittedReport = {
  ...mockReportKeys,
  reportType: "WP",
  formTemplate: mockReportJson,
  submissionName: "2023 - Alabama 1",
  status: ReportStatus.SUBMITTED,
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
  reportYear: 2023,
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
  reportYear: 2023,
};

export const mockReportsByState = [
  { ...mockWPFullReport, id: "mock-report-id-1" },
  { ...mockWPFullReport, id: "mock-report-id-2" },
  { ...mockWPFullReport, id: "mock-report-id-3" },
];

export const mockSARReportsByState = [
  { ...mockSARFullReport, id: "mock-report-id-1" },
  { ...mockSARFullReport, id: "mock-report-id-2" },
  { ...mockSARFullReport, id: "mock-report-id-3" },
];

export const mockReportMethods = {
  archiveReport: jest.fn(),
  releaseReport: jest.fn(),
  approveReport: jest.fn(),
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
  report: mockWPFullReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "2:00 PM",
};

export const mockSARReportContext = {
  ...mockReportMethods,
  report: mockSARFullReport,
  reportsByState: mockSARReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "2:00 PM",
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

export const mockReportContextNoReports = {
  ...mockWpReportContext,
  reportsByState: undefined,
};
