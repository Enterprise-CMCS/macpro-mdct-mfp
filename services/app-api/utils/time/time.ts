import { utcToZonedTime } from "date-fns-tz";
import { ReportMetadata, ReportType } from "../types";

/*
 * Converts passed UTC datetime to ET date
 * returns -> ET date in format mm/dd/yyyy
 */
export const convertDateUtcToEt = (date: number): string => {
  const convertedDate = date;
  const easternDatetime = utcToZonedTime(
    new Date(convertedDate),
    "America/New_York"
  );

  const month = twoDigitCalendarDate(new Date(easternDatetime).getMonth() + 1);
  const day = twoDigitCalendarDate(new Date(easternDatetime).getDate());
  const year = new Date(easternDatetime).getFullYear();

  // month + 1 because Date object months are zero-indexed
  return `${month}/${day}/${year}`;
};

/*
 * Calculates the period given the current date.
 * The periods are defined as follows:
 *     Period 1 is from 01/01 to 06/30.
 *     Period 2 is from 07/01 to 12/31.
 */
export const calculatePeriod = (
  currentDate: number,
  workPlan?: ReportMetadata
) => {
  if (workPlan) return workPlan.reportPeriod;
  const date = new Date(currentDate);
  const period = Math.ceil((date.getMonth() + 1) / 6);
  return period.toString();
};

/**
 * Calculates if the given year is a leap year
 * @param year The year.
 * @returns if the given year is a leap year.
 */
export const isLeapYear = (year: number) => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

/**
 * This method returns a date in ISO format to a date in mm/dd/yyyy format.
 * @param date The given date in ISO format
 * @returns a date in mm/dd/yyyy format
 */
export const convertToFormattedDate = (date: Date) => {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
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
  reportPeriod: string,
  reportType: ReportType
) => {
  let date = new Date();
  if (reportType == ReportType.WP) {
    reportPeriod == "1"
      ? (date = new Date(currentYear, 4, 1))
      : (date = new Date(currentYear, 10, 1));
  }
  if (reportType == ReportType.SAR) {
    if (reportPeriod == "2") {
      isLeapYear(currentYear + 1)
        ? (date = new Date(currentYear + 1, 1, 29))
        : (date = new Date(currentYear + 1, 2, 1));
    } else {
      date = new Date(currentYear, 7, 29);
    }
  }
  return convertToFormattedDate(date);
};

/*
 * This code ensures the date has a preceeding 0 if the month/day is a single digit.
 * Ex: 7 becomes 07 while 10 stays 10
 */
export const twoDigitCalendarDate = (date: number) => {
  return ("0" + date).slice(-2);
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
