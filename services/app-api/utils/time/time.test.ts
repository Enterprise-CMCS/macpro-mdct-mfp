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

describe("calculateDueDate()", () => {
  describe("Period 1", () => {
    const reportPeriod = 1;
    let reportType = ReportType.WP;

    test("returns WP due date as 5/1", () => {
      const years = [2022, 2023, 2025];
      years.forEach((currentYear) => {
        const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
        expect(dueDate).toBe(`05/01/${currentYear}`);
      });
    });

    test("returns WP due date in 2024 as 9/1", () => {
      const currentYear = 2024;
      const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
      expect(dueDate).toBe("09/01/2024");
    });

    test("returns SAR due date as 8/29", () => {
      const currentYear = 2022;
      reportType = ReportType.SAR;
      const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
      expect(dueDate).toBe("08/29/2022");
    });
  });

  describe("Period 2", () => {
    const reportPeriod = 2;
    let reportType = ReportType.WP;

    test("returns WP due date as 11/1", () => {
      const years = [2022, 2023, 2025];
      years.forEach((currentYear) => {
        const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
        expect(dueDate).toBe(`11/01/${currentYear}`);
      });
    });

    test("returns WP due date in 2024 as 9/3", () => {
      const currentYear = 2024;
      const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
      expect(dueDate).toBe("09/03/2024");
    });

    test("returns SAR due date as 3/1", () => {
      const currentYear = 2022;
      reportType = ReportType.SAR;
      const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
      expect(dueDate).toBe("03/01/2023");
    });

    test("returns SAR due date in a leap year as 2/29", () => {
      const currentYear = 2023;
      reportType = ReportType.SAR;
      const dueDate = calculateDueDate(currentYear, reportPeriod, reportType);
      expect(dueDate).toBe("02/29/2024");
    });
  });
});
