import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { DeleteEntityModal, ReportContext } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalDrawerReportPageVerbiage,
  mockReportKeys,
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

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockEntity = {
  id: "mock-id-1",
  type: entityTypes[0],
  "mock-modal-text-field": "mock input 1",
};

const report = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [mockEntity],
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
  autosaveState: false,
  editable: false,
  setReport: () => {},
  setReportsByState: () => {},
  clearReportsByState: () => {},
  setSubmittedReportsByState: () => {},
  setLastSavedTime: () => {},
  setWorkPlanToCopyFrom: () => {},
  setAutosaveState: () => {},
  setEditable: () => {},
  // We need to add the user store, as that is where the "lastAlteredBy" field is fetched from
  ...mockStateUserStore,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <DeleteEntityModal
        entityType="entityType"
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
        entityType={entityTypes[0]}
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

/**
 * Nested entity objects
 */

const mockEntityWithinEntity = {
  id: "mock-entity-id-1",
  "mock-name": "mock name",
};

const mockNestedEntity = {
  id: "mock-id'2",
  type: entityTypes[0],
  "mock-modal-text-field": "mock input 2",
  evaluationPlan: [mockEntityWithinEntity],
};

const reportNestedEntity = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [mockNestedEntity],
  },
};

const mockReportContextNestedEntity = {
  ...mockWpReportContext,
  report: reportNestedEntity,
};

const modalComponentWithNestedEntity = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNestedEntity}>
      <DeleteEntityModal
        entityType={entityTypes[0]}
        selectedEntity={mockNestedEntity}
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

    const expectedUpdateCallPayload = {
      fieldData: {
        initiative: [],
      },
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      expectedUpdateCallPayload
    );

    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Successfully handles a delete call with an empty field data", async () => {
    render(modalComponent);
    await deleteEntity();

    const expectedUpdateCallPayload = {
      fieldData: {
        initiative: [],
      },
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      expectedUpdateCallPayload
    );
  });

  test("Successfully deletes a nested existing entity", async () => {
    render(modalComponentWithNestedEntity);
    await deleteEntity();

    const expectedUpdateCallPayload = {
      fieldData: {
        initiative: [],
      },
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      expectedUpdateCallPayload
    );
  });
});

describe("Test DeleteEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
