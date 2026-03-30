import { handleFinancialReportFilter } from "./dashboardFilterLogic";
import { ReportMetadataShape } from "types";

describe("dashboardFilterLogic", () => {
  describe("handleFinancialReportFilter", () => {
    const mockReports: ReportMetadataShape[] = [
      { reportYear: 2025, reportPeriod: 1 },
      { reportYear: 2025, reportPeriod: 2 },
      { reportYear: 2026, reportPeriod: 1 },
      { reportYear: 2026, reportPeriod: 3 },
    ] as ReportMetadataShape[];

    it("should return all reports when both filters are 'All'", () => {
      const result = handleFinancialReportFilter("All", "All", mockReports);
      expect(result).toEqual(mockReports);
      expect(result).toHaveLength(4);
    });

    it("should filter by year when filterYear is specific and filterQuarter is 'All'", () => {
      const result = handleFinancialReportFilter("2025", "All", mockReports);
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockReports[0], mockReports[1]]);
    });

    it("should filter by quarter when filterYear is 'All' and filterQuarter is specific", () => {
      const result = handleFinancialReportFilter("All", "1", mockReports);
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockReports[0], mockReports[2]]);
    });

    it("should filter by both year and quarter when both are specific", () => {
      const result = handleFinancialReportFilter("2026", "3", mockReports);
      expect(result).toHaveLength(1);
      expect(result).toEqual([mockReports[3]]);
    });

    it("should return empty array when no reports match filters", () => {
      const result = handleFinancialReportFilter("2024", "4", mockReports);
      expect(result).toEqual([]);
    });

    it("should return empty array when listOfReports is undefined", () => {
      const result = handleFinancialReportFilter("All", "All", undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array when listOfReports is empty", () => {
      const result = handleFinancialReportFilter("All", "All", []);
      expect(result).toEqual([]);
    });
  });
});
