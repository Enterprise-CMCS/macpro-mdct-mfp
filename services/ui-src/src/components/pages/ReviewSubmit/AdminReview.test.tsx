import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext } from "components";
import { AdminReview } from "./AdminReview";
// utils
import {
  mockAdminUserStore,
  mockReportMethods,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { approveReport, useStore } from "utils";
// types
import { ReportStatus, ReportType } from "types";
// verbiage
import WPReviewVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import SARReviewVerbiage from "verbiage/pages/sar/sar-review-and-submit";
import FinancialReportingFormReviewVerbiage from "verbiage/pages/financial-report/financial-report-review-and-submit";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/api/requestMethods/report", () => ({
  ...jest.requireActual("utils/api/requestMethods/report"),
  approveReport: jest.fn(),
  releaseReport: jest.fn(),
}));
const mockApproveReport = approveReport as jest.MockedFunction<
  typeof approveReport
>;

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockUseNavigate,
}));

const ReviewSubmitPage = (verbiage: any) => {
  return (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockReportMethods}>
        <AdminReview
          reviewVerbiage={verbiage}
          submitting={false}
          submitForm={() => {}}
        />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );
};

describe("<AdminReview />", () => {
  describe("MFP WP Review and Submit Page Functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("Review and Submit Page - Admin View", () => {
      test("Show admin view when admin user is logged in", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));
        expect(screen.getByRole("button", { name: "Approve" })).toBeVisible();
      });

      test("Disable unlock and approve buttons when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.WP,
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));
        expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
      });

      test("Enable unlock and approve buttons when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.WP,
            status: ReportStatus.SUBMITTED,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));
        expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
      });

      test("should not show console errors", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });

    describe("Review and Submit Page - Approval submission", () => {
      const wpSubmittedReport = {
        reportType: ReportType.WP,
        status: ReportStatus.SUBMITTED,
        state: "AL",
        id: "mock-report-id",
        formTemplate: { basePath: "/mfp/wp" },
      };

      const openApproveModal = async () => {
        // open the approve confirmation modal
        await userEvent.click(screen.getByRole("button", { name: "Approve" }));
        // type the required confirmation text to enable the modal button
        await userEvent.type(screen.getByRole("textbox"), "APPROVE");
      };

      test("Shows an error alert and re-enables the button when approval fails", async () => {
        mockApproveReport.mockRejectedValueOnce(new Error("Request Failed"));
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: wpSubmittedReport,
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));

        await openApproveModal();
        const modalApproveButton = screen.getByTestId("modal-approve-button");
        await userEvent.click(modalApproveButton);

        expect(mockApproveReport).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).not.toHaveBeenCalled();
        expect(
          await screen.findByText("Report could not be approved")
        ).toBeInTheDocument();
        // button re-enabled so the admin can retry
        expect(modalApproveButton).toBeEnabled();
      });
    });
  });

  describe("MFP SAR Review and Submit Page Functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("Review and Submit Page - Admin View", () => {
      test("Show admin view when admin user is logged in", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.SAR,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeVisible();
      });

      test("Disable unlock and approve buttons when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.SAR,
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
      });

      test("Enable unlock and approve buttons when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.SAR,
            status: ReportStatus.SUBMITTED,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeEnabled();
      });

      test("should not show console errors", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.SAR,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("MFP Financial Reporting Form Review and Submit Page Functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("Review and Submit Page - Admin View", () => {
      test("Show admin view when admin user is logged in", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.FINANCIAL_REPORT,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeVisible();
      });

      test("Disable unlock button when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.FINANCIAL_REPORT,
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
      });

      test("Enable unlock button when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.FINANCIAL_REPORT,
            status: ReportStatus.SUBMITTED,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeEnabled();
      });

      test("should not show console errors", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.FINANCIAL_REPORT,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
