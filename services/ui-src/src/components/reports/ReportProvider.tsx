import { createContext } from "react";
// utils

import { ReportContextShape, ReportShape, ReportMetadataShape } from "types";

export const ReportContext = createContext<ReportContextShape>({
  // report
  report: undefined as ReportShape | undefined,
  contextIsLoaded: false as boolean,
  archiveReport: Function,
  releaseReport: Function,
  createReport: Function,
  fetchReport: Function,
  updateReport: Function,
  submitReport: Function,
  // reports by state
  reportsByState: undefined as ReportMetadataShape[] | undefined,
  fetchReportsByState: Function,
  // selected report
  clearReportSelection: Function,
  clearReportsByState: Function,
  setReportSelection: Function,
  isReportPage: false as boolean,
  errorMessage: undefined as string | undefined,
  lastSavedTime: undefined as string | undefined,
});
