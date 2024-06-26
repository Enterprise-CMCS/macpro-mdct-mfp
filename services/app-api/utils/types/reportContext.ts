import { Choice } from "./formFields";
import { AnyObject, CompletionData, ErrorVerbiage, State } from "./other";
import { ReportJson, ReportType } from "./reports";

// REPORT PROVIDER/CONTEXT

export interface ReportKeys {
  reportType: ReportType;
  state: State;
  id: string;
}

export interface ReportMetadataShape extends ReportKeys {
  // Main Report Information
  submissionName: string;
  status: ReportStatus;
  fieldDataId: string;
  formTemplateId: string;
  completionStatus?: CompletionData;
  isComplete?: boolean;
  // Who Touched It/Submitted It
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
  submittedBy?: string;
  submitterEmail?: string;
  submittedOnDate?: number;
  previousRevisions?: string[];
  /** Do we ever USE the versionNumber on the ReportMetadata? Maybe not. */
  versionNumber?: number;
  // Time Information
  /** dueDate is formatted as MM/dd/yyyy */
  dueDate: string;
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
  errorMessage?: ErrorVerbiage | undefined;
  lastSavedTime?: string | undefined;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  IN_REVISION = "In revision",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
}

/** The shape of our reports' field data, as stored in S3 */
export type ReportFieldData = Record<
  string,
  string | boolean | Choice[] | ReportFieldData[]
>;
