import { act, fireEvent, render, screen } from "@testing-library/react";
import { ReportType } from "../../types";
import {
  RouterWrappedComponent,
  mockWpReportContext,
  mockWPApprovedFullReport,
  mockSARReportContext,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { AddEditReportModal } from "./AddEditReportModal";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedWPReportContext = {
  ...mockWpReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const mockedSARReportContext = {
  ...mockSARReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const mockSelectedSARReport = {
  id: "mock-sar-1",
  formData: {
    reportPeriod: 1,
    associatedWorkPlan: "wp-1",
    stateOrTerritory: "CA",
    populations: [
      {
        id: "targetPopulations-2Vd02CVUtKgBETwqzDXpSIhi",
        label: "Older adults",
        name: "Older adults",
        value: "Older adults",
      },
    ],
    finalSar: [
      {
        value: "No",
        key: "finalSar-ekP9iVvuQE9AALchScDzoD", //pragma: allowlist secret
      },
    ],
  },
};

const modalComponentNewWP = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedWPReportContext}>
      <AddEditReportModal
        activeState="CA"
        selectedReport={undefined}
        reportType={ReportType.WP}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentWithPreviousWP = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedWPReportContext}>
      <AddEditReportModal
        activeState="CA"
        selectedReport={undefined}
        previousReport={mockWPApprovedFullReport}
        reportType={ReportType.WP}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentWithSelectedSAR = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedSARReportContext}>
      <AddEditReportModal
        activeState="CA"
        selectedReport={mockSelectedSARReport}
        previousReport={undefined}
        reportType={ReportType.SAR}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test AddEditReportModal functionality for new Work Plan", () => {
  const mockedDateNow = jest.spyOn(Date, "now");

  afterEach(() => {
    jest.restoreAllMocks();
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

    await render(modalComponentNewWP);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Add new MFP Work Plan");
    await fillForm();
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("There should only be two options for reportYear if it is 2024", async () => {
    global.Date.now = jest.fn(() => new Date(2024, 5, 1).getTime());

    await render(modalComponentNewWP);
    const reportPeriodOptionsLength = 2;

    expect(
      screen.getAllByRole("radio").length - reportPeriodOptionsLength
    ).toBe(2);
  });

  test("There should only be three options for reportYear if it is NOT 2024", async () => {
    global.Date.now = jest.fn(() => new Date(2025, 5, 1).getTime());
    await render(modalComponentNewWP);
    const reportPeriodOptionsLength = 2;

    expect(
      screen.getAllByRole("radio").length - reportPeriodOptionsLength
    ).toBe(3);
  });

  test("The metadata reportYear and reportPeriod should reflect the choices in the modal", async () => {
    const mockDate = new Date(2025, 5, 1).getTime();
    mockedDateNow.mockImplementation(() => mockDate);

    await render(modalComponentNewWP);

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
});

describe("Test AddEditProgramModal with previous WP", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponentWithPreviousWP);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async () => {
    const submitButton = screen.getByRole("button", {
      name: "Continue from previous period",
    });
    await userEvent.click(submitButton);
  };

  test("AddEditReportModal shows the contents", () => {
    expect(
      screen.getByRole("button", { name: "Continue from previous period" })
    ).toBeTruthy();
  });

  test("AddEditReportModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Adding a new report", async () => {
    await render(modalComponentWithPreviousWP);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Continue MFP Work Plan");
    await fillForm();
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal functionality for SAR", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async (option: string) => {
    const firstRadio = screen.getByLabelText(option) as HTMLInputElement;
    await userEvent.click(firstRadio);
    const submitButton = screen.getByRole("button", {
      name: "Save",
    });
    await userEvent.click(submitButton);
  };

  test("Editing an existing report", async () => {
    await act(async () => {
      await render(modalComponentWithSelectedSAR);
    });
    await fillForm("Yes");
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal accessibility", () => {
  it("New WP modal should not have basic accessibility issues", async () => {
    const { container } = render(modalComponentNewWP);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it("Copy WP modal should not have basic accessibility issues", async () => {
    await act(async () => {
      const { container } = await render(modalComponentWithPreviousWP);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  it("Edit SAR modal should not have basic accessibility issues", async () => {
    const { container } = render(modalComponentWithSelectedSAR);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
