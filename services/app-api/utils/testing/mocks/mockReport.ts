import { ReportStatus } from "../../types";
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
  validationJson: {
    "mock-number-field": "number",
  },
};

export const mockReportKeys = {
  reportType: "WP",
  state: "NJ" as const,
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
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
  formTemplate: { ...mockReportJson },
  fieldData: { ...mockReportFieldData },
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

export const mockWPMetadata = {
  submissionName: "New Jersey MFP Work Plan 2023 - Period 2",
  dueDate: 1699496172798,
  formTemplateId: "wp-form-template",
  lastAlteredBy: "Anthony Soprano",
  versionNumber: 2,
  previousRevisions: [],
  reportType: "WP",
  reportPeriod: 2,
  createdAt: 1699496227241,
  reportYear: 2023,
  lastAltered: 1699496227241,
  state: "NJ",
  id: "wp-id",
  locked: false,
  fieldDataId: "wp-field-id",
  status: ReportStatus.SUBMITTED,
  completionStatus: {
    "/wp/general-information": true,
    "/wp/transition-benchmarks": false,
    "/wp/transition-benchmark-strategy": false,
    "/wp/state-or-territory-specific-initiatives": [],
  },
  isComplete: false,
  formTemplate: {
    type: "WP",
    name: "MFP Work Plan",
    basePath: "/wp",
    version: "WP_2023-08-21",
    entities: [],
    routes: [],
    validationJson: [],
  },
  fieldData: {
    targetPopulations: [
      {
        id: "targetpopulationid",
        transitionBenchmarks_targetPopulationName: "Older adults",
        isRequired: true,
        transitionBenchmarks_applicableToMfpDemonstration: [
          {
            key: "transitionBenchmarks_applicableToMfpDemonstration-key",
            value: "No",
          },
        ],
      },
    ],
    submissionName: "Work Plan",
    submissionCount: "0",
    stateName: "New Jersey",
    initiative: [],
  },
};

export const mockWPFieldData = {
  targetPopulations: [],
  submissionName: "Work Plan",
  submissionCount: "0",
  stateName: "New Jersey",
  initiative: [],
};
