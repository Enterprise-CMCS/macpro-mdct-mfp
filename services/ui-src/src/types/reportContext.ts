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
  programName: string;
  submissionName?: string;
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
  clearReportSelection: Function;
  clearReportsByState: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  contextIsLoaded: boolean;
  errorMessage?: string | undefined;
  lastSavedTime?: string | undefined;
  isReportPage: boolean;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

export interface ReportPageProgress {
  name: string;
  path: string;
  children?: ReportPageProgress[];
  status?: boolean;
}
