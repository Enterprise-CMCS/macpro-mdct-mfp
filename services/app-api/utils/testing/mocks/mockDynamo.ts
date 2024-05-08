import sign from "jwt-encode";
import { ReportMetadataShape, ReportStatus, ReportType } from "../../types";
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

export const mockDynamoDataWPLocked: ReportMetadataShape = {
  ...mockReportKeys,
  archived: false,
  reportType: ReportType.WP,
  submissionName: "testProgram",
  status: ReportStatus.NOT_STARTED,
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
  reportYear: 2021,
  dueDate: "11/01/2021",
};

export const mockDynamoDataWPCompleted: ReportMetadataShape = {
  ...mockReportKeys,
  reportType: ReportType.WP,
  submissionName: "testProgram",
  status: ReportStatus.NOT_STARTED,
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
  submittedOnDate: 0,
  submissionCount: 0,
  locked: false,
  previousRevisions: [],
  reportPeriod: 2,
  reportYear: 2021,
  dueDate: "11/01/2021",
};
