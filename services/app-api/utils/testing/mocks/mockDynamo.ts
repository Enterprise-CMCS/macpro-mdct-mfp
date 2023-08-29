import { WPReportMetadata } from "../../types";
import { mockReportKeys } from "../setupJest";

export const mockDynamoData = {
  ...mockReportKeys,
  reportType: "WP",
  programName: "testProgram",
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

export const mockDynamoDataCompleted: WPReportMetadata = {
  ...mockReportKeys,
  reportType: "WP",
  programName: "testProgram",
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
};
