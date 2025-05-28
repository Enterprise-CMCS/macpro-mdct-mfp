import { getReportPeriod, getReportYear, getEligibleWorkPlan } from "./other";
import {
  getReportFieldData,
  queryReportMetadatasForState,
} from "../../storage/reports";
import { ReportStatus } from "../types";

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
  queryReportMetadatasForState: jest.fn(),
}));

const mockWPData = {
  reportType: "WP",
  state: "NJ",
  id: "some id",
  submissionName: "submissionName",
  status: "Approved",
  createdAt: 1699496172798,
  lastAltered: 1699496172798,
  lastAlteredBy: "Anthony Soprano",
  dueDate: 1699496172798,
  locked: false,
};

const mockUnvalidatedMetadata = {
  reportType: "WP",
  state: "NJ",
  id: "some id",
  submissionName: "submissionName",
  status: "Not started",
  createdAt: 1699496172798,
  lastAlteredBy: "Anthony Soprano",
  locked: false,
};

describe("API utility functions", () => {
  describe("getReportYear", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the report year for a new work plan", () => {
      const reportData = {
        ...mockUnvalidatedMetadata,
        reportPeriod: 1,
        reportYear: 2020,
      };

      const response = getReportYear(reportData, false);

      expect(response).toEqual(2020);
    });

    it("should return the report year for a copied work plan", () => {
      const reportData = {
        ...mockUnvalidatedMetadata,
        copyReport: { reportYear: 2020, reportPeriod: 1 },
      };

      const response = getReportYear(reportData, true);

      expect(response).toEqual(2020);
    });

    it("should return the report year for a copied work plan with reportPeriod 2", () => {
      const reportData = {
        ...mockWPData,
        copyReport: { reportPeriod: 2, reportYear: 2020 },
      };

      const response = getReportYear(reportData, true);

      expect(response).toEqual(2021);
    });

    it("should return the report year for a SAR", () => {
      const reportData = { ...mockWPData, reportPeriod: 1, reportYear: 2020 };
      const response = getReportYear(reportData, false);

      expect(response).toEqual(2020);
    });

    it("should throw an error if the report year is not a number", () => {
      const reportData = { ...mockUnvalidatedMetadata, reportYear: "2020" };

      expect(() => getReportYear(reportData, false)).toThrow(
        "Invalid value for reportYear"
      );
    });
  });

  describe("getReportPeriod", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the report period for a new work plan", () => {
      const reportData = {
        ...mockUnvalidatedMetadata,
        reportPeriod: 1,
        reportYear: 2020,
      };

      const response = getReportPeriod(reportData, false);

      expect(response).toEqual(1);
    });

    it("should return the report period for a copied work plan", () => {
      const reportData = {
        ...mockWPData,
        copyReport: { reportPeriod: 1, reportYear: 2020 },
      };
      const response = getReportPeriod(reportData, true);

      expect(response).toEqual(2);
    });

    it("should return the report period for a copied work plan with reportPeriod 2", () => {
      const reportData = {
        ...mockWPData,
        copyReport: { reportPeriod: 2, reportYear: 2020 },
      };
      const responsePeriod = getReportPeriod(reportData, true);

      const responseYear = getReportYear(reportData, true);

      expect(responsePeriod).toEqual(1);
      expect(responseYear).toEqual(2021);
    });

    it("should return the report period for a SAR", () => {
      const reportData = { ...mockWPData, reportPeriod: 1, reportYear: 2020 };
      const response = getReportPeriod(reportData, false);

      expect(response).toEqual(1);
    });

    it("should throw an error if the report period is not a number", () => {
      const reportData = { ...mockUnvalidatedMetadata, reportPeriod: "2" };

      expect(() => getReportPeriod(reportData, false)).toThrow(
        "Invalid value for reportPeriod"
      );
    });
  });

  describe("getEligibleWorkPlan", () => {
    it("Should retrieve the oldest eligible work plan", async () => {
      (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
        {
          status: ReportStatus.IN_PROGRESS,
          associatedSar: undefined,
          createdAt: 1740000000000,
          id: "wrong-status",
        },
        {
          status: ReportStatus.APPROVED,
          associatedSar: "mock-sar-id",
          createdAt: 1730000000000,
          id: "has-sar",
        },
        {
          status: ReportStatus.APPROVED,
          associatedSar: undefined,
          createdAt: 1720000000000,
          id: "not-oldest",
        },
        {
          status: ReportStatus.APPROVED,
          associatedSar: undefined,
          createdAt: 1710000000000,
          id: "just-right",
        },
        {
          status: ReportStatus.APPROVED,
          archived: true,
          associatedSar: undefined,
          createdAt: 1700000000000,
          id: "is-archived",
        },
      ]);
      const mockFieldData = { id: "just-right-data" };
      (getReportFieldData as jest.Mock).mockResolvedValue(mockFieldData);

      const result = await getEligibleWorkPlan("CO");

      expect(result.workPlanMetadata!.id).toBe("just-right");
      expect(result.workPlanFieldData).toBe(mockFieldData);
    });

    it("Should return undefined if no work plans are eligible", async () => {
      (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
        {
          status: ReportStatus.IN_PROGRESS,
          associatedSar: undefined,
          createdAt: 1740000000000,
          id: "wrong-status",
        },
        {
          status: ReportStatus.APPROVED,
          associatedSar: "mock-sar-id",
          createdAt: 1730000000000,
          id: "has-sar",
        },
      ]);

      const result = await getEligibleWorkPlan("CO");

      expect(result.workPlanMetadata).toBeUndefined();
      expect(result.workPlanFieldData).toBeUndefined();
    });
  });
});
