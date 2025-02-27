import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
// utils
import {
  archiveReport as archiveReportRequest,
  releaseReport as releaseReportRequest,
  submitReport as submitReportRequest,
  approveReport as approveReportRequest,
  flattenReportRoutesArray,
  getLocalHourMinuteTime,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  sortReportsOldestToNewest,
  useStore,
  getEligibleWorkPlan,
} from "utils";
import {
  ErrorVerbiage,
  ReportContextShape,
  ReportKeys,
  ReportShape,
  ReportType,
} from "types";
import { reportErrors } from "verbiage/errors";

// CONTEXT DECLARATION

export const ReportContext = createContext<ReportContextShape>({
  // context
  contextIsLoaded: false as boolean,
  // report
  createReport: Function,
  fetchReport: Function,
  archiveReport: Function,
  updateReport: Function,
  approveReport: Function,
  submitReport: Function,
  // reports by state
  fetchReportsByState: Function,
  fetchReportForSarCreation: Function,
  // selected report
  clearReportSelection: Function,
  setReportSelection: Function,
  // selected reports by state
  clearReportsByState: Function,
  releaseReport: Function,
  // other
  isReportPage: false as boolean,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const { pathname } = useLocation();
  const [error, setError] = useState<ErrorVerbiage | undefined>();
  const [contextIsLoaded, setContextIsLoaded] = useState<boolean>(false);
  const [isReportPage, setIsReportPage] = useState<boolean>(false);

  // state management
  const {
    report,
    reportsByState,
    workPlanToCopyFrom,
    submittedReportsByState,
    setReport,
    setReportsByState,
    setWorkPlanToCopyFrom,
    clearReportsByState,
    setSubmittedReportsByState,
    lastSavedTime,
    setLastSavedTime,
  } = useStore();

  const { state: userState } = useStore().user ?? {};
  const { setEditable } = useStore();

  const hydrateAndSetReport = (report: ReportShape | undefined) => {
    if (report) {
      report.formTemplate.flatRoutes = flattenReportRoutesArray(
        report.formTemplate.routes
      );
    }
    setReport(report);
    setContextIsLoaded(true);
  };

  const fetchReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await getReport(reportKeys);
      hydrateAndSetReport(result);
      setError(undefined);
      return result;
    } catch {
      setError(reportErrors.GET_REPORT_FAILED);
      return;
    }
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
      setError(undefined);
    } catch {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const fetchReportForSarCreation = async (selectedState: string) => {
    try {
      // clear stored reports by state prior to fetching from current state
      clearReportsByState();
      setWorkPlanToCopyFrom(undefined);

      const workPlanSubmissions = await getReportsByState(
        ReportType.WP,
        selectedState
      );

      const sarSubmissions = await getReportsByState(
        ReportType.SAR,
        selectedState
      );

      const workplan = getEligibleWorkPlan(workPlanSubmissions);

      if (workplan) {
        const reportKeys = {
          reportType: ReportType.WP,
          state: selectedState,
          id: workplan["id"],
        };

        const workPlan = await getReport(reportKeys);
        setWorkPlanToCopyFrom(workPlan);
      }

      setReportsByState(sortReportsOldestToNewest(sarSubmissions));
      setError(undefined);
    } catch {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const createReport = async (
    reportType: string,
    state: string,
    report: ReportShape
  ) => {
    try {
      // TODO: Remove casting
      const result = (await postReport(
        reportType,
        state,
        report
      )) as ReportShape;
      hydrateAndSetReport(result);
      setLastSavedTime(getLocalHourMinuteTime());
      setWorkPlanToCopyFrom(undefined);
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const updateReport = async (reportKeys: ReportKeys, report: ReportShape) => {
    try {
      // TODO: Remove casting
      const result = (await putReport(reportKeys, report)) as ReportShape;
      hydrateAndSetReport(result);
      setLastSavedTime(getLocalHourMinuteTime());
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const approveReport = async (reportKeys: ReportKeys, report: ReportShape) => {
    try {
      await approveReportRequest(reportKeys, report);
      setLastSavedTime(getLocalHourMinuteTime());
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const submitReport = async (reportKeys: ReportKeys) => {
    try {
      const result = await submitReportRequest(reportKeys);
      setLastSavedTime(getLocalHourMinuteTime());
      hydrateAndSetReport(result);
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const archiveReport = async (reportKeys: ReportKeys) => {
    try {
      await archiveReportRequest(reportKeys);
      setLastSavedTime(getLocalHourMinuteTime());
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const releaseReport = async (reportKeys: ReportKeys) => {
    try {
      await releaseReportRequest(reportKeys);
      setError(undefined);
    } catch {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  // SELECTED REPORT

  const clearReportSelection = () => {
    hydrateAndSetReport(undefined);
    setLastSavedTime(undefined);
    localStorage.setItem("selectedReport", "");

    //reset editable state when report selection is cleared
    setEditable(true);
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

  // USE EFFECT HOOKS

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
      // context
      contextIsLoaded,
      // report
      report,
      createReport,
      fetchReport,
      archiveReport,
      releaseReport,
      updateReport,
      approveReport,
      submitReport,
      // reports by state
      reportsByState,
      fetchReportsByState,
      // workplan copy
      workPlanToCopyFrom,
      fetchReportForSarCreation,
      // selected report
      clearReportSelection,
      setReportSelection,
      // selected reports by state
      clearReportsByState,
      isReportPage,
      errorMessage: error,
      lastSavedTime,
    }),
    [
      report,
      reportsByState,
      workPlanToCopyFrom,
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
