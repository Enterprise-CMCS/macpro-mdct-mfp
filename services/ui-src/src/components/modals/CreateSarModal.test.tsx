import { render, screen } from "@testing-library/react";
import {
  mockSARReportContext,
  RouterWrappedComponent,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { CreateSarModal } from "./CreateSarModal";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { act } from "react-dom/test-utils";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

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

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedSARReportContext}>
      <CreateSarModal
        activeState="CA"
        selectedReport={{ ...mockSelectedSARReport, id: undefined }}
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
      <CreateSarModal
        activeState="CA"
        selectedReport={mockSelectedSARReport}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const fillForm = async (option: string) => {
  const firstRadio = screen.getByLabelText(option) as HTMLInputElement;
  await userEvent.click(firstRadio);
  const submitButton = screen.getByRole("button", {
    name: "Save",
  });
  await userEvent.click(submitButton);
};

describe("Test CreateSarModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Adding a new report", async () => {
    await act(async () => {
      await render(modalComponent);
    });
    await fillForm("No");
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

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

describe("Test CreateSarModal accessibility", () => {
  it("Should not have basic accessibility issues for new SAR", async () => {
    await act(async () => {
      const { container } = await render(modalComponent);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  it("Should not have basic accessibility issues for existing SAR", async () => {
    await act(async () => {
      const { container } = render(modalComponentWithSelectedSAR);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
