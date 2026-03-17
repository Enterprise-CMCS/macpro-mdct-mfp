import { render, screen } from "@testing-library/react";
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
import { useStore } from "utils";
// types
import { ReportStatus, ReportType } from "types";
// verbiage
import WPReviewVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import SARReviewVerbiage from "verbiage/pages/sar/sar-review-and-submit";
import FinancialReportingFormReviewVerbiage from "verbiage/pages/expenditure/expenditure-review-and-submit";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

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
            reportType: ReportType.EXPENDITURE,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeVisible();
      });

      test("Disable unlock and approve buttons when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.EXPENDITURE,
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));
        expect(screen.getByRole("button", { name: "Unlock" })).toBeDisabled();
      });

      test("Enable unlock and approve buttons when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: ReportType.EXPENDITURE,
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
            reportType: ReportType.EXPENDITURE,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(FinancialReportingFormReviewVerbiage));

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
