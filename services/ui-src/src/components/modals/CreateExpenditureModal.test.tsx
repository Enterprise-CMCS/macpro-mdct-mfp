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
import { ReportStatus } from "types";

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
      expect(screen.getByText("Save")).toBeTruthy();
    });

    test("CreateExpenditureModal top close button can be clicked", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalled();
    });
  });

  describe("Test CreateExpenditureModal functionality for new Expenditure Report", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const fillForm = async (
      yearValue: string,
      periodValue: string,
      submitButtonText: string
    ) => {
      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", {
        name: submitButtonText,
      });
      await act(async () => {
        await userEvent.selectOptions(yearDropdown, yearValue);
        await userEvent.selectOptions(periodDropdown, periodValue);
        await userEvent.click(submitButton);
      });
    };

    test("Adding a new report", async () => {
      render(modalComponent);
      const header = screen.getByRole("heading", { level: 1 });
      expect(header.textContent).toEqual(
        "Add new MFP Expenditure Report submission"
      );
      await fillForm("2025", "1", "Save");
      await act(async () => {
        expect(mockCreateReport).toHaveBeenCalledTimes(1);
        expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
        expect(mockCloseHandler).toHaveBeenCalledTimes(1);
      });
    });

    test("The metadata reportYear and reportPeriod should reflect the choices in the modal", async () => {
      render(modalComponent);

      await fillForm("2026", "2", "Save");

      const newData = { reportYear: 2026, reportPeriod: 2 };

      expect(mockCreateReport).toHaveBeenCalledWith(
        "EXPENDITURE",
        "CA",
        expect.objectContaining({ metadata: expect.objectContaining(newData) })
      );
    });

    test("Submit button is disabled while submitting", async () => {
      render(modalComponent);

      await fillForm("2025", "1", "Save");
      const submitButton = screen.getByRole("button", {
        name: "Save",
      });
      expect(submitButton).toBeDisabled();
    });

    describe("Test writeReport function", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("writeReport disables submit button during submission", async () => {
        render(modalComponent);

        const yearDropdown = screen.getByLabelText(
          "Reporting Year"
        ) as HTMLInputElement;
        const periodDropdown = screen.getByLabelText(
          "Reporting Period"
        ) as HTMLInputElement;
        const returnButton = screen.getByRole("button", {
          name: "Save",
        });

        await act(async () => {
          await userEvent.selectOptions(yearDropdown, "2025");
          await userEvent.selectOptions(periodDropdown, "2");
        });

        expect(returnButton).not.toBeDisabled();

        await act(async () => {
          await userEvent.click(returnButton);
        });

        expect(returnButton).toBeDisabled();
      });

      test("writeReport calls updateReport when selectedReport.id exists", async () => {
        render(modalWithExistingReport);

        await fillForm("2025", "2", "Update submission");

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

    describe("Test CreateExpenditureModal view-only mode", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Modal is in view-only mode when userIsAdmin is true", async () => {
        const adminModal = (
          <RouterWrappedComponent>
            <ReportContext.Provider value={mockedReportContext}>
              <CreateExpenditureModal
                activeState="CA"
                selectedReport={{
                  ...existingReport,
                  status: ReportStatus.SUBMITTED,
                }}
                userIsAdmin={true}
                modalDisclosure={{
                  isOpen: true,
                  onClose: mockCloseHandler,
                }}
              />
            </ReportContext.Provider>
          </RouterWrappedComponent>
        );

        render(adminModal);

        const returnButton = screen.getByRole("button", {
          name: "Return",
        });

        await act(async () => {
          await userEvent.click(returnButton);
        });

        expect(mockCloseHandler).toHaveBeenCalled();
        expect(mockCreateReport).not.toHaveBeenCalled();
        expect(mockUpdateReport).not.toHaveBeenCalled();
      });

      test("Modal is in view-only mode when report status is SUBMITTED", async () => {
        const submittedReportModal = (
          <RouterWrappedComponent>
            <ReportContext.Provider value={mockedReportContext}>
              <CreateExpenditureModal
                activeState="CA"
                selectedReport={{
                  ...existingReport,
                  status: ReportStatus.SUBMITTED,
                }}
                userIsAdmin={false}
                modalDisclosure={{
                  isOpen: true,
                  onClose: mockCloseHandler,
                }}
              />
            </ReportContext.Provider>
          </RouterWrappedComponent>
        );

        render(submittedReportModal);

        const returnButton = screen.getByRole("button", {
          name: "Return",
        });

        await act(async () => {
          await userEvent.click(returnButton);
        });

        expect(mockCloseHandler).toHaveBeenCalled();
        expect(mockCreateReport).not.toHaveBeenCalled();
        expect(mockUpdateReport).not.toHaveBeenCalled();
      });
    });

    testA11yAct(modalComponent);
  });

  describe("Test duplicate report detection and alert", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Alert shows when selecting a year and period that matches an existing non-archived report", async () => {
      const mockStoreWithReports = {
        ...mockUseStore,
        reportsByState: [
          {
            id: "existing-report-1",
            reportYear: 2025,
            reportPeriod: 1,
            archived: false,
          },
          {
            id: "existing-report-2",
            reportYear: 2024,
            reportPeriod: 2,
            archived: false,
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockStoreWithReports);

      render(modalComponent);

      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "1");
      });

      expect(
        screen.getByText(
          "An MFP Expenditure for this Reporting Period already exists"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "To avoid duplication, please select a different Reporting Year or Reporting Period."
        )
      ).toBeInTheDocument();
    });

    test("Alert does not show when selecting a year and period that matches an archived report", async () => {
      const mockStoreWithArchivedReport = {
        ...mockUseStore,
        reportsByState: [
          {
            id: "archived-report",
            reportYear: 2025,
            reportPeriod: 1,
            archived: true,
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockStoreWithArchivedReport);

      render(modalComponent);

      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "1");
      });

      expect(
        screen.queryByText(
          "An MFP Expenditure for this Reporting Period already exists"
        )
      ).not.toBeInTheDocument();
    });

    test("Alert does not show when selecting a unique year and period combination", async () => {
      const mockStoreWithReports = {
        ...mockUseStore,
        reportsByState: [
          {
            id: "existing-report-1",
            reportYear: 2025,
            reportPeriod: 1,
            archived: false,
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockStoreWithReports);

      render(modalComponent);

      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2026");
        await userEvent.selectOptions(periodDropdown, "2");
      });

      expect(
        screen.queryByText(
          "An MFP Expenditure for this Reporting Period already exists"
        )
      ).not.toBeInTheDocument();
    });

    test("Submit button is disabled when alert is shown", async () => {
      const mockStoreWithReports = {
        ...mockUseStore,
        reportsByState: [
          {
            id: "existing-report-1",
            reportYear: 2025,
            reportPeriod: 1,
            archived: false,
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockStoreWithReports);

      render(modalComponent);

      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", {
        name: "Save",
      });

      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "1");
      });

      expect(submitButton).toBeDisabled();
    });

    test("Alert is hidden when user changes form values after seeing duplicate alert", async () => {
      const mockStoreWithReports = {
        ...mockUseStore,
        reportsByState: [
          {
            id: "existing-report-1",
            reportYear: 2025,
            reportPeriod: 1,
            archived: false,
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockStoreWithReports);

      render(modalComponent);

      const yearDropdown = screen.getByLabelText(
        "Reporting Year"
      ) as HTMLInputElement;
      const periodDropdown = screen.getByLabelText(
        "Reporting Period"
      ) as HTMLInputElement;

      // First select values that trigger the alert
      await act(async () => {
        await userEvent.selectOptions(yearDropdown, "2025");
        await userEvent.selectOptions(periodDropdown, "1");
      });

      expect(
        screen.getByText(
          "An MFP Expenditure for this Reporting Period already exists"
        )
      ).toBeInTheDocument();

      // Then change to different values
      await act(async () => {
        await userEvent.selectOptions(periodDropdown, "2");
      });

      expect(
        screen.queryByText(
          "An MFP Expenditure for this Reporting Period already exists"
        )
      ).not.toBeInTheDocument();
    });
  });
});
