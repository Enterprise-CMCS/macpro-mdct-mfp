import { act, fireEvent, render, screen } from "@testing-library/react";
import { ReportType } from "../../types";
import {
  RouterWrappedComponent,
  mockWpReportContext,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { AddNewWorkPlanModal } from "./AddNewWorkPlanModal";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

const mockCreateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockWpReportContext,
  createReport: mockCreateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddNewWorkPlanModal
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

describe("Test AddNewWorkPlan Modal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddNewReportModal shows the content", () => {
    expect(screen.getByText("Start new")).toBeTruthy();
  });

  test("AddNewReportModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddNewReportModal functionality for Work Plan", () => {
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

    await render(modalComponent);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Add new MFP Work Plan");
    expect(screen.getByTestId("add-new-wp-form")).toBeTruthy();
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
});

describe("Test AddNewReportModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
