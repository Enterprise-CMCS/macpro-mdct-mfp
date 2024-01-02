import { render, screen } from "@testing-library/react";
// components
import { ReportContext } from "components";
// utils
import {
  mockAdminUserStore,
  mockLDFlags,
  mockReportMethods,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import reviewVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import { AdminReview } from "./AdminReview";
// types
import { ReportStatus } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

mockLDFlags.setDefault({ pdfExport: false });

const WpReviewSubmitPage = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <AdminReview
        reviewVerbiage={reviewVerbiage}
        submitting={false}
        submitForm={() => {}}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("MFP Review and Submit Page Functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Review and Submit Page - Admin View", () => {
    test("Show admin view when admin user is logged in", () => {
      mockedUseStore.mockReturnValue({
        ...mockUseStore,
        user: mockAdminUserStore,
      });
      render(WpReviewSubmitPage);
      const { review } = reviewVerbiage;
      const { adminInfo } = review;
      expect(screen.getByText(adminInfo.submitLink.text)).toBeVisible();
    });

    test("Disable unlock and approve buttons when report is unlocked", () => {
      mockedUseStore.mockReturnValue({
        ...mockUseStore,
        report: {
          status: ReportStatus.IN_PROGRESS,
        },
        user: mockAdminUserStore,
      });
      render(WpReviewSubmitPage);
      const { review } = reviewVerbiage;
      const { adminInfo } = review;
      expect(screen.getByText(adminInfo.submitLink.text)).toBeDisabled();
    });

    test("Enable unlock and approve buttons when report is locked", () => {
      mockedUseStore.mockReturnValue({
        ...mockUseStore,
        report: {
          status: ReportStatus.SUBMITTED,
        },
        user: mockAdminUserStore,
      });
      render(WpReviewSubmitPage);
      const { review } = reviewVerbiage;
      const { adminInfo } = review;
      expect(screen.getByText(adminInfo.submitLink.text)).toBeEnabled();
    });
  });
});
