// REPORT PROVIDER/CONTEXT

import { AnyObject, ReportJson } from "types";

export interface ReportKeys {
  reportType: string;
  state: string;
  id: string;
}

export interface ReportMetadataShape extends ReportKeys {
  submissionCount?: number;
  reportType: string;
  submissionName: string;
  status: ReportStatus;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
  submittedBy?: string;
  submitterEmail?: string;
  submittedOnDate?: number;
  archived?: boolean;
  locked?: boolean;
  dueDate: number;
  reportPeriod: number;
  finalSar?: boolean;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
  workPlanData?: AnyObject;
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
