import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// types
import { ReportType } from "types";
// components
import {
  ActionButton,
  DashboardTable,
  getStatus,
  tableBody,
} from "./DashboardTable";
import {
  mockSARFullReport,
  mockWPArchivedReport,
  mockWPFullReport,
  mockWPSubmittedReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

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

const dashboardTable = (
  <RouterWrappedComponent>
    <DashboardTable {...createProps()} />
  </RouterWrappedComponent>
);

describe("<DashboardTable />", () => {
  describe("Edit reporting button label", () => {
    test("should not show Edit reporting button when user is admin", () => {
      render(
        <RouterWrappedComponent>
          <DashboardTable {...createProps({ isAdmin: true })} />
        </RouterWrappedComponent>
      );

      expect(
        screen.queryByRole("button", {
          name: "Edit reporting of 2023 - Alabama 1",
        })
      ).not.toBeInTheDocument();
    });

    test("should show Edit reporting when user is not admin", () => {
      render(dashboardTable);

      expect(
        screen.getByRole("button", {
          name: "Edit reporting of 2023 - Alabama 1",
        })
      ).toBeVisible();
    });
  });

  describe("getStatus()", () => {
    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("In revision", false)).toBe("In revision");
    });

    test("should render the correct status if report been started", () => {
      expect(getStatus("In progress", false)).toBe("In progress");
    });

    test("should render the correct status if report has been archived", () => {
      expect(getStatus("In progress", true)).toBe("Archived");
    });

    test("should render the correct status if report has been submitted", () => {
      expect(getStatus("Submitted", false)).toBe("Submitted");
    });

    test("should render the correct status if report has not started", () => {
      expect(getStatus("Not started", false)).toBe("Not started");
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus("In progress", false)).toBe("In progress");
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus("Not started", false)).toBe("Not started");
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

  describe("<ActionButton />", () => {
    const createActionButtonProps = (overrides = {}) => ({
      report: mockWPFullReport,
      reportId: undefined,
      isStateLevelUser: true,
      entering: false,
      enterSelectedReport: jest.fn(),
      ...overrides,
    });

    test("should render 'Edit' for a state user when report is not locked", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            {...createActionButtonProps({
              report: { ...mockWPFullReport, locked: false },
            })}
          />
        </RouterWrappedComponent>
      );
      expect(screen.getByText("Edit")).toBeVisible();
    });

    test("should render 'View' for a non-state user", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            {...createActionButtonProps({ isStateLevelUser: false })}
          />
        </RouterWrappedComponent>
      );
      expect(screen.getByText("View")).toBeVisible();
    });

    test("should render 'View' for a state user when report is locked", () => {
      render(
        <RouterWrappedComponent>
          <ActionButton
            {...createActionButtonProps({
              report: { ...mockWPFullReport, locked: true },
            })}
          />
        </RouterWrappedComponent>
      );
      expect(screen.getByText("View")).toBeVisible();
    });

    test("should render a spinner while entering the selected report", () => {
      const { container } = render(
        <RouterWrappedComponent>
          <ActionButton
            {...createActionButtonProps({
              entering: true,
              reportId: mockWPFullReport.id,
            })}
          />
        </RouterWrappedComponent>
      );
      expect(container.querySelector(".chakra-spinner")).toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("should call enterSelectedReport when clicked", async () => {
      const enterSelectedReport = jest.fn();
      render(
        <RouterWrappedComponent>
          <ActionButton {...createActionButtonProps({ enterSelectedReport })} />
        </RouterWrappedComponent>
      );
      await userEvent.click(screen.getByTestId("enter-report"));
      expect(enterSelectedReport).toHaveBeenCalledWith(mockWPFullReport);
    });
  });

  describe("Admin action buttons", () => {
    const createAdminProps = (overrides = {}) => ({
      reportsByState: [mockWPFullReport],
      reportType: ReportType.WP,
      reportId: undefined,
      body: {
        table: {
          caption: "test",
          headRow: ["Submission name", "Status", "#", "Actions"],
          bodyRows: [],
        },
      },
      openCreateReportModal: jest.fn(),
      enterSelectedReport: jest.fn(),
      archive: jest.fn(),
      entering: false,
      releaseReport: jest.fn(),
      releasing: false,
      isStateLevelUser: false,
      isAdmin: true,
      sxOverride: {},
      ...overrides,
    });

    test("should disable the Unlock button when report is not submitted", () => {
      render(
        <RouterWrappedComponent>
          <DashboardTable
            {...createAdminProps({ reportsByState: [mockWPFullReport] })}
          />
        </RouterWrappedComponent>
      );
      expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
    });

    test("should enable the Unlock button when report is submitted", async () => {
      const releaseReport = jest.fn();
      render(
        <RouterWrappedComponent>
          <DashboardTable
            {...createAdminProps({
              reportsByState: [mockWPSubmittedReport],
              releaseReport,
            })}
          />
        </RouterWrappedComponent>
      );
      const unlockButton = screen.getByRole("button", { name: "Unlock" });
      expect(unlockButton).toBeEnabled();
      await userEvent.click(unlockButton);
      expect(releaseReport).toHaveBeenCalledWith(mockWPSubmittedReport);
    });

    test("should render the Archive button and call archive when clicked", async () => {
      const archive = jest.fn();
      render(
        <RouterWrappedComponent>
          <DashboardTable
            {...createAdminProps({
              reportsByState: [mockWPFullReport],
              archive,
            })}
          />
        </RouterWrappedComponent>
      );
      const archiveButton = screen.getByRole("button", { name: "Archive" });
      expect(archiveButton).toBeVisible();
      await userEvent.click(archiveButton);
      expect(archive).toHaveBeenCalledWith(mockWPFullReport);
    });

    test("should render 'Archived' text instead of a button for archived reports", () => {
      render(
        <RouterWrappedComponent>
          <DashboardTable
            {...createAdminProps({ reportsByState: [mockWPArchivedReport] })}
          />
        </RouterWrappedComponent>
      );
      // "Archived" appears in both the status column and the action cell
      expect(screen.getAllByText("Archived").length).toBeGreaterThanOrEqual(1);
      expect(
        screen.queryByRole("button", { name: "Archive" })
      ).not.toBeInTheDocument();
    });
  });
  testA11yAct(dashboardTable);
});
