import { render } from "@testing-library/react";
import { ReportContext } from "components";
import {
  ExportedReportPage,
  formatSectionHeader,
  reportTitle,
  SAR_RET,
  WP_SAR_GENERAL_INFORMATION,
  WP_SAR_STATE_AND_TERRITORY,
} from "./ExportedReportPage";
import {
  mockEmptyReportStore,
  mockReportJson,
  mockReportPeriod,
  mockReportStore,
  mockReportYear,
  mockStandardReportPageJson,
  mockStateName,
  mockUseStore,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { ReportType, ReportShape } from "types";

import { useStore } from "utils";

jest.mock("utils/state/useStore");

global.structuredClone = jest.fn((val) => {
  if (!val) {
    return;
  }

  return JSON.parse(JSON.stringify(val));
});

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockReport = mockUseStore.report;

const wpRoutes = (withChildren: boolean) =>
  [WP_SAR_GENERAL_INFORMATION, WP_SAR_STATE_AND_TERRITORY, SAR_RET].map(
    (name, index) => ({
      name,
      path: `/mock/mock-route-${index}`,
      pageType: "standard",
      verbiage: {
        intro: {
          section: "",
          subsection: name,
        },
      },
      children: withChildren && [
        {
          name: `${name} - Child Subsection`,
          path: `/mock/mock-route-${index}/1`,
          pageType: "standard",
          verbiage: {
            intro: {
              section: "",
              subsection: `${name} - Child Subsection Intro`,
            },
          },
        },
        {
          name: `${name} -  Not a Subsection`,
          path: `/mock/mock-route-${index}/2`,
          pageType: "standard",
          verbiage: {
            intro: {
              section: `${name} - Not a Subsection Intro`,
            },
          },
        },
      ],
    })
  );

const exportedReportPage = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportPage />
  </ReportContext.Provider>
);

describe("ExportedReportPage", () => {
  test("loads WP with children", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    localStorage.setItem("selectedReportType", "WP");

    mockWpReportContext.report.reportType = ReportType.WP;
    mockWpReportContext.report.formTemplate.routes = wpRoutes(true);

    const page = render(exportedReportPage(mockReportJson));
    const h1 = page.getByRole("heading", { level: 1 });
    const hiddenSectionHeading = page.queryByRole("heading", {
      level: 2,
      name: WP_SAR_STATE_AND_TERRITORY,
    });
    const visibleSectionHeading = page.getByRole("heading", {
      level: 2,
      name: SAR_RET,
    });

    expect(h1).toHaveTextContent(
      `${mockStateName} MFP Work Plan for ${mockReportYear} - Period ${mockReportPeriod}`
    );
    expect(hiddenSectionHeading).not.toBeInTheDocument();
    expect(visibleSectionHeading).toBeInTheDocument();
  });

  test("loads WP without children", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    localStorage.setItem("selectedReportType", "WP");

    mockWpReportContext.report.reportType = ReportType.WP;
    mockWpReportContext.report.formTemplate.routes = wpRoutes(false);

    const page = render(exportedReportPage(mockReportJson));
    const hiddenSectionHeading = page.queryByRole("heading", {
      level: 2,
      name: WP_SAR_GENERAL_INFORMATION,
    });
    const visibleSectionHeading = page.queryByRole("heading", {
      level: 2,
      name: WP_SAR_STATE_AND_TERRITORY,
    });

    expect(hiddenSectionHeading).not.toBeInTheDocument();
    expect(visibleSectionHeading).toBeInTheDocument();
  });

  test("loads SAR", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    localStorage.setItem("selectedReportType", "SAR");

    mockWpReportContext.report.reportType = ReportType.SAR;
    mockWpReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];

    const page = render(exportedReportPage(mockReportJson));
    const h1 = page.getByRole("heading", { level: 1 });

    expect(h1).toHaveTextContent(
      `${mockStateName} Semi-Annual Progress Report (SAR) for ${mockReportYear} - Period ${mockReportPeriod}`
    );
  });

  test("shows loading... if there is no report", async () => {
    mockedUseStore.mockReturnValue(mockEmptyReportStore);
    localStorage.setItem("selectedReportType", "WP");

    mockWpReportContext.report.formTemplate.routes = [];
    const page = render(exportedReportPage(mockReportJson));
    const loadingText = page.getByText("Loading...");
    expect(loadingText).toBeVisible();
  });
});

describe("reportTitle", () => {
  test("should generate the correct title for WP report type", () => {
    const reportType = ReportType.WP;
    const reportPage = { heading: "MFP Work Plan for" };
    const report: ReportShape = mockReport!;

    const result = reportTitle(reportType, reportPage, report);

    expect(result).toBe(
      `${mockStateName} MFP Work Plan for ${mockReportYear} - Period ${mockReportPeriod}`
    );
  });

  test("should generate the correct title for SAR report type", () => {
    const reportType = ReportType.SAR;
    const reportPage = { heading: "Semi-Annual Progress Report (SAR) for" };
    const report: ReportShape = mockReport!;

    const result = reportTitle(reportType, reportPage, report);

    expect(result).toBe(
      `${mockStateName} Semi-Annual Progress Report (SAR) for ${mockReportYear} - Period ${mockReportPeriod}`
    );
  });

  test("should throw an error for an unknown report type", () => {
    const reportType: any = "unknown report type";
    const report: ReportShape = mockReport!;

    expect(() => reportTitle(reportType, undefined, report)).toThrowError(
      `The title for report type ${reportType} has not been implemented.`
    );
  });
});

describe("formatSectionHeader", () => {
  test("should generate the correct header", () => {
    const header = "Test reporting period";
    const report: ReportShape = mockReport!;

    const result = formatSectionHeader(report, header);

    expect(result).toBe(
      `Test January 1 to June 30, ${mockReportYear} reporting period`
    );
  });
});
