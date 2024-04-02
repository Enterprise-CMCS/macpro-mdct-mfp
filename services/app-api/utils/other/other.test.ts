import { ReportType } from "../types";
import { getReportPeriod, getReportYear } from "./other";

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
  isReset: false,
};

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

    const response = getReportYear(ReportType.WP, reportData, false);

    expect(response).toEqual(2020);
  });

  it("should return the report year for a copied work plan", () => {
    const reportData = {
      ...mockUnvalidatedMetadata,
      copyReport: { reportYear: 2020, reportPeriod: 1, isCopyOverTest: true },
    };

    const response = getReportYear(ReportType.WP, reportData, true);

    expect(response).toEqual(2020);
  });

  it("should return the report year for a copied work plan with reportPeriod 2", () => {
    const reportData = {
      ...mockWPData,
      copyReport: { isCopyOverTest: true, reportPeriod: 2, reportYear: 2020 },
    };

    const response = getReportYear(ReportType.WP, reportData, true);

    expect(response).toEqual(2021);
  });

  it("should return the report year for a SAR", () => {
    const reportData = { ...mockWPData, reportPeriod: 1, reportYear: 2020 };
    const response = getReportYear(ReportType.SAR, reportData, false);

    expect(response).toEqual(2020);
  });

  it("should throw an error if the report year is not a number", () => {
    const reportData = { ...mockUnvalidatedMetadata, reportYear: "2020" };

    expect(() => getReportYear(ReportType.WP, reportData, false)).toThrow(
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

    const response = getReportPeriod(ReportType.WP, reportData, false);

    expect(response).toEqual(1);
  });

  it("should return the report period for a copied work plan", () => {
    const reportData = {
      ...mockWPData,
      copyReport: { isCopyOverTest: true, reportPeriod: 1, reportYear: 2020 },
    };
    const response = getReportPeriod(ReportType.WP, reportData, true);

    expect(response).toEqual(2);
  });

  it("should return the report period for a copied work plan with reportPeriod 2", () => {
    const reportData = {
      ...mockWPData,
      copyReport: { isCopyOverTest: true, reportPeriod: 2, reportYear: 2020 },
    };
    const responsePeriod = getReportPeriod(ReportType.WP, reportData, true);

    const responseYear = getReportYear(ReportType.WP, reportData, true);

    expect(responsePeriod).toEqual(1);
    expect(responseYear).toEqual(2021);
  });

  it("should return the report period for a SAR", () => {
    const reportData = { ...mockWPData, reportPeriod: 1, reportYear: 2020 };
    const response = getReportPeriod(ReportType.SAR, reportData, false);

    expect(response).toEqual(1);
  });

  it("should throw an error if the report period is not a number", () => {
    const reportData = { ...mockUnvalidatedMetadata, reportPeriod: "2" };

    expect(() => getReportPeriod(ReportType.WP, reportData, false)).toThrow(
      "Invalid value for reportPeriod"
    );
  });
});
