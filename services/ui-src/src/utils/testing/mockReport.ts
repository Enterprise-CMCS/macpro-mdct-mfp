import { OverlayModalTypes, ReportRoute, ReportStatus } from "types";
import { genericErrorContent } from "verbiage/errors";
import {
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockTargetPopulationsReportPageJson,
  mockReviewSubmitPageJson,
  mockModalOverlayReportPageJson,
  mockDynamicModalOverlayReportPageJson,
  mockInitiativesSpecificDynamicModalOverlayReportPageJson,
} from "./mockForm";

export const mockReportPeriod = 1;
export const mockReportYear = 2024;
export const mockStateName = "Puerto Rico";

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
      type: "mock-type",
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
  stateName: mockStateName,
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
    reportPeriod: mockReportPeriod,
    reportYear: mockReportYear,
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
  id: "mock-wp-full-report-id",
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
  reportPeriod: mockReportPeriod,
  locked: false,
  reportYear: mockReportYear,
  versionNumber: 1,
  archived: false,
};

export const mockWPArchivedReport = {
  ...mockReportKeys,
  id: "mock-wp-archived-report-id",
  reportType: "WP",
  formTemplate: mockReportJson,
  submissionName: "2023 - Alabama 1",
  status: ReportStatus.ARCHIVED,
  dueDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
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
  reportPeriod: mockReportPeriod,
  locked: false,
  reportYear: mockReportYear,
  versionNumber: 1,
  archived: true,
};

export const mockWPCopiedReport = {
  ...mockReportKeys,
  id: "mock-wp-copied-report-id",
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
  reportPeriod: mockReportPeriod,
  locked: false,
  reportYear: mockReportYear,
  versionNumber: 1,
  isCopied: true,
};

export const mockSARFullReport = {
  ...mockReportKeys,
  id: "mock-sar-full-report-id",
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
  reportPeriod: mockReportPeriod,
  locked: false,
  reportYear: mockReportYear,
};

export const mockWPSubmittedReport = {
  ...mockReportKeys,
  id: "mock-wp-submitted-report-id",
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
  reportPeriod: mockReportPeriod,
  reportYear: mockReportYear,
};

export const mockWPApprovedFullReport = {
  ...mockReportKeys,
  id: "mock-wp-approved-full-report-id",
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
  reportPeriod: mockReportPeriod,
  reportYear: mockReportYear,
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
  errorMessage: {
    title: "We've run into a problem",
    description: genericErrorContent,
  },
  lastSavedTime: "1:58 PM",
};

export const mockWpReportContext = {
  ...mockReportMethods,
  report: mockWPFullReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: {
    title: "We've run into a problem",
    description: genericErrorContent,
  },
  lastSavedTime: "2:00 PM",
};

export const mockSARReportContext = {
  ...mockReportMethods,
  report: mockSARFullReport,
  reportsByState: mockSARReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: {
    title: "We've run into a problem",
    description: genericErrorContent,
  },
  lastSavedTime: "2:00 PM",
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

export const mockWPReportWithOverlays = {
  ...mockWPFullReport,
  fieldData: {
    ...mockWPFullReport.fieldData,
    [OverlayModalTypes.INITIATIVE]: [
      {
        ...mockWPFullReport.fieldData.entityType[0],
        type: OverlayModalTypes.INITIATIVE,
        id: "mock wip id", // this is both our search filter and our search target in renderFieldRow
        initiative_wpTopic: [
          {
            value: "mock WP topic",
          },
        ],
      },
      {
        ...mockWPFullReport.fieldData.entityType[0],
        type: OverlayModalTypes.INITIATIVE,
        id: "mock wip id",
        initiative_wpTopic: [
          {
            key: "other-type-key",
            value: "Other, specify",
          },
        ],
        initiative_wp_otherTopic: "Unique initiative type",
      },
    ],
  },
  formTemplate: {
    ...mockWPFullReport.formTemplate,
    routes: [
      /*
       * We need the 3th route to have a child with entityType initiative,
       * to avoid a null reference in getInitiativeStatus()
       */
      ...mockWPFullReport.formTemplate.routes.slice(0, 3),
      {
        name: "mock-route-4",
        path: "/mock/mock-route-4",
        children: [
          {
            entityType: OverlayModalTypes.INITIATIVE,
          },
        ],
      } as ReportRoute,
      ...mockWPFullReport.formTemplate.routes.slice(3),
    ],
  },
};

export const mockSARReportWithOverlays = {
  ...mockSARFullReport,
  fieldData: {
    ...mockSARFullReport.fieldData,
    [OverlayModalTypes.INITIATIVE]: [
      {
        ...mockSARFullReport.fieldData.entityType[0],
        type: OverlayModalTypes.INITIATIVE,
        id: "mock wip id", // this is both our search filter and our search target in renderFieldRow
        initiative_wpTopic: [
          {
            value: "mock WP topic",
          },
        ],
        "mock-expenditure-field-1": "5",
        "mock-expenditure-field-2": "10",
        "mock-expenditure-field-3": "15",
        "mock-expenditure-field-4": "20",
      },
    ],
  },
  formTemplate: {
    ...mockSARFullReport.formTemplate,
    routes: [
      /*
       * We need the 2th route to have a child with entityType initiative,
       * to avoid a null reference in getInitiativeStatus()
       */
      ...mockSARFullReport.formTemplate.routes.slice(0, 2),
      {
        name: "mock-dynamic-route",
        path: "/mock/mock-dynamic-route",
        initiatives: [
          {
            initiatiaveId: "mock-init-id",
            name: "mock init name",
            entitySteps: [
              {
                foo: "bar",
              },
            ],
          },
        ],
      } as ReportRoute,
      ...mockSARFullReport.formTemplate.routes.slice(2),
    ],
  },
};

export const mockSARReportRoutesForStatus = [
  mockStandardReportPageJson,
  {
    name: "mock-route-1",
    path: "/mock/mock-route-1",
    children: [
      {
        name: "mock-sar-ret-hcbs",
        path: "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community",
      },
    ],
  },
  mockReviewSubmitPageJson,
];

export const mockWPReportRoutesForStatus = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [
      mockDrawerReportPageJson,
      mockModalDrawerReportPageJson,
      mockModalOverlayReportPageJson,
      mockInitiativesSpecificDynamicModalOverlayReportPageJson,
    ],
  },
  mockReviewSubmitPageJson,
];
