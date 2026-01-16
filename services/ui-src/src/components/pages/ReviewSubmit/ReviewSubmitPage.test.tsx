import { act, render, screen, waitFor } from "@testing-library/react";
// components
import { ReportContext, ReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./ReviewSubmitPage";
// types
import { ReportStatus, ReportType } from "types";
// utils
import {
  mockAdminUserStore,
  mockReportMethods,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";
// verbiage
import reviewVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const WpReviewSubmitPage = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <ReviewSubmitPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockFilledReport = {
  ...mockUseStore.report,
  status: ReportStatus.IN_PROGRESS,
  isComplete: true,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": true,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
};

const mockSubmittedReport = {
  ...mockFilledReport,
  status: ReportStatus.SUBMITTED,
};

describe("<ReviewSubmitPage />", () => {
  describe("Review and Submit Page Functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("User has not started filling out the form", () => {
      test("Show alert message if status is NOT_STARTED and is not able to be submitted", () => {
        mockedUseStore.mockReturnValue(mockUseStore);
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MFP Work Plan")!).toBeDisabled();
      });

      test("Admin users get same experience and can't submit form", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          user: mockAdminUserStore,
        });
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MFP Work Plan")!).toBeDisabled();
      });
    });

    describe("User has errors on the form", () => {
      test("Show alert message that form has not been filled out and is not able to be submitted", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: { ...mockUseStore.report, status: ReportStatus.IN_PROGRESS },
        });
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MFP Work Plan")!).toBeDisabled();

        const unfilledPageImg = document.querySelector(
          "img[alt='Error notification']"
        );
        expect(unfilledPageImg).toBeVisible();
      });

      test("Admin users get same experience and can't submit form", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: { ...mockUseStore.report, status: ReportStatus.IN_PROGRESS },
          user: mockAdminUserStore,
        });
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MFP Work Plan")!).toBeDisabled();

        const unfilledPageImg = document.querySelector(
          "img[alt='Error notification']"
        );
        expect(unfilledPageImg).toBeVisible();
      });
    });

    describe("User has filled out the form correctly", () => {
      test("Show no alert message or errors and the submit button is enabled", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockFilledReport,
        });
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.queryByText(title)).not.toBeInTheDocument();
        expect(screen.queryByText(description)).not.toBeInTheDocument();
        expect(screen.getByText("Submit MFP Work Plan")!).not.toBeDisabled();
        const unfilledPageImg = document.querySelector(
          "img[alt='Error notification']"
        );
        expect(unfilledPageImg).toBe(null);
      });

      test("WpReviewPage shows modal on submit button click", async () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockFilledReport,
        });
        render(WpReviewSubmitPage);
        const { review } = reviewVerbiage;
        const { modal, pageLink } = review;
        const submitCheckButton = screen.getByText(pageLink.text)!;
        await act(async () => {
          await userEvent.click(submitCheckButton);
        });
        const modalTitle = screen.getByText(modal.structure.heading)!;
        await waitFor(() => {
          expect(modalTitle).toBeVisible();
        });
      });

      test("WpReviewSubmitPage updates report status on submit confirmation", async () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockFilledReport,
        });
        render(WpReviewSubmitPage);
        const reviewSubmitButton = screen.getByText("Submit MFP Work Plan")!;
        await act(async () => {
          await userEvent.click(reviewSubmitButton);
        });
        const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
        await act(async () => {
          await userEvent.click(modalSubmitButton);
        });
        await expect(mockReportMethods.submitReport).toHaveBeenCalledTimes(1);
      });

      test("WpReviewSubmitPage renders success state when report status is 'submitted'", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockSubmittedReport,
        });
        render(WpReviewSubmitPage);
        const { submitted } = reviewVerbiage;
        const { intro } = submitted;
        expect(screen.getByText(intro.header)).toBeVisible();
      });

      test("Admin users see form is filled but can not submit the form", () => {
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockFilledReport,
          user: mockAdminUserStore,
        });
        render(WpReviewSubmitPage);
        const { alertBox } = reviewVerbiage;
        const { title, description } = alertBox;
        expect(screen.queryByText(title)).not.toBeInTheDocument();
        expect(screen.queryByText(description)).not.toBeInTheDocument();
        expect(screen.getByText("Submit MFP Work Plan")!).toBeDisabled();
        const unfilledPageImg = document.querySelector(
          "img[alt='Error notification']"
        );
        expect(unfilledPageImg).toBe(null);
      });
    });

    describe("Console errors", () => {
      test("should not show console errors", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        mockedUseStore.mockReturnValue({
          ...mockUseStore,
          report: mockFilledReport,
        });
        render(WpReviewSubmitPage);

        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("When loading a sucessfully submitted report (Success Message Generator)", () => {
    test("should give the full success date if given all params", () => {
      const submissionName = "test-program";
      const reportType = ReportType.WP;
      const submittedDate = 1663163109045;
      const submittersName = "Carol California";
      const fullReportType = "Work Plan";
      expect(
        SuccessMessageGenerator(
          reportType,
          submissionName,
          submittedDate,
          submittersName
        )
      ).toEqual([
        `MFP ${fullReportType} submission for `,
        <b>{`${submissionName}`}</b>,
        ` was submitted on Wednesday, September 14, 2022 by ${submittersName}.`,
      ]);
    });

    test("should give a reduced version if not given all params", () => {
      const submissionName = "test-program";
      const reportType = ReportType.SAR;
      const submittedDate = undefined;
      const submittersName = "Carol California";
      const fullReportType = "SAR";

      expect(
        SuccessMessageGenerator(
          reportType,
          submissionName,
          submittedDate,
          submittersName
        )
      ).toBe(`${fullReportType} report for ${submissionName} was submitted.`);
    });
  });

  describe("Report not started", () => {
    testA11yAct(WpReviewSubmitPage, () => {
      mockedUseStore.mockReturnValue(mockUseStore);
    });
  });

  describe("Report in progress", () => {
    testA11yAct(WpReviewSubmitPage, () => {
      mockedUseStore.mockReturnValue({
        ...mockUseStore,
        report: { ...mockUseStore.report, status: ReportStatus.IN_PROGRESS },
      });
    });
  });

  describe("Report submitted", () => {
    testA11yAct(WpReviewSubmitPage, () => {
      mockedUseStore.mockReturnValue({
        ...mockUseStore,
        report: mockSubmittedReport,
      });
    });
  });
});
