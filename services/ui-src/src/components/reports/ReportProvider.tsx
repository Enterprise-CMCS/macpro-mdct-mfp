import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// utils
import {
  flattenReportRoutesArray,
  getLocalHourMinuteTime,
  getReportsByState,
  postReport,
  sortReportsOldestToNewest,
  useStore,
} from "utils";
import { ReportContextShape, ReportShape } from "types";
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // context
  contextIsLoaded: false as boolean,
  createReport: Function,
  // report
  fetchReportsByState: Function,
  // selected report
  clearReportSelection: Function,
  clearReportsByState: Function,
  setReportSelection: Function,
  isReportPage: false as boolean,
  errorMessage: undefined as string | undefined,
  lastSavedTime: undefined as string | undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const { pathname } = useLocation();
  const [lastSavedTime, setLastSavedTime] = useState<string>();
  const [error, setError] = useState<string>();
  const [contextIsLoaded, setContextIsLoaded] = useState<boolean>(false);
  const [isReportPage, setIsReportPage] = useState<boolean>(false);

  // state management
  const {
    report,
    reportsByState,
    submittedReportsByState,
    setReport,
    setReportsByState,
    clearReportsByState,
    setSubmittedReportsByState,
  } = useStore();
  const { state: userState } = useStore().user ?? {};

  const hydrateAndSetReport = (report: ReportShape | undefined) => {
    if (report) {
      report.formTemplate.flatRoutes = flattenReportRoutesArray(
        report.formTemplate.routes
      );
    }

    setReport(report);
    setContextIsLoaded(true);
  };

  const fetchReportsByState = async (
    reportType: string,
    selectedState: string
  ) => {
    try {
      // clear stored reports by state prior to fetching from current state
      clearReportsByState();
      const result = await getReportsByState(reportType, selectedState);
      setReportsByState(sortReportsOldestToNewest(result));
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const createReport = async (
    reportType: string,
    state: string,
    report: ReportShape
  ) => {
    try {
      const result = await postReport(reportType, state, report);
      hydrateAndSetReport(result);
      setLastSavedTime(getLocalHourMinuteTime());
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  // SELECTED REPORT

  const clearReportSelection = () => {
    hydrateAndSetReport(undefined);
    setLastSavedTime(undefined);
    localStorage.setItem("selectedReport", "");
  };

  const setReportSelection = async (report: ReportShape) => {
    hydrateAndSetReport(report);
    localStorage.setItem("selectedReportType", report.reportType);
    localStorage.setItem("selectedReport", report.id);
    localStorage.setItem(
      "selectedReportBasePath",
      report.formTemplate.basePath
    );
  };

  useEffect(() => {
    const submittedReports = reportsByState?.filter(
      (item) => item.status === "Submitted"
    );
    setSubmittedReportsByState(submittedReports);
  }, [reportsByState]);

  useEffect(() => {
    const flatRoutes = report?.formTemplate.flatRoutes ?? [];
    const isReportPage =
      pathname.includes("export") ||
      flatRoutes.some((route) => route.path === pathname);

    setIsReportPage(isReportPage);
  }, [pathname, report?.formTemplate.flatRoutes]);

  // on first mount, if on report page, fetch report
  useEffect(() => {
    const reportType =
      report?.reportType || localStorage.getItem("selectedReportType");
    const state =
      report?.state || userState || localStorage.getItem("selectedState");
    const id = report?.id || localStorage.getItem("selectedReport");
    if (reportType && state && id) {
      fetchReportsByState(reportType, state);
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      // report
      report,
      contextIsLoaded,
      createReport,
      // reports by state
      reportsByState,
      fetchReportsByState,
      // selected report
      clearReportSelection,
      clearReportsByState,
      setReportSelection,
      isReportPage,
      errorMessage: error,
      lastSavedTime,
    }),
    [
      report,
      reportsByState,
      submittedReportsByState,
      isReportPage,
      error,
      lastSavedTime,
    ]
  );

  return (
    <ReportContext.Provider value={providerValue}>
      {children}
    </ReportContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
