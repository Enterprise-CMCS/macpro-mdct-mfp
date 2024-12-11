import { render, screen } from "@testing-library/react";
// components
import { ReportContext } from "components";
// utils
import {
  mockAdminUserStore,
  mockReportMethods,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import WPReviewVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import SARReviewVerbiage from "verbiage/pages/sar/sar-review-and-submit";
import { AdminReview } from "./AdminReview";
// types
import { ReportStatus } from "types";

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
        const { review } = WPReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.submitLink.text)).toBeVisible();
      });

      test("Disable unlock and approve buttons when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: "WP",
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));
        const { review } = WPReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.submitLink.text)).toBeDisabled();
      });

      test("Enable unlock and approve buttons when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: "WP",
            status: ReportStatus.SUBMITTED,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(WPReviewVerbiage));
        const { review } = WPReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.submitLink.text)).toBeEnabled();
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
            reportType: "SAR",
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        const { review } = SARReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.unlockLink.text)).toBeVisible();
      });

      test("Disable unlock and approve buttons when report is unlocked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: "SAR",
            status: ReportStatus.IN_PROGRESS,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        const { review } = SARReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.unlockLink.text)).toBeDisabled();
      });

      test("Enable unlock and approve buttons when report is locked", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: "SAR",
            status: ReportStatus.SUBMITTED,
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));
        const { review } = SARReviewVerbiage;
        const { adminInfo } = review;
        expect(screen.getByText(adminInfo.unlockLink.text)).toBeEnabled();
      });

      test("should not show console errors", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: {
            reportType: "SAR",
          },
          user: mockAdminUserStore,
        });
        render(ReviewSubmitPage(SARReviewVerbiage));

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
