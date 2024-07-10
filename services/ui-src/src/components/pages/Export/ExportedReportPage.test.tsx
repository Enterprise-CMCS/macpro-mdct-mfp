import { render } from "@testing-library/react";
import { ReportContext } from "components";
import {
  ExportedReportPage,
  formatSectionHeader,
  formatSectionInfo,
  reportTitle,
  SAR_RET,
  WP_SAR_GENERAL_INFORMATION,
  WP_SAR_STATE_TERRITORY_INITIATIVES,
  WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS,
} from "./ExportedReportPage";
import {
  mockEmptyReportStore,
  mockForm,
  mockReportJson,
  mockReportPeriod,
  mockReportStore,
  mockReportYear,
  mockStateName,
  mockUseStore,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { ReportType, ReportShape, ReportPageVerbiage } from "types";

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

const createRoutes = (routes: string[], withChildren: boolean) =>
  routes.map((name, index) => ({
    name,
    path: `/mock/mock-route-${index}`,
    pageType: "standard",
    verbiage: {
      intro: {
        exportSectionHeader: name,
        hint: `${name} - Hint`,
        info: `${name} - Info`,
        section: name,
        subsection: name,
      },
      dashboardSubtitle: `${name} - Dashboard Subtitle`,
    },
    form: mockForm,
    children: withChildren && [
      {
        name: `${name} - Child Subsection`,
        path: `/mock/mock-route-${index}/subsection`,
        pageType: "standard",
        verbiage: {
          intro: {
            section: "",
            subsection: `${name} - Child Subsection Intro`,
          },
        },
      },
      {
        name: `${name} - Not a Subsection`,
        path: `/mock/mock-route-${index}/section`,
        pageType: "standard",
        verbiage: {
          intro: {
            section: `${name} - Not a Subsection Intro`,
          },
        },
      },
    ],
  }));

const wpRoutes = [
  WP_SAR_GENERAL_INFORMATION,
  WP_SAR_STATE_TERRITORY_INITIATIVES,
];

const sarRoutes = [
  WP_SAR_GENERAL_INFORMATION,
  WP_SAR_STATE_TERRITORY_INITIATIVES,
  SAR_RET,
];

const exportedReportPage = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportPage />
  </ReportContext.Provider>
);

describe("<ExportedReportPage />", () => {
  describe("ExportedReportPage WP", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockReportStore);
      localStorage.setItem("selectedReportType", "WP");
      mockWpReportContext.report.reportType = ReportType.WP;
    });

    test("loads WP with children", async () => {
      mockWpReportContext.report.formTemplate.routes = createRoutes(
        wpRoutes,
        true
      );

      const page = render(exportedReportPage(mockReportJson));
      const h1 = page.getByRole("heading", { level: 1 });
      const sectionHeading = page.queryByRole("heading", {
        level: 2,
        name: WP_SAR_STATE_TERRITORY_INITIATIVES,
      });
      const childHeading = page.getByRole("heading", {
        level: 3,
        name: `${WP_SAR_STATE_TERRITORY_INITIATIVES} - Child Subsection Intro`,
      });

      expect(h1).toHaveTextContent(
        `${mockStateName} MFP Work Plan for ${mockReportYear} - Period ${mockReportPeriod}`
      );
      expect(sectionHeading).not.toBeInTheDocument();
      expect(childHeading).toBeVisible();
    });

    test("loads WP initiatives with correct heading level", async () => {
      const initiativeRoute = {
        name: "WP",
        path: "/mock/mock-route",
        pageType: "standard",
        form: mockForm,
        children: [
          {
            name: WP_SAR_STATE_TERRITORY_INITIATIVES,
            path: "/mock/mock-route/0",
            pageType: "standard",
            verbiage: {
              intro: {
                section: "",
                subsection: WP_SAR_STATE_TERRITORY_INITIATIVES,
              },
            },
          },
          {
            name: WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS,
            path: "/mock/mock-route/1",
            pageType: "standard",
            verbiage: {
              intro: {
                section: "",
                subsection: WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS,
              },
            },
          },
        ],
      };

      mockWpReportContext.report.formTemplate.routes = [initiativeRoute];

      const page = render(exportedReportPage(mockReportJson));
      const sectionHeading1 = page.queryByRole("heading", {
        level: 2,
        name: WP_SAR_STATE_TERRITORY_INITIATIVES,
      });
      const sectionHeading2 = page.getByRole("heading", {
        level: 2,
        name: WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS,
      });

      expect(sectionHeading1).toBeVisible();
      expect(sectionHeading2).toBeVisible();
    });

    test("loads WP without children", async () => {
      mockWpReportContext.report.formTemplate.routes = createRoutes(
        wpRoutes,
        false
      );

      const page = render(exportedReportPage(mockReportJson));
      const sectionHeading = page.getByRole("heading", {
        level: 2,
        name: WP_SAR_STATE_TERRITORY_INITIATIVES,
      });
      const sectionInfo = page.queryByText(
        `${WP_SAR_STATE_TERRITORY_INITIATIVES} - Dashboard Subtitle`
      );

      expect(sectionHeading).toBeVisible();
      expect(sectionInfo).not.toBeInTheDocument();
    });
  });

  describe("ExportedReportPage SAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockReportStore);
      localStorage.setItem("selectedReportType", "SAR");
      mockWpReportContext.report.reportType = ReportType.SAR;
    });

    test("loads SAR with children", async () => {
      mockWpReportContext.report.formTemplate.routes = createRoutes(
        sarRoutes,
        true
      );

      const page = render(exportedReportPage(mockReportJson));
      const h1 = page.getByRole("heading", { level: 1 });
      const sectionHeading1 = page.getByRole("heading", {
        level: 2,
        name: WP_SAR_GENERAL_INFORMATION,
      });
      const sectionHeading2 = page.getByRole("heading", {
        level: 2,
        name: SAR_RET,
      });
      const sectionInfo = page.getByText(`${SAR_RET} - Dashboard Subtitle`);
      const hint1 = page.getByText(`${WP_SAR_GENERAL_INFORMATION} - Hint`);
      const hint2 = page.queryByText(`${SAR_RET} - Hint`);

      expect(h1).toHaveTextContent(
        `${mockStateName} Semi-Annual Progress Report (SAR) for ${mockReportYear} - Period ${mockReportPeriod}`
      );
      expect(sectionHeading1).toBeVisible();
      expect(sectionHeading2).toBeVisible();
      expect(sectionInfo).toBeVisible();
      expect(hint1).toBeVisible();
      expect(hint2).not.toBeInTheDocument();
    });
  });

  describe("No Report", () => {
    test("shows loading... if there is no report", async () => {
      mockedUseStore.mockReturnValue(mockEmptyReportStore);
      mockWpReportContext.report.formTemplate.routes = [];
      const page = render(exportedReportPage(mockReportJson));
      const loadingText = page.getByText("Loading...");
      expect(loadingText).toBeVisible();
    });
  });

  describe("ExportedReportPage utils", () => {
    describe("reportTitle()", () => {
      test("generates the correct title for WP report type", () => {
        const reportType = ReportType.WP;
        const reportPage = { heading: "MFP Work Plan for" };
        const report: ReportShape = mockReport!;
        const result = reportTitle(reportType, reportPage, report);

        expect(result).toBe(
          `${mockStateName} MFP Work Plan for ${mockReportYear} - Period ${mockReportPeriod}`
        );
      });

      test("generates the correct title for SAR report type", () => {
        const reportType = ReportType.SAR;
        const reportPage = { heading: "Semi-Annual Progress Report (SAR) for" };
        const report: ReportShape = mockReport!;
        const result = reportTitle(reportType, reportPage, report);

        expect(result).toBe(
          `${mockStateName} Semi-Annual Progress Report (SAR) for ${mockReportYear} - Period ${mockReportPeriod}`
        );
      });

      test("throws an error for an unknown report type", () => {
        const reportType: any = "unknown report type";
        const report: ReportShape = mockReport!;

        expect(() => reportTitle(reportType, undefined, report)).toThrowError(
          `The title for report type ${reportType} has not been implemented.`
        );
      });
    });

    describe("formatSectionHeader()", () => {
      test("generates the correct header", () => {
        const header = "Test reporting period";
        const report: ReportShape = mockReport!;
        const result = formatSectionHeader(report, header);

        expect(result).toBe(
          `Test January 1 to June 30, ${mockReportYear} reporting period`
        );
      });
    });

    describe("formatSectionInfo()", () => {
      test("displays info", () => {
        const verbiage = {
          intro: {
            subsection: "Subsection",
            info: "Info",
          },
          dashboardSubtitle: "Dashboard Subtitle",
        } as ReportPageVerbiage;
        const result = formatSectionInfo(verbiage);

        expect(result).toBe("Info");
      });

      test("displays dashboardSubtitle if exportSectionHeader", () => {
        const verbiage = {
          intro: {
            subsection: "Subsection",
            exportSectionHeader: "Export Section Header",
            info: "Info",
          },
          dashboardSubtitle: "Dashboard Subtitle",
        } as ReportPageVerbiage;
        const result = formatSectionInfo(verbiage);

        expect(result).toBe("Dashboard Subtitle");
      });

      test("displays dashboardSubtitle if initiatives", () => {
        const verbiage = {
          intro: {
            subsection: WP_SAR_STATE_TERRITORY_INITIATIVES,
            info: "Info",
          },
          dashboardSubtitle: "Dashboard Subtitle",
        } as ReportPageVerbiage;
        const result = formatSectionInfo(verbiage);

        expect(result).toBe("Dashboard Subtitle");
      });
    });
  });
});
