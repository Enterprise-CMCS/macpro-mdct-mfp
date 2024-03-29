import {
  calculateNextQuarter,
  calculateRemainingSeconds,
  calculateTimeByType,
  checkDateRangeStatus,
  convertDateEtToUtc,
  convertDateTimeEtToUtc,
  convertDateUtcToEt,
  getLocalHourMinuteTime,
  midnight,
  noon,
  oneSecondToMidnight,
  twoDigitCalendarDate,
} from "./time";

// 1/1/2022 @ 00:00:00
const testDate = {
  utcMS: 1641013200000,
  utcString: "Sat, 01 Jan 2022 05:00:00 GMT",
  etFormattedString: "01/01/2022",
};

const getLocalHourMinuteTimeRegex = /[0-2]?[0-9]:[0-5][0-9](a|p)m/;

describe("Test getLocalHourMinuteTime", () => {
  test("returns correct hourminute format", () => {
    const localHourMinuteTime = getLocalHourMinuteTime();
    expect(localHourMinuteTime).toMatch(getLocalHourMinuteTimeRegex);
  });
});

describe("Test calculateTimeByType", () => {
  test("known timeType returns correct datetime", () => {
    const startDateTest = calculateTimeByType("startDate");
    expect(startDateTest).toEqual(midnight);

    const endDateTest = calculateTimeByType("endDate");
    expect(endDateTest).toEqual(oneSecondToMidnight);
  });

  test("unknown timeType returns noon datetime", () => {
    const unknownTest = calculateTimeByType("whatever");
    expect(unknownTest).toEqual(noon);
  });
});

describe("Test convertDateTimeEtToUtc", () => {
  test("Valid ET datetime converts to UTC correctly", () => {
    const result = convertDateTimeEtToUtc(
      { year: 2022, month: 1, day: 1 },
      { hour: 0, minute: 0, second: 0 }
    );
    expect(result).toBe(testDate.utcMS);
    expect(new Date(result).toUTCString()).toBe(testDate.utcString);
  });
});

describe("Test convertDateEtToUtc", () => {
  test("Valid ET datetime converts to UTC correctly", () => {
    const result = convertDateEtToUtc(testDate.etFormattedString);
    expect(result).toBe(testDate.utcMS);
    expect(new Date(result).toUTCString()).toBe(testDate.utcString);
  });
});

describe("Test convertDateUtcToEt", () => {
  test("Valid UTC datetime converts to ET correctly", () => {
    const result = convertDateUtcToEt(testDate.utcMS);
    expect(result).toBe(testDate.etFormattedString);
  });
});

describe("Test checkDateRangeStatus", () => {
  const currentTime = Date.now(); // 'current' time in ms since unix epoch
  const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
  const twoDays = oneDay * 2;

  it("returns false if startDate is in the future", () => {
    const startDate = currentTime + oneDay;
    const endDate = currentTime + twoDays;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeFalsy();
  });

  it("returns false if endDate is in the past", () => {
    const startDate = currentTime - twoDays;
    const endDate = currentTime - oneDay;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeFalsy();
  });

  it("returns true if startDate is in the past and endDate is in the future", () => {
    const startDate = currentTime - oneDay;
    const endDate = currentTime + oneDay;
    const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
    expect(dateRangeStatus).toBeTruthy();
  });
});

describe("Test twoDigitCalendarDate", () => {
  it("should set 1 to 01", () => {
    const startDay = 1;
    expect(twoDigitCalendarDate(startDay)).toBe("01");
  });

  it("should set 12 to 12", () => {
    const startMonth = 12;
    expect(twoDigitCalendarDate(startMonth)).toBe("12");
  });
});

describe("Test calculateTimeLeft", () => {
  it("returns 0 when no value is given", () => {
    expect(calculateRemainingSeconds()).toBeCloseTo(0);
  });

  it("something else", () => {
    const expirationTime = "2050-11-18T12:53:11-05:00";
    expect(calculateRemainingSeconds(expirationTime)).toBeGreaterThan(0);
  });
});

describe("Test calculateNextQuarter", () => {
  it("returns same year and next period", () => {
    const previousQuarter = "2027 Q1";
    expect(calculateNextQuarter(previousQuarter)).toBe("2027 Q2");
  });
  it("returns next year and next period", () => {
    const previousQuarter = "2027 Q4";
    expect(calculateNextQuarter(previousQuarter)).toBe("2028 Q1");
  });
  it("returns empty string when nothing is passed in", () => {
    expect(calculateNextQuarter("")).toBe("");
  });
});
