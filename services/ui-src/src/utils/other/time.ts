import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { DateShape, TimeShape } from "types";

export const midnight: TimeShape = { hour: 0, minute: 0, second: 0 };
export const oneSecondToMidnight: TimeShape = {
  hour: 23,
  minute: 59,
  second: 59,
};
export const noon: TimeShape = {
  hour: 12,
  minute: 0,
  second: 0,
};

export const calculateTimeByType = (timeType?: string): TimeShape => {
  const timeMap: any = {
    startDate: midnight,
    endDate: oneSecondToMidnight,
  };
  return timeMap?.[timeType as keyof typeof timeMap] || noon;
};

/*
 * Returns local time in HH:mm format with the "am/pm" indicator
 * ex: 12:02pm
 */
export const getLocalHourMinuteTime = () => {
  const currentUtcTime = Date.now();
  const localTime = new Date(currentUtcTime).toLocaleTimeString();
  const localTimeHourMinute = localTime.substring(
    0,
    localTime.lastIndexOf(":")
  );
  const twelveHourIndicator = localTime.includes("AM") ? "am" : "pm";
  return localTimeHourMinute.concat(twelveHourIndicator);
};

/*
 * Converts passed ET datetime to UTC
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateTimeEtToUtc = (
  etDate: DateShape,
  etTime: TimeShape
): number => {
  const { year, month, day } = etDate;
  const { hour, minute, second } = etTime;

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = fromZonedTime(
    new Date(year, month - 1, day, hour, minute, second),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts passed ET date to UTC
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateEtToUtc = (date: string): number => {
  const [month, day, year] = date.split("/");

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = fromZonedTime(
    new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts passed UTC datetime to ET date
 * returns -> ET date in format mm/dd/yyyy
 */
export const convertDateUtcToEt = (date: number): string => {
  const convertedDate = date;
  const easternDatetime = toZonedTime(
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
 * This code ensures the date has a preceeding 0 if the month/day is a single digit.
 * Ex: 7 becomes 07 while 10 stays 10
 */
export const twoDigitCalendarDate = (date: number) => {
  return ("0" + date).slice(-2);
};

/*
 * Converts passed UTC datetime to a local date in the users timezone
 * returns -> User Timezone date in format Day of Week, Month Day, Year
 * Ex: Friday, August 12, 2022
 */
export const utcDateToReadableDate = (
  date: number,
  style?: "full" | "long" | "medium" | "short"
) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: style,
  }).format(date);
};

export const checkDateCompleteness = (date: string) => {
  const month = parseInt(date.split("/")?.[0]);
  const day = parseInt(date.split("/")?.[1]);
  const year = parseInt(date.split("/")?.[2]);
  const dateIsComplete = month && day && year.toString().length === 4;
  return dateIsComplete ? { year, month, day } : null;
};

export const convertDatetimeStringToNumber = (
  date: string,
  timeType: string | undefined
): number | undefined => {
  const completeDate = checkDateCompleteness(date);
  let convertedTime;
  if (completeDate) {
    const time = calculateTimeByType(timeType);
    convertedTime = convertDateTimeEtToUtc(completeDate, time);
  }
  return convertedTime || undefined;
};

export const checkDateRangeStatus = (
  startDate: number,
  endDate: number
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= startDate && currentTime <= endDate;
};

/*
 * Calculates time remaining for things like timeout
 */
export const calculateRemainingSeconds = (expiresAt?: any) => {
  if (!expiresAt) return 0;
  return (new Date(expiresAt).valueOf() - Date.now()) / 1000;
};

export const displayLongformPeriod = (
  period: number | undefined,
  reportYear: number | undefined
) => {
  if (period === 1) {
    return `January 1 to June 30, ${reportYear} reporting period`;
  } else {
    return `July 1 to December 31, ${reportYear} reporting period`;
  }
};

export const displayLongformPeriodSection9 = (
  reportYear: number | undefined
) => {
  return `August 1, ${
    reportYear ? reportYear - 1 : reportYear
  } to July 31, ${reportYear}`;
};

export const calculateNextQuarter = (previousQuarter: string) => {
  if (previousQuarter) {
    const formattedQuarter = previousQuarter.split(" ");
    const year = parseInt(formattedQuarter[0]);
    const period = parseInt(
      formattedQuarter[1][formattedQuarter[1].length - 1]
    );
    const nextPeriod = (period % 4) + 1;
    const nextYear = period === 4 ? year + 1 : year;
    return `${nextYear} Q${nextPeriod}`;
  }
  return "";
};
