import { render, screen } from "@testing-library/react";
// types
import { ReportMetadataShape, ReportType } from "types";
// components
import {
  DashboardTable,
  getStatus,
  tableBody,
  ActionButton,
} from "./DashboardTable";
import {
  mockSARFullReport,
  mockWPFullReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { mockFinancialReportNotStartedReport } from "utils/testing/financial-report/mockFinancialReport";

describe("<DashboardTable />", () => {
  describe("Edit reporting button label", () => {
    const createProps = (overrides = {}) => ({
      reportsByState: [mockSARFullReport],
      reportType: ReportType.SAR,
      reportId: undefined,
      body: {
        table: {
          caption: "test",
          headRow: ["Submission name", "Status", "Actions"],
          bodyRows: [],
        },
      },
      openCreateReportModal: jest.fn(),
      enterSelectedReport: jest.fn(),
      archive: jest.fn(),
      entering: false,
      releaseReport: jest.fn(),
      releasing: false,
      isStateLevelUser: true,
      isAdmin: false,
      sxOverride: {},
      ...overrides,
    });

    test("should show View reporting when user is admin", () => {
      render(
        <RouterWrappedComponent>
          <DashboardTable {...createProps({ isAdmin: true })} />
        </RouterWrappedComponent>
      );

      expect(
        screen.getByRole("button", {
          name: "View reporting of 2023 - Alabama 1",
        })
      ).toBeVisible();
    });

    test("should show Edit reporting when user is not admin", () => {
      render(
        <RouterWrappedComponent>
          <DashboardTable {...createProps({ isAdmin: false })} />
        </RouterWrappedComponent>
      );

      expect(
        screen.getByRole("button", {
          name: "Edit reporting of 2023 - Alabama 1",
        })
      ).toBeVisible();
    });
  });

  describe("getStatus()", () => {
    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus(ReportType.WP, "In revision", false, 1)).toBe(
        "In revision"
      );
    });

    test("should render the correct status if report been started", () => {
      expect(getStatus(ReportType.WP, "In progress", false, 0)).toBe(
        "In progress"
      );
    });

    test("should render the correct status if report has been archived", () => {
      expect(getStatus(ReportType.WP, "In progress", true, 1)).toBe("Archived");
    });

    test("should render the correct status if report has been submitted", () => {
      expect(getStatus(ReportType.WP, "Submitted", false, 1)).toBe("Submitted");
    });

    test("should render the correct status if report has not started", () => {
      expect(getStatus(ReportType.WP, "Not started", false, 1)).toBe(
        "Not started"
      );
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus(ReportType.SAR, "In progress", false, 1)).toBe(
        "In progress"
      );
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus(ReportType.SAR, "Not started", false, 1)).toBe(
        "Not started"
      );
    });
  });

  describe("tableBody()", () => {
    const all = {
      headRow: ["row1", "Due date", "Target populations", "#"],
    };
    const adminBody = {
      headRow: ["row1", "#"],
    };
    const stateBody = {
      headRow: ["row1", "Due date", "Target populations"],
    };
    const noHeadRow = {
      caption: "Test",
    };

    test("should remove Due date and Target populations rows for admin", () => {
      expect(tableBody(all, true)).toEqual(adminBody);
    });

    test("should remove # row for non-admin", () => {
      expect(tableBody(all, false)).toEqual(stateBody);
    });

    test("should return original body if no headRow key", () => {
      expect(tableBody(noHeadRow, false)).toEqual(noHeadRow);
    });
  });

  describe("tableBody() with object headers", () => {
    test("should preserve object header properties when not filtered", () => {
      const withPreservedObject = {
        headRow: [
          "Name",
          { title: "Status", align: "center" as const, colSpan: 1 },
          { title: "Actions", colSpan: 2, align: "center" as const },
        ],
      };
      const result = tableBody(withPreservedObject, false);
      expect(result.headRow).toEqual(withPreservedObject.headRow);
    });
  });

  describe("<ActionButton /> conditional width", () => {
    test("should render with auto width for Work Plan report", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={mockWPFullReport}
            reportId="test-id"
            isStateLevelUser={true}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      const button = screen.getByTestId("enter-report");
      expect(button).toHaveStyle({ width: "auto" });
    });

    test("should render with 5rem width for non-Work Plan report (SAR)", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={mockSARFullReport}
            reportId="test-id"
            isStateLevelUser={true}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      const button = screen.getByTestId("enter-report");
      expect(button).toHaveStyle({ width: "5rem" });
    });

    test("should render with 5rem width for Financial Report", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={mockFinancialReportNotStartedReport}
            reportId="test-id"
            isStateLevelUser={true}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      const button = screen.getByTestId("enter-report");
      expect(button).toHaveStyle({ width: "5rem" });
    });

    test("should display Edit text for state level user", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={mockSARFullReport}
            reportId="test-id"
            isStateLevelUser={true}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      expect(
        screen.getByRole("button", { name: "Edit 2024 Period 1 report" })
      ).toBeVisible();
    });

    test("should display View text for locked report", () => {
      const lockedReport = {
        ...mockSARFullReport,
        locked: true,
      } as ReportMetadataShape;
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={lockedReport}
            reportId="test-id"
            isStateLevelUser={true}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      expect(
        screen.getByRole("button", { name: "View 2024 Period 1 report" })
      ).toBeVisible();
    });

    test("should display View text for non-state-level user", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            report={mockSARFullReport}
            reportId="test-id"
            isStateLevelUser={false}
            entering={false}
            enterSelectedReport={() => {}}
          />
        </RouterWrappedComponent>
      );
      expect(
        screen.getByRole("button", { name: "View 2024 Period 1 report" })
      ).toBeVisible();
    });
  });
});
