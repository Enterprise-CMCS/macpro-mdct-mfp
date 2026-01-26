import {
  expenditureReportPeriodsMap,
  generateCopyReportOptions,
  generateReportYearOptions,
  prepareExpenditurePayload,
} from "./expenditureLogic";
import { ReportStatus } from "types";

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

  describe("generateCopyReportOptions", () => {
    const noEligibleOption = {
      id: "copyReport-none",
      label: "No reports eligble for copy",
      name: "No reports eligble for copy",
      value: "",
    };

    it("should return no eligible option when reportsByState is undefined", () => {
      const result = generateCopyReportOptions(undefined);

      expect(result).toEqual([noEligibleOption]);
    });

    it("should return no eligible option when reportsByState is empty", () => {
      const result = generateCopyReportOptions([]);

      expect(result).toEqual([noEligibleOption]);
    });

    it("should return no eligible option when no reports have SUBMITTED or APPROVED status", () => {
      const reports = [
        {
          id: "report-1",
          submissionName: "CA: 2025 - Q1",
          status: ReportStatus.NOT_STARTED,
        },
        {
          id: "report-2",
          submissionName: "CA: 2025 - Q2",
          status: ReportStatus.IN_PROGRESS,
        },
      ];

      const result = generateCopyReportOptions(reports as any);

      expect(result).toEqual([noEligibleOption]);
    });

    it("should return options for SUBMITTED reports", () => {
      const reports = [
        {
          id: "report-1",
          submissionName: "CA: 2025 - Q1: January 1st to March 31st",
          status: ReportStatus.SUBMITTED,
        },
      ];

      const result = generateCopyReportOptions(reports as any);

      expect(result).toEqual([
        {
          id: "copyReport-report-1",
          label: "CA: 2025 - Q1: January 1st to March 31st",
          name: "CA: 2025 - Q1: January 1st to March 31st",
          value: "report-1",
        },
      ]);
    });

    it("should return options for APPROVED reports", () => {
      const reports = [
        {
          id: "report-2",
          submissionName: "CA: 2025 - Q2: April 1st to June 30th",
          status: ReportStatus.APPROVED,
        },
      ];

      const result = generateCopyReportOptions(reports as any);

      expect(result).toEqual([
        {
          id: "copyReport-report-2",
          label: "CA: 2025 - Q2: April 1st to June 30th",
          name: "CA: 2025 - Q2: April 1st to June 30th",
          value: "report-2",
        },
      ]);
    });

    it("should return only SUBMITTED and APPROVED reports when mixed statuses exist", () => {
      const reports = [
        {
          id: "report-1",
          submissionName: "CA: 2025 - Q1",
          status: ReportStatus.NOT_STARTED,
        },
        {
          id: "report-2",
          submissionName: "CA: 2025 - Q2",
          status: ReportStatus.SUBMITTED,
        },
        {
          id: "report-3",
          submissionName: "CA: 2025 - Q3",
          status: ReportStatus.IN_PROGRESS,
        },
        {
          id: "report-4",
          submissionName: "CA: 2025 - Q4",
          status: ReportStatus.APPROVED,
        },
      ];

      const result = generateCopyReportOptions(reports as any);

      expect(result).toHaveLength(2);
      expect(result[0].value).toBe("report-2");
      expect(result[1].value).toBe("report-4");
    });
  });

  describe("prepareExpenditurePayload", () => {
    it("should format payload with correct metadata structure without copyReport", () => {
      const activeState = "CA";
      const formData = {
        reportYear: { value: "2025" },
        reportPeriod: { value: "1", label: "Q1: January 1st to March 31st" },
      };

      const result = prepareExpenditurePayload(activeState, formData);

      expect(result).toEqual({
        metadata: {
          copyReport: false,
          reportYear: 2025,
          reportPeriod: 1,
          submissionName: "CA: 2025 - Q1: January 1st to March 31st",
        },
      });
    });

    it("should format payload for different report periods", () => {
      const activeState = "TX";
      const formData = {
        reportYear: { value: "2026" },
        reportPeriod: { value: "3" },
      };

      const result = prepareExpenditurePayload(activeState, formData);

      expect(result.metadata.submissionName).toBe(
        "TX: 2026 - Q3: July 1st to September 30th"
      );
      expect(result.metadata.reportPeriod).toBe(3);
    });

    it("should include copyReport when valid report ID is provided", () => {
      const activeState = "NY";
      const formData = {
        reportYear: { value: "2025" },
        reportPeriod: { value: "2" },
        copyReport: { value: "report-123" },
      };
      const reportsByState = [
        {
          id: "report-123",
          submissionName: "NY: 2024 - Q4",
          status: ReportStatus.SUBMITTED,
          reportYear: 2024,
          reportPeriod: 4,
        },
      ];

      const result = prepareExpenditurePayload(
        activeState,
        formData,
        reportsByState as any
      );

      expect(result.metadata.copyReport).toEqual(reportsByState[0]);
    });

    it("should set copyReport to false when report ID is not found in reportsByState", () => {
      const activeState = "FL";
      const formData = {
        reportYear: { value: "2025" },
        reportPeriod: { value: "4" },
        copyReport: { value: "nonexistent-id" },
      };
      const reportsByState = [
        {
          id: "report-456",
          submissionName: "FL: 2024 - Q1",
          status: ReportStatus.APPROVED,
        },
      ];

      const result = prepareExpenditurePayload(
        activeState,
        formData,
        reportsByState as any
      );

      expect(result.metadata.copyReport).toBe(false);
    });

    it("should set copyReport to false when reportsByState is undefined", () => {
      const activeState = "AZ";
      const formData = {
        reportYear: { value: "2026" },
        reportPeriod: { value: "1" },
        copyReport: { value: "report-789" },
      };

      const result = prepareExpenditurePayload(
        activeState,
        formData,
        undefined
      );

      expect(result.metadata.copyReport).toBe(false);
    });
  });
});
