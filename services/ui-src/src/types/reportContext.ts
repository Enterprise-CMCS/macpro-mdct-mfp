// REPORT PROVIDER/CONTEXT

import { AnyObject, ReportJson } from "types";

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
  finalSar?: AnyObject;
  targetPopulations?: object;
  entityStatusOverride?: object;
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
  setReportSelection: Function;
  clearReportSelection: Function;
  clearReportsByState: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  contextIsLoaded: boolean;
  releaseReport: Function;
  errorMessage?: string | undefined;
  lastSavedTime?: string | undefined;
  isReportPage: boolean;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
}

export interface ReportPageProgress {
  name: string;
  path: string;
  children?: ReportPageProgress[];
  status?: boolean;
}
