import { AnyObject } from "types";

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

export const prepareExpenditurePayload = (
  activeState: string | undefined,
  formData: AnyObject
) => {
  const formattedReportYear = Number(formData.reportYear.value);
  const formattedReportPeriod = Number(formData.reportPeriod.value);
  const submissionName = `${activeState}: ${formattedReportYear} - ${formData.reportPeriod.label}`;

  const expenditurePayload: AnyObject = {
    metadata: {
      reportYear: formattedReportYear,
      reportPeriod: formattedReportPeriod,
      submissionName: submissionName,
    },
  };

  return expenditurePayload;
};
