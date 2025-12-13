import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  RouterWrappedComponent,
  mockUseStore,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";
import { useStore } from "../../utils";
import { mockExpenditureOneNotStartedReportContext } from "utils/testing/expenditure/mockExpenditure";
import { CreateExpenditureModal } from "./CreateExpenditureModal";

const mockCreateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockExpenditureOneNotStartedReportContext,
  createReport: mockCreateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <CreateExpenditureModal
        activeState="CA"
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<CreateExpenditureModal />", () => {
  describe("Test CreateExpenditureModal", () => {
    beforeEach(async () => {
      await act(async () => {
        await render(modalComponent);
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("CreateExpenditureModal shows the content", () => {
      expect(screen.getByText("Start new")).toBeTruthy();
    });

    test("CreateExpenditureModal top close button can be clicked", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test CreateExpenditureModal functionality for new Expenditure Report", () => {
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
      await act(async () => {
        await userEvent.click(firstRadio);
        await userEvent.click(secondRadio);
        await userEvent.click(submitButton);
      });
    };

    test("Adding a new report", async () => {
      const mockDate = new Date(2025, 5, 1).getTime();
      mockedDateNow.mockImplementation(() => mockDate);

      await render(modalComponent);
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual("Add new MFP Expenditure Report");
      await fillForm();
      await act(async () => {
        await expect(mockCreateReport).toHaveBeenCalledTimes(1);
        await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
        await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
      });
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

      await act(async () => {
        await userEvent.click(firstChoice);
        await userEvent.click(secondChoice);
        await userEvent.click(submitButton);
      });

      const newData = { reportYear: 2026, reportPeriod: 2 };

      expect(mockCreateReport).toHaveBeenCalledWith(
        "EXPENDITURE",
        "CA",
        expect.objectContaining({ metadata: expect.objectContaining(newData) })
      );
    });

    testA11yAct(modalComponent);
  });
});
