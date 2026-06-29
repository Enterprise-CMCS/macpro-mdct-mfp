import { fireEvent, render, screen } from "@testing-library/react";
// types
import { ReportType } from "types";
// components
import { MobileDashboardTable } from "./MobileDashboardTable";
import {
  mockSARFullReport,
  mockWPArchivedReport,
  mockWPCopiedReport,
  mockWPFullReport,
  mockWPSubmittedReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const createProps = (overrides = {}) => ({
  reportsByState: [mockWPFullReport],
  reportId: undefined,
  reportType: ReportType.WP,
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

const mobileDashboardTable = (overrides = {}) => (
  <RouterWrappedComponent>
    <MobileDashboardTable {...createProps(overrides)} />
  </RouterWrappedComponent>
);

describe("<MobileDashboardTable />", () => {
  describe("Rendering rows", () => {
    test("should render a row for each report", () => {
      render(
        mobileDashboardTable({
          reportsByState: [
            { ...mockWPFullReport, id: "row-1" },
            { ...mockWPFullReport, id: "row-2" },
          ],
        })
      );
      expect(screen.getAllByTestId("mobile-row")).toHaveLength(2);
    });

    test("should render the submission name", () => {
      render(mobileDashboardTable());
      expect(screen.getByText(mockWPFullReport.submissionName)).toBeVisible();
    });

    test("should render the copied-from text for copied reports", () => {
      render(
        mobileDashboardTable({
          reportsByState: [mockWPCopiedReport, mockWPFullReport],
        })
      );
      expect(
        screen.getByText(
          `copied from ${mockWPFullReport.reportYear} - Period ${mockWPFullReport.reportPeriod}`
        )
      ).toBeVisible();
    });

    test("should render the report status", () => {
      render(mobileDashboardTable({ reportsByState: [mockWPFullReport] }));
      expect(screen.getByText("Not started")).toBeVisible();
    });

    test("should render 'Archived' status for archived reports", () => {
      render(
        mobileDashboardTable({
          reportsByState: [mockWPArchivedReport],
          isAdmin: true,
        })
      );
      expect(screen.getAllByText("Archived").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Edit reporting button", () => {
    test("should show Edit reporting for a non-admin, non-WP report", () => {
      render(
        mobileDashboardTable({
          reportType: ReportType.SAR,
          reportsByState: [mockSARFullReport],
          isAdmin: false,
        })
      );
      expect(
        screen.getByRole("button", {
          name: `Edit reporting ${mockSARFullReport.reportYear} period ${mockSARFullReport.reportPeriod}`,
        })
      ).toBeVisible();
    });

    test("should not show Edit reporting when user is admin", () => {
      render(
        mobileDashboardTable({
          reportType: ReportType.SAR,
          reportsByState: [mockSARFullReport],
          isAdmin: true,
        })
      );
      expect(
        screen.queryByRole("button", {
          name: `Edit reporting ${mockSARFullReport.reportYear} period ${mockSARFullReport.reportPeriod}`,
        })
      ).not.toBeInTheDocument();
    });

    test("should not show Edit reporting for WP reports", () => {
      render(
        mobileDashboardTable({
          reportType: ReportType.WP,
          reportsByState: [mockWPFullReport],
          isAdmin: false,
        })
      );
      expect(
        screen.queryByRole("button", { name: /Edit reporting/ })
      ).not.toBeInTheDocument();
    });

    test("should call openCreateReportModal when Edit reporting is clicked", () => {
      const openCreateReportModal = jest.fn();
      render(
        mobileDashboardTable({
          reportType: ReportType.SAR,
          reportsByState: [mockSARFullReport],
          isAdmin: false,
          openCreateReportModal,
        })
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: `Edit reporting ${mockSARFullReport.reportYear} period ${mockSARFullReport.reportPeriod}`,
        })
      );
      expect(openCreateReportModal).toHaveBeenCalledWith(mockSARFullReport);
    });
  });

  describe("Enter report button", () => {
    test("should render 'Edit' for a state user when report is not locked", () => {
      render(
        mobileDashboardTable({
          isStateLevelUser: true,
          reportsByState: [{ ...mockWPFullReport, locked: false }],
        })
      );
      expect(screen.getByText("Edit")).toBeVisible();
    });

    test("should render 'View' for a non-state user", () => {
      render(mobileDashboardTable({ isStateLevelUser: false }));
      expect(screen.getByText("View")).toBeVisible();
    });

    test("should render 'View' for a state user when report is locked", () => {
      render(
        mobileDashboardTable({
          isStateLevelUser: true,
          reportsByState: [{ ...mockWPFullReport, locked: true }],
        })
      );
      expect(screen.getByText("View")).toBeVisible();
    });

    test("should render a spinner while entering the selected report", () => {
      const { container } = render(
        mobileDashboardTable({
          entering: true,
          reportId: mockWPFullReport.id,
        })
      );
      expect(container.querySelector(".chakra-spinner")).toBeInTheDocument();
    });

    test("should call enterSelectedReport when clicked", () => {
      const enterSelectedReport = jest.fn();
      render(mobileDashboardTable({ enterSelectedReport }));
      fireEvent.click(screen.getByText("Edit"));
      expect(enterSelectedReport).toHaveBeenCalledWith(mockWPFullReport);
    });
  });

  describe("Admin action buttons", () => {
    const adminProps = (overrides = {}) =>
      createProps({
        isAdmin: true,
        isStateLevelUser: false,
        reportType: ReportType.WP,
        ...overrides,
      });

    const renderAdmin = (overrides = {}) =>
      render(
        <RouterWrappedComponent>
          <MobileDashboardTable {...adminProps(overrides)} />
        </RouterWrappedComponent>
      );

    test("should disable the Unlock button when report is not submitted", () => {
      renderAdmin({ reportsByState: [mockWPFullReport] });
      expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
    });

    test("should enable the Unlock button when report is submitted", () => {
      const releaseReport = jest.fn();
      renderAdmin({
        reportsByState: [mockWPSubmittedReport],
        releaseReport,
      });
      const unlockButton = screen.getByRole("button", { name: "Unlock" });
      expect(unlockButton).toBeEnabled();
      fireEvent.click(unlockButton);
      expect(releaseReport).toHaveBeenCalledWith(mockWPSubmittedReport);
    });

    test("should render the Archive button and call archive when clicked", () => {
      const archive = jest.fn();
      renderAdmin({ reportsByState: [mockWPFullReport], archive });
      const archiveButton = screen.getByRole("button", { name: "Archive" });
      expect(archiveButton).toBeVisible();
      fireEvent.click(archiveButton);
      expect(archive).toHaveBeenCalledWith(mockWPFullReport);
    });

    test("should render 'Archived' text instead of a button for archived reports", () => {
      renderAdmin({ reportsByState: [mockWPArchivedReport] });
      expect(screen.getByTestId("archived")).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Archive" })
      ).not.toBeInTheDocument();
    });

    test("should not render admin buttons for non-admin users", () => {
      render(
        mobileDashboardTable({
          reportsByState: [mockWPFullReport],
          isAdmin: false,
        })
      );
      expect(
        screen.queryByRole("button", { name: "Unlock" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Archive" })
      ).not.toBeInTheDocument();
    });
  });
  testA11yAct(mobileDashboardTable());
});
