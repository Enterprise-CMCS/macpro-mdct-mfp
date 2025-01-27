import { ReportMetadataShape, ReportType } from "../types";

/**
 * @param date A UTC timestamp, as from `Date.now()`
 * @returns A MM/dd/yyyy string, for that date on the US East Coast.
 */
export const convertDateUtcToEt = (date: number) => {
  return Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
};

/*
 * Calculates the period given the current date.
 * The periods are defined as follows:
 *     Period 1 is from 01/01 to 06/30.
 *     Period 2 is from 07/01 to 12/31.
 */
export const calculatePeriod = (
  currentDate: number,
  workPlan?: ReportMetadataShape
) => {
  if (workPlan) return workPlan.reportPeriod;
  const date = new Date(currentDate);
  const period = Math.ceil((date.getMonth() + 1) / 6);
  return period;
};

/**
 * Calculates if the given year is a leap year
 * @param year The year.
 * @returns if the given year is a leap year.
 */
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * This method returns a date in ISO format to a date in mm/dd/yyyy format.
 * @param date The given date in ISO format
 * @returns a date in MM/dd/yyyy format
 */
export const convertToFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${month}/${day}/${year}`;
};

/**
 * Calculates the due date given the period and the report type.
 * WP due date is May 1 for Period 1, and Nov 1 for Period 2
 * SAR due date for Period 1{*}: 60 days from June 30, due date is Aug 29.
 * SAR due date for Period 2{*}: 60 days from December 31(for a non leap year Mar 1, for leap years it’s Feb 29).
 *
 * @param currentYear The current year of the report
 * @param reportPeriod The period (1 or 2) for the given report
 * @param reportType The report type (WP or SAR)
 */

export const calculateDueDate = (
  currentYear: number,
  reportPeriod: number,
  reportType: ReportType
) => {
  let dueDate = "5/1";
  let year = currentYear;

  if (reportPeriod === 2) {
    dueDate = "11/1";
  }

  // TODO: Remove this block in 2026 when 2024 is no longer a Reporting Period Year option
  if (reportType === ReportType.WP && year === 2024) {
    dueDate = reportPeriod === 1 ? "9/1" : "9/3";
  }

  if (reportType === ReportType.SAR) {
    dueDate = "8/29";

    if (reportPeriod === 2) {
      year++;
      dueDate = isLeapYear(year) ? "2/29" : "3/1";
    }
  }

  const [month, day] = dueDate.split("/").map((i) => parseInt(i, 10));
  const date = new Date(year, month - 1, day);

  return convertToFormattedDate(date);
};

export const calculateCurrentQuarter = () => {
  const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
  return quarter;
};

export const calculateCurrentYear = () => {
  const year = new Date().getFullYear();
  return year;
};

export const incrementQuarterAndYear = (quarter: number, year: number) => {
  if (quarter >= 4) {
    quarter = 1;
    year++;
  } else {
    quarter++;
  }
  return [quarter, year];
};
