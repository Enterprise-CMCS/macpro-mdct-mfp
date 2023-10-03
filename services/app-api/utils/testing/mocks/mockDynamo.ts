import sign from "jwt-encode";
import { WPReportMetadata } from "../../types";
import { mockReportKeys } from "../setupJest";

export const mockApiKey = sign(
  {
    sub: "b528a6fa-f58f-4928-8cf0-32c50599821f",
    email_verified: true,
    "cognito:username": "",
    "custom:cms_roles": "mdctmcr-state-user",
    given_name: "Thelonious",
    "custom:cms_state": "NJ",
    family_name: "States",
    email: "stateuser@test.com",
  },
  ""
);

export const mockDynamoData = {
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

export const mockDynamoDataWPLocked: WPReportMetadata = {
  ...mockReportKeys,
  archived: false,
  reportType: "MLR",
  submissionName: "testProgram",
  status: "Not started",
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  createdAt: 162515200000,
  lastAltered: 162515200000,
  submissionCount: 0,
  locked: true,
  previousRevisions: [],
  isComplete: false,
  reportPeriod: 2,
};

export const mockDynamoDataWPCompleted: WPReportMetadata = {
  ...mockReportKeys,
  reportType: "WP",
  submissionName: "testProgram",
  status: "Not started",
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  isComplete: true,
  completionStatus: {
    "step-one": true,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
  archived: false,
  submittedBy: "",
  submittedOnDate: "",
  submissionCount: 0,
  locked: false,
  previousRevisions: [],
  reportPeriod: 2,
};
