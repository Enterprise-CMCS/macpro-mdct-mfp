import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { DeleteEntityModal, ReportContext } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalDrawerReportPageVerbiage,
  mockStateUserStore,
  mockWPFullReport,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { MfpReportState, MfpUserState, entityTypes } from "types";
import { useStore } from "../../utils";
import userEvent from "@testing-library/user-event";

const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();

jest.mock("utils/state/useStore");

// const mockEntityName = "mock-name";
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockEntity = {
  id: "mock-id-1",
  type: entityTypes[0],
  "mock-modal-text-field": "mock input 1",
};

const report = {
  ...mockWPFullReport,
  updateReport: mockUpdateReport,
  fieldData: {
    initiatives: [mockEntity],
  },
};

const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: report,
};

const mockUseStore: MfpReportState & MfpUserState = {
  report: report,
  reportsByState: [mockWPFullReport],
  submittedReportsByState: [mockWPFullReport],
  lastSavedTime: "12:30 PM",
  workPlanToCopyFrom: undefined,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  // We need to add the user store, as that is where the "lastAlteredBy" field is fetched from
  ...mockStateUserStore,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <DeleteEntityModal
        entityType="entityType"
        selectedEntity={{ id: "123", type: entityTypes[0] }}
        verbiage={mockModalDrawerReportPageVerbiage}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentWithSelectedEntity = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <DeleteEntityModal
        entityType="entityType"
        selectedEntity={mockEntity}
        verbiage={mockModalDrawerReportPageVerbiage}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const { deleteModalTitle, deleteModalConfirmButtonText } =
  mockModalDrawerReportPageVerbiage;

describe("Test DeleteEntityModal", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(modalComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteEntityModal shows the contents", () => {
    expect(screen.getByText(deleteModalTitle)).toBeTruthy();
    expect(screen.getByText(deleteModalConfirmButtonText)).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("DeleteEntityModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteEntityModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test DeleteEntityModal functionality", () => {
  const deleteEntity = async () => {
    const confirmButton = screen.getByRole("button", {
      name: deleteModalConfirmButtonText,
    });
    await userEvent.click(confirmButton);
  };

  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });

  test("Successfully deletes an existing entity", async () => {
    render(modalComponentWithSelectedEntity);
    await deleteEntity();
    expect(mockUpdateReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test DeleteEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
