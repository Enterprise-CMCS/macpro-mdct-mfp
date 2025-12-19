import {
  expenditureReportPeriodsMap,
  generateReportYearOptions,
  prepareExpenditurePayload,
} from "./expenditureLogic";

describe("expenditureLogic", () => {
  describe("expenditureReportPeriodsMap", () => {
    it("should have correct quarter mappings", () => {
      expect(expenditureReportPeriodsMap[1]).toBe(
        "Q1: January 1st to March 31st"
      );
      expect(expenditureReportPeriodsMap[2]).toBe("Q2: April 1st to June 30th");
      expect(expenditureReportPeriodsMap[3]).toBe(
        "Q3: July 1st to September 30th"
      );
      expect(expenditureReportPeriodsMap[4]).toBe(
        "Q4: October 1st to December 31st"
      );
    });
  });

  describe("generateReportYearOptions", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should generate options for between launch year (2025) and current year + 1", () => {
      jest.setSystemTime(new Date("2025-06-15"));
      const options = generateReportYearOptions();

      expect(options).toHaveLength(2);
      expect(options[0].value).toBe("2026");
      expect(options[1].value).toBe("2025");
    });

    it("should generate correct option structure", () => {
      jest.setSystemTime(new Date("2026-05-05"));
      const options = generateReportYearOptions();

      expect(options[0]).toEqual({
        id: "reportYear-2027",
        label: "2027",
        name: "2027",
        value: "2027",
      });
    });

    it("should return options in descending order", () => {
      jest.setSystemTime(new Date("2027-01-01"));
      const options = generateReportYearOptions();

      const years = options.map((opt) => parseInt(opt.value));
      expect(years).toEqual([...years].sort((a, b) => b - a));
    });
  });

  describe("prepareExpenditurePayload", () => {
    it("should format payload with correct metadata structure", () => {
      const activeState = "CA";
      const formData = {
        reportYear: { value: "2025" },
        reportPeriod: { value: "1", label: "Q1: January 1st to March 31st" },
      };

      const result = prepareExpenditurePayload(activeState, formData);

      expect(result).toEqual({
        metadata: {
          reportYear: 2025,
          reportPeriod: 1,
          submissionName: "CA: 2025 - Q1: January 1st to March 31st",
        },
      });
    });

    it("should handle undefined activeState", () => {
      const formData = {
        reportYear: { value: "2025" },
        reportPeriod: { value: "2", label: "Q2: April 1st to June 30th" },
      };

      const result = prepareExpenditurePayload(undefined, formData);

      expect(result.metadata.submissionName).toBe(
        "undefined: 2025 - Q2: April 1st to June 30th"
      );
    });
  });
});
