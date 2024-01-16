import { render, screen } from "@testing-library/react";
// components
import { ReportContext, ExportedReportMetadataTable } from "components";
// utils
import { ReportShape, ReportStatus, ReportType } from "types";
import wpVerbiage from "verbiage/pages/wp/wp-export";
import sarVerbiage from "verbiage/pages/sar/sar-export";
import { bodyRowContent, headerRowLabels } from "./ExportedReportMetadataTable";
import { useStore } from "../../utils";
import { mockUseStore } from "../../utils/testing/setupJest";

jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockWPContext = {
  report: {
    submissionName: "Mock submit",
    dueDate: 1712505600000,
    lastAltered: 1712305600000,
    status: ReportStatus.SUBMITTED,
    lastAlteredBy: "Mock editor",
  },
  reportType: ReportType.WP,
  verbiage: wpVerbiage.reportPage,
};

const mockSARContext = {
  report: {
    submissionName: "Mock submit",
    dueDate: 1712505600000,
    lastAltered: 1712305600000,
    status: ReportStatus.SUBMITTED,
    lastAlteredBy: "Mock editor",
  },
  reportType: ReportType.SAR,
  verbiage: sarVerbiage.reportPage,
};

const metadataTableWithContext = (context: any) => {
  return (
    <ReportContext.Provider value={context}>
      <ExportedReportMetadataTable
        reportType={context.reportType}
        verbiage={context.verbiage}
      />
    </ReportContext.Provider>
  );
};

describe("ExportedReportMetadataTable renders", () => {
  it("Should render visibly", () => {
    const { getByTestId } = render(metadataTableWithContext(mockWPContext));
    const metadataTable = getByTestId("exportedReportMetadataTable");
    expect(metadataTable).toBeVisible();
  });
});

describe("ExportedReportMetadataTable displays the correct content", () => {
  it("Should show the correct headers for WP", () => {
    render(metadataTableWithContext(mockWPContext));
    const headerTexts = Object.values(
      wpVerbiage.reportPage.metadataTableHeaders
    );
    for (let headerText of headerTexts) {
      const headerCell = screen.getByText(headerText);
      expect(headerCell).toBeVisible();
    }
  });
  it("Should show the correct headers for SAR", () => {
    render(metadataTableWithContext(mockSARContext));
    const headerTexts = Object.values(
      sarVerbiage.reportPage.metadataTableHeaders
    );
    for (let headerText of headerTexts) {
      const headerCell = screen.getByText(headerText);
      expect(headerCell).toBeVisible();
    }
  });
  it("Should show the correct data for WP", () => {
    render(metadataTableWithContext(mockWPContext));
    const cellTexts = [
      "2023 - Alabama 1",
      "05/05/1975",
      "02/24/1975",
      "Not started",
      "Thelonious States",
    ];
    for (let cellText of cellTexts) {
      const cell = screen.getByText(cellText);
      expect(cell).toBeVisible();
    }
  });
});

describe("ExportedReportMetadataTable fails gracefully when appropriate", () => {
  const unknownReportType = "some new report type" as ReportType;

  it("Should throw an error when rendering the header for an unknown report type", () => {
    expect(() => headerRowLabels(unknownReportType, {})).toThrow(Error);
  });
  it("Should throw an error when rendering the body for an unknown report type", () => {
    expect(() => bodyRowContent(unknownReportType, {} as ReportShape)).toThrow(
      Error
    );
  });
  it("Should render no data when not given a report", () => {
    expect(
      bodyRowContent(unknownReportType, null as any as ReportShape)
    ).toEqual([[]]);
  });
});
