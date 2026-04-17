import { AnyObject, ReportMetadataShape, ReportStatus } from "types";
import { noEligibleReportsForCopy } from "../../../../constants";

export const financialReportPeriodsMap = {
  1: "Q1 (Quarter 1): January 1st to March 31st",
  2: "Q2 (Quarter 2): April 1st to June 30th",
  3: "Q3 (Quarter 3): July 1st to September 30th",
  4: "Q4 (Quarter 4): October 1st to December 31st",
};

export const generateReportYearOptions = () => {
  const FINANCIAL_REPORTING_LAUNCH_YEAR = 2025;
  const currentYear = new Date(Date.now()).getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1]
    .filter((year) => year >= FINANCIAL_REPORTING_LAUNCH_YEAR)
    .map((year) => ({
      id: `reportYear-${year}`,
      label: `${year}`,
      name: `${year}`,
      value: `${year}`,
    }))
    .toReversed();
};

export const generateCopyReportOptions = (
  reportsByState: ReportMetadataShape[] = []
) => {
  const noEligibleOption = {
    id: "copyReport-none",
    label: noEligibleReportsForCopy,
    name: noEligibleReportsForCopy,
    value: "",
  };
  if (reportsByState.length === 0) {
    return [noEligibleOption];
  }

  const eligibleReports = reportsByState.filter(
    (r) =>
      r.status === ReportStatus.SUBMITTED || r.status === ReportStatus.APPROVED
  );

  if (eligibleReports.length === 0) {
    return [noEligibleOption];
  }

  // Sort by createdAt descending (newest first) and limit to the latest four
  const latestFourReports = eligibleReports
    .toSorted((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4);

  const reportOptions = latestFourReports.map((r) => ({
    id: `copyReport-${r.id}`,
    label: r.submissionName,
    name: r.submissionName,
    value: r.id,
  }));

  return reportOptions;
};

export const prepareFinancialReportingPayload = (
  activeState: string,
  formData: AnyObject,
  reportsByState?: ReportMetadataShape[]
) => {
  const formattedReportYear = Number(formData.reportYear.value);
  const formattedReportPeriod = Number(formData.reportPeriod.value);
  const submissionName = `${activeState}: ${formattedReportYear} - ${
    financialReportPeriodsMap[
      formattedReportPeriod as keyof typeof financialReportPeriodsMap
    ]
  }`;
  const copiedReportsID = formData.copyReport?.value;
  let copiedReport: ReportMetadataShape | undefined;

  if (copiedReportsID) {
    copiedReport = reportsByState?.find(
      (report) => report.id === copiedReportsID
    );
  }
  const financialReportingPayload: AnyObject = {
    metadata: {
      reportYear: formattedReportYear,
      reportPeriod: formattedReportPeriod,
      submissionName: submissionName,
      copyReport: copiedReport,
    },
  };

  return financialReportingPayload;
};
