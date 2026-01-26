import { AnyObject, ReportMetadataShape, ReportStatus } from "types";

export const expenditureReportPeriodsMap = {
  1: "Q1: January 1st to March 31st",
  2: "Q2: April 1st to June 30th",
  3: "Q3: July 1st to September 30th",
  4: "Q4: October 1st to December 31st",
};

export const generateReportYearOptions = () => {
  const EXPENDITURE_LAUNCH_YEAR = 2025;
  const currentYear = new Date(Date.now()).getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1]
    .filter((year) => year >= EXPENDITURE_LAUNCH_YEAR)
    .map((year) => ({
      id: `reportYear-${year}`,
      label: `${year}`,
      name: `${year}`,
      value: `${year}`,
    }))
    .reverse();
};

export const generateCopyReportOptions = (
  reportsByState?: ReportMetadataShape[]
) => {
  const noEligbleOption = {
    id: "copyReport-none",
    label: "No reports eligble for copy",
    name: "No reports eligble for copy",
    value: "",
  };
  if (!reportsByState || reportsByState.length === 0) {
    return [noEligbleOption];
  }

  let reportOptions = [];
  for (const report of reportsByState) {
    if (
      report.status === ReportStatus.SUBMITTED ||
      report.status === ReportStatus.APPROVED
    ) {
      reportOptions.push({
        id: `copyReport-${report.id}`,
        label: `${report.submissionName}`,
        name: `${report.submissionName}`,
        value: `${report.id}`,
      });
    }
  }
  if (reportOptions.length === 0) {
    return [noEligbleOption];
  }
  return reportOptions;
};

export const prepareExpenditurePayload = (
  activeState: string,
  formData: AnyObject,
  reportsByState?: ReportMetadataShape[]
) => {
  const formattedReportYear = Number(formData.reportYear.value);
  const formattedReportPeriod = Number(formData.reportPeriod.value);
  const submissionName = `${activeState}: ${formattedReportYear} - ${
    expenditureReportPeriodsMap[
      formattedReportPeriod as keyof typeof expenditureReportPeriodsMap
    ]
  }`;
  const copiedReportsID = formData.copyReport?.value;
  let copiedReport: ReportMetadataShape | false = false;

  if (copiedReportsID) {
    copiedReport =
      reportsByState?.find((report) => report.id === copiedReportsID) || false;
  }
  const expenditurePayload: AnyObject = {
    metadata: {
      reportYear: formattedReportYear,
      reportPeriod: formattedReportPeriod,
      submissionName: submissionName,
      copyReport: copiedReport,
    },
  };

  return expenditurePayload;
};
