import { act, fireEvent, render, screen } from "@testing-library/react";
import { ReportType } from "../../types";
import {
  RouterWrappedComponent,
  mockWPFullReport,
  mockWpReportContext,
  mockWPApprovedFullReport,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { AddEditReportModal } from "./AddEditReportModal";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockWpReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
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

const modalComponentWithSelectedReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditReportModal
        activeState="CA"
        selectedReport={mockWPFullReport}
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

describe("Test AddEditProgramModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditReportModal shows the contents", () => {
    expect(
      screen.getByRole("button", { name: "Continue from previous period" })
    ).toBeTruthy();
  });

  test("AddEditReportModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal functionality for Work Plan", () => {
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
    await render(modalComponent);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Continue MFP Work Plan");
    await fillForm();
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Editing an existing report", async () => {
    await render(modalComponentWithSelectedReport);
    await fillForm();
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
