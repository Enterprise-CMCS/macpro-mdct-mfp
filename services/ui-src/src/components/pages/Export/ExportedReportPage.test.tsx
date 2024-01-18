import { render } from "@testing-library/react";
import { ReportContext } from "components";
import { ExportedReportPage, reportTitle } from "./ExportedReportPage";
import {
  mockStandardReportPageJson,
  mockReportJson,
  mockWpReportContext,
  mockSARReportContext,
} from "utils/testing/setupJest";
import { ReportType, ReportShape } from "types";

const exportedReportPage = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportPage />
  </ReportContext.Provider>
);

describe("reportTitle", () => {
  it("should generate the correct title for WP report type", () => {
    const reportType = ReportType.WP;
    const reportPage = { heading: "Report Heading" };
    const report: ReportShape = {
      fieldData: { stateName: "State", otherFields: "...otherFields" },
      reportYear: 2022,
      reportPeriod: "Q1",
    };

    const result = reportTitle(reportType, reportPage, report);

    expect(result).toBe("State Report Heading 2022 - Period Q1");
  });

  it("should generate the correct title for SAR report type", () => {
    const reportType = ReportType.SAR;
    const reportPage = { heading: "Report Heading" };
    const report: ReportShape = {
      fieldData: { stateName: "State", otherFields: "...otherFields" },
      reportYear: 2022,
      reportPeriod: "Q1",
    };

    const result = reportTitle(reportType, reportPage, report);

    expect(result).toBe("State Report Heading 2022 - Period Q1");
  });

  it("should throw an error for an unknown report type", () => {
    const unknownReportType = "UnknownType";
    const reportPage = { heading: "Report Heading" };
    const report: ReportShape = {
      fieldData: { stateName: "State", otherFields: "...otherFields" },
      reportYear: 2022,
      reportPeriod: "Q1",
    };

    expect(() =>
      reportTitle(unknownReportType, reportPage, report)
    ).toThrowError(
      `The title for report type ${unknownReportType} has not been implemented.`
    );
  });
});

describe("Test ExportedReportPage Functionality", () => {
  test("Is the export page visible for WP Reports", async () => {
    localStorage.setItem("selectedReportType", "WP");

    mockWpReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage(mockReportJson));
    const loadingText = page.getByText("Loading...");
    expect(loadingText).toBeVisible();
  });

  test("Is the export page visible for SAR Reports", async () => {
    localStorage.setItem("selectedReportType", "SAR");
    localStorage.getItem("selectedReportType");
    mockSARReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage(mockReportJson));
    const loadingText = page.getByText("Loading...");
    expect(loadingText).toBeVisible();
  });
});
