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
const mockUpdateReport = jest.fn();

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

const existingReport = {
  id: "existing-report-id",
  fieldData: { existingField: "value" },
};

const modalWithExistingReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={{
        ...mockedReportContext,
        updateReport: mockUpdateReport,
      }}
    >
      <CreateExpenditureModal
        activeState="CA"
        selectedReport={existingReport}
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
      expect(screen.getByText("Update submission")).toBeTruthy();
    });

    test("CreateExpenditureModal top close button can be clicked", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test CreateExpenditureModal functionality for new Expenditure Report", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const fillForm = async () => {
      const submitButton = screen.getByRole("button", {
        name: "Update submission",
      });
      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;
      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "2");
        await userEvent.click(submitButton);
      });
    };

    test("Adding a new report", async () => {
      render(modalComponent);
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual(
        "Add new MFP Expenditure Report submission"
      );
      await fillForm();
      await act(async () => {
        expect(mockCreateReport).toHaveBeenCalledTimes(1);
        expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
        expect(mockCloseHandler).toHaveBeenCalledTimes(1);
      });
    });

    test("The metadata reportYear and reportPeriod should reflect the choices in the modal", async () => {
      render(modalComponent);

      const submitButton = screen.getByRole("button", {
        name: "Update submission",
      });
      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2026");
        await userEvent.selectOptions(periodDropdown, "2");
        await userEvent.click(submitButton);
      });

      const newData = { reportYear: 2026, reportPeriod: 2 };

      expect(mockCreateReport).toHaveBeenCalledWith(
        "EXPENDITURE",
        "CA",
        expect.objectContaining({ metadata: expect.objectContaining(newData) })
      );
    });

    test("Submit button is disabled while submitting", async () => {
      render(modalComponent);

      const submitButton = screen.getByRole("button", {
        name: "Update submission",
      });
      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "2");
        await userEvent.click(submitButton);
      });

      expect(submitButton).toBeDisabled();
    });
    describe("Test writeReport function", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("writeReport disables submit button during submission", async () => {
        render(modalComponent);

        const submitButton = screen.getByRole("button", {
          name: "Update submission",
        });
        const yearDropdown = screen.getByLabelText(
          "Reporting Year"
        ) as HTMLInputElement;
        const periodDropdown = screen.getByLabelText(
          "Reporting Period"
        ) as HTMLInputElement;

        await act(async () => {
          await userEvent.selectOptions(yearDropdown, "2025");
          await userEvent.selectOptions(periodDropdown, "2");
        });

        expect(submitButton).not.toBeDisabled();

        await act(async () => {
          await userEvent.click(submitButton);
        });

        expect(submitButton).toBeDisabled();
      });

      test("writeReport calls updateReport when selectedReport.id exists", async () => {
        render(modalWithExistingReport);

        const submitButton = screen.getByRole("button", {
          name: "Update submission",
        });
        const yearDropdown = screen.getByLabelText(
          "Reporting Year"
        ) as HTMLInputElement;
        const periodDropdown = screen.getByLabelText(
          "Reporting Period"
        ) as HTMLInputElement;

        await act(async () => {
          await userEvent.selectOptions(yearDropdown, "2025");
          await userEvent.selectOptions(periodDropdown, "2");
          await userEvent.click(submitButton);
        });

        expect(mockUpdateReport).toHaveBeenCalledWith(
          {
            reportType: "EXPENDITURE",
            state: "CA",
            id: "existing-report-id",
          },
          expect.objectContaining({
            metadata: expect.objectContaining({
              reportYear: 2025,
              reportPeriod: 2,
            }),
            fieldData: { existingField: "value" },
          })
        );
        expect(mockCreateReport).not.toHaveBeenCalled();
        expect(mockCloseHandler).toHaveBeenCalledTimes(1);
        expect(mockFetchReportsByState).toHaveBeenCalledWith(
          "EXPENDITURE",
          "CA"
        );
      });
    });

    testA11yAct(modalComponent);
  });
});
