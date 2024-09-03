import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  RouterWrappedComponent,
  mockWpReportContext,
  mockWPApprovedFullReport,
  mockUseStore,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { CreateWorkPlanModal } from "./CreateWorkPlanModal";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";
import { useStore } from "../../utils";

const mockCreateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockWpReportContext,
  createReport: mockCreateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <CreateWorkPlanModal
        isResetting={false}
        activeState="CA"
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentWithPreviousReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <CreateWorkPlanModal
        isResetting={false}
        activeState="CA"
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
        previousReport={mockWPApprovedFullReport}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentForResetReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <CreateWorkPlanModal
        isResetting={true}
        activeState="CA"
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
        previousReport={mockWPApprovedFullReport}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<CreateWorkPlanModal />", () => {
  describe("Test CreateWorkPlanModal", () => {
    beforeEach(async () => {
      await act(async () => {
        await render(modalComponent);
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("CreateWorkPlanModal shows the content", () => {
      expect(screen.getByText("Start new")).toBeTruthy();
    });

    test("CreateWorkPlanModal top close button can be clicked", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test CreateWorkPlanModal functionality for new Work Plan", () => {
    const mockedDateNow = jest.spyOn(Date, "now");

    afterEach(() => {
      jest.clearAllMocks();
    });

    const fillForm = async () => {
      const submitButton = screen.getByRole("button", { name: "Start new" });
      const firstRadio = screen.getByLabelText("2025") as HTMLInputElement;
      const secondRadio = screen.getByLabelText(
        "First reporting period (January 1 - June 30)"
      ) as HTMLInputElement;
      await userEvent.click(firstRadio);
      await userEvent.click(secondRadio);
      await userEvent.click(submitButton);
    };

    test("Adding a new report", async () => {
      const mockDate = new Date(2025, 5, 1).getTime();
      mockedDateNow.mockImplementation(() => mockDate);

      await render(modalComponent);
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual("Add new MFP Work Plan");
      expect(screen.getByTestId("create-work-plan-form")).toBeTruthy();
      await fillForm();
      await expect(mockCreateReport).toHaveBeenCalledTimes(1);
      await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
      await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("There should only be two options for reportYear if it is 2024", async () => {
      global.Date.now = jest.fn(() => new Date(2024, 5, 1).getTime());

      await render(modalComponent);
      const reportPeriodOptionsLength = 2;

      expect(
        screen.getAllByRole("radio").length - reportPeriodOptionsLength
      ).toBe(2);
    });

    test("There should only be three options for reportYear if it is NOT 2024", async () => {
      global.Date.now = jest.fn(() => new Date(2025, 5, 1).getTime());
      await render(modalComponent);
      const reportPeriodOptionsLength = 2;

      expect(
        screen.getAllByRole("radio").length - reportPeriodOptionsLength
      ).toBe(3);
    });

    test("The metadata reportYear and reportPeriod should reflect the choices in the modal", async () => {
      const mockDate = new Date(2025, 5, 1).getTime();
      mockedDateNow.mockImplementation(() => mockDate);

      await render(modalComponent);

      const submitButton = screen.getByRole("button", { name: "Start new" });
      const firstChoice = screen.getByLabelText("2026") as HTMLInputElement;
      const secondChoice = screen.getByLabelText(
        "Second reporting period (July 1 - December 31)"
      ) as HTMLInputElement;

      await userEvent.click(firstChoice);
      await userEvent.click(secondChoice);
      await userEvent.click(submitButton);

      const newData = { reportYear: 2026, reportPeriod: 2 };

      expect(mockCreateReport).toHaveBeenCalledWith(
        "WP",
        "CA",
        expect.objectContaining({ metadata: expect.objectContaining(newData) })
      );
    });

    testA11yAct(modalComponent);
  });

  describe("Test CreateWorkPlanModal functionality for continuing Work Plan", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const fillForm = async () => {
      const submitButton = screen.getByRole("button", {
        name: "Continue from previous period",
      });
      await userEvent.click(submitButton);
    };

    test("Adding a new report", async () => {
      await act(async () => {
        await render(modalComponentWithPreviousReport);
      });
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual("Continue MFP Work Plan");
      await fillForm();
      await expect(mockCreateReport).toHaveBeenCalledTimes(1);
      await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
      await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    testA11yAct(modalComponentWithPreviousReport);
  });

  describe("Test CreateWorkPlanModal functionality for resetting a Work Plan", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const fillForm = async () => {
      const submitButton = screen.getByRole("button", { name: "Start new" });
      const firstRadio = screen.getByLabelText("2025") as HTMLInputElement;
      const secondRadio = screen.getByLabelText(
        "First reporting period (January 1 - June 30)"
      ) as HTMLInputElement;
      await userEvent.click(firstRadio);
      await userEvent.click(secondRadio);
      await userEvent.click(submitButton);
    };

    test("Error shows when selected data matches existing report", async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      await act(async () => {
        await render(modalComponentForResetReport);
      });
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual(
        "Are you sure you want to start a blank new Work Plan?"
      );
      const firstRadio = screen.getByLabelText("2024") as HTMLInputElement;
      const secondRadio = screen.getByLabelText(
        "First reporting period (January 1 - June 30)"
      ) as HTMLInputElement;
      await userEvent.click(firstRadio);
      await userEvent.click(secondRadio);
      expect(
        screen.getByText(
          "A MFP Work Plan for this Reporting Period already exists"
        )
      ).toBeVisible();
      const nextYearRadio = screen.getByLabelText("2025") as HTMLInputElement;
      await userEvent.click(nextYearRadio);
      expect(
        screen.queryByText(
          "A MFP Work Plan for this Reporting Period already exists"
        )
      ).not.toBeInTheDocument();
    });

    test("Adding a new report", async () => {
      await act(async () => {
        await render(modalComponentForResetReport);
      });
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual(
        "Are you sure you want to start a blank new Work Plan?"
      );
      await fillForm();
      await expect(mockCreateReport).toHaveBeenCalledTimes(1);
      await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
      await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    testA11yAct(modalComponentForResetReport);
  });
});
