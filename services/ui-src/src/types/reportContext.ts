// REPORT PROVIDER/CONTEXT

import { AnyObject, Choice, ErrorVerbiage, ReportJson } from "types";

export interface ReportKeys {
  reportType: string;
  state: string;
  id: string;
}

export interface ReportMetadataShape extends ReportKeys {
  // Main Report Information
  submissionName: string;
  status: ReportStatus;
  // Who Touched It/Submitted It
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
  submittedBy?: string;
  submitterEmail?: string;
  submittedOnDate?: number;
  // Time Information
  dueDate: number;
  reportPeriod: number;
  reportYear: number;
  // Admin Use Cases
  archived?: boolean;
  locked?: boolean;
  submissionCount?: number;
  // Connection to let Sar forms know what Work Plan they use to copy data from and vice versa
  associatedSar?: string;
  associatedWorkPlan?: string;
  // Any additional questions that are asked when creating a report are appended here
  finalSar?: Choice[];
  populations?: Choice[];
  versionNumber?: number;
  isCopied?: boolean;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
  completionStatus?: CompletionData;
  isComplete?: boolean;
}

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

export interface ReportContextMethods {
  createReport: Function;
  fetchReport: Function;
  fetchReportsByState: Function;
  fetchReportForSarCreation: Function;
  archiveReport: Function;
  releaseReport: Function;
  updateReport: Function;
  submitReport: Function;
  approveReport: Function;
  setReportSelection: Function;
  clearReportSelection: Function;
  clearReportsByState: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  contextIsLoaded: boolean;
  releaseReport: Function;
  approveReport: Function;
  errorMessage?: ErrorVerbiage | undefined;
  lastSavedTime?: string | undefined;
  isReportPage: boolean;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  IN_REVISION = "In revision",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  ARCHIVED = "Archived",
}

export interface ReportPageProgress {
  name: string;
  path: string;
  children?: ReportPageProgress[];
  status?: boolean;
}
