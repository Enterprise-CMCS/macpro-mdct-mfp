import { ReportType } from "../types";
import {
  calculateDueDate,
  calculatePeriod,
  convertDateUtcToEt,
  isLeapYear,
} from "./time";

describe("Test convertDateUtcToEt", () => {
  it("Converts to Eastern Time correctly just before midnight", () => {
    // 2024-12-31 11:59:59pm in New York
    const date = 1735707599000;

    expect(convertDateUtcToEt(date)).toBe("12/31/2024");
  });

  it("Converts to Eastern Time correctly just after midnight", () => {
    // 2025-01-01 12:00:01am in New York
    const date = 1735707601000;

    expect(convertDateUtcToEt(date)).toBe("01/01/2025");
  });
});

describe("Test calculatePeriod", () => {
  it("calculatePeriod given due date of 01/01/2022", () => {
    const dueDate = Date.parse("01/01/2022");
    const period = 1;
    expect(calculatePeriod(dueDate)).toBe(period);
  });

  it("calculatePeriod given due date of 10/01/2022", () => {
    const dueDate = Date.parse("10/01/2022");
    const period = 2;
    expect(calculatePeriod(dueDate)).toBe(period);
  });

  it("calculatePeriod given due date of 04/01/2023", () => {
    const dueDate = Date.parse("04/01/2023");
    const period = 1;
    expect(calculatePeriod(dueDate)).toBe(period);
  });
});

describe("Test calculate isLeapYear", () => {
  it("calculate isLeapYear for 2020", () => {
    expect(isLeapYear(2020)).toBeTruthy();
  });

  it("calculate isLeapYear for 2022", () => {
    expect(isLeapYear(2022)).toBeFalsy();
  });

  it("calculate isLeapYear for 2024", () => {
    expect(isLeapYear(2024)).toBeTruthy();
  });
});

describe("Test calculateDueDate", () => {
  it("calculateDueDate for WP report with creation date 01/01/2022", () => {
    const currentYear = 2022;
    const reportPeriod = 1;
    const reportType = ReportType.WP;
    const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
    expect(dueDate).toBe("05/01/2022");
  });

  it("calculateDueDate for WP report with creation date as 08/01/2022", () => {
    const currentYear = 2022;
    const reportPeriod = 2;
    const reportType = ReportType.WP;
    const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
    expect(dueDate).toBe("11/01/2022");
  });

  it("calculateDueDate for SAR report created in 2022 with period 2", () => {
    const currentYear = 2022;
    const reportPeriod = 1;
    const reportType = ReportType.SAR;
    const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
    expect(dueDate).toBe("08/29/2022");
  });

  it("calculateDueDate for SAR report created in 2022 with period 2", () => {
    const currentYear = 2022;
    const reportPeriod = 2;
    const reportType = ReportType.SAR;
    const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
    expect(dueDate).toBe("03/01/2023");
  });

  it("calculateDueDate for SAR report which is due during a leap year", () => {
    const currentYear = 2023;
    const reportPeriod = 2;
    const reportType = ReportType.SAR;
    const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
    expect(dueDate).toBe("02/29/2024");
  });
});
