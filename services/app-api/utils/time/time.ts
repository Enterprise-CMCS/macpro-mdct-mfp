import { utcToZonedTime } from "date-fns-tz";

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
