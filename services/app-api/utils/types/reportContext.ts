import { AnyObject } from "./other";
import { ReportJson } from "./reports";

// REPORT PROVIDER/CONTEXT

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
  sar?: string;
  workPlan?: string;
  // Any additional questions that are asked when creating a report are appended here
  finalSar?: boolean;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
}

export interface ReportContextMethods {
  fetchReport: Function;
  fetchReportsByState: Function;
  archiveReport: Function;
  createReport: Function;
  updateReport: Function;
  clearReportSelection: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  submittedReportsByState: ReportMetadataShape[] | undefined;
  errorMessage?: string | undefined;
  lastSavedTime?: string | undefined;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
}
