import { AnyObject, ReportMetadataShape, ReportStatus } from "types";
import { noEligibleReportsForCopy } from "../../../../constants";

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

  const reportOptions = reportsByState
    .filter(
      (r) =>
        r.status === ReportStatus.SUBMITTED ||
        r.status === ReportStatus.APPROVED
    )
    .map((r) => ({
      id: `copyReport-${r.id}`,
      label: r.submissionName,
      name: r.submissionName,
      value: `${r.id}`,
    }));

  return reportOptions.length > 0 ? reportOptions : [noEligibleOption];
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
  let copiedReport: ReportMetadataShape | undefined;

  if (copiedReportsID) {
    copiedReport = reportsByState?.find(
      (report) => report.id === copiedReportsID
    );
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
