import { act } from "react-dom/test-utils";
import {
  EntityShape,
  MfpReportState,
  MfpUserState,
  entityTypes,
} from "../../types";
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockEntityStore,
  mockModalDrawerReportPageVerbiage,
  mockModalForm,
  mockOverlayModalPageVerbiage,
  mockReportKeys,
  mockStateUserStore,
  mockWPFullReport,
  mockWpReportContext,
} from "../../utils/testing/setupJest";
import { ReportContext } from "components";
import { AddEditOverlayEntityModal } from "./AddEditOverlayEntityModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockEntityName = "mock-name";
const entityType = mockEntityStore.selectedEntity!.type;
const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();

jest.mock("react-uuid", () => jest.fn(() => "mock-eval-id-2"));

const mockOverlayEntity = {
  id: "mock-eval-id",
  "mock-modal-text-field": "mock input 1",
};

const mockInitiative = {
  id: "mock-id-1",
  type: entityTypes[0],
  initiative_name: "mock name 1",
  evaluationPlan: [mockOverlayEntity],
};

const report = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [mockInitiative],
  },
};

const entityIdLookup = { [entityType]: report.fieldData.initiative[0].id };

const selectedStepEntity: EntityShape = {
  type: entityTypes[0],
  id: mockOverlayEntity.id,
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

const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: report,
};

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditOverlayEntityModal
        entityType={[entityTypes[0], "evaluationPlan"]}
        entityName={mockEntityName}
        entityIdLookup={entityIdLookup}
        form={mockModalForm}
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
      <AddEditOverlayEntityModal
        entityType={[entityTypes[0], "evaluationPlan"]}
        entityName={mockEntityName}
        selectedEntity={selectedStepEntity}
        entityIdLookup={entityIdLookup}
        form={mockModalForm}
        verbiage={mockModalDrawerReportPageVerbiage}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test AddEditOverlayEntityModal", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    await act(async () => {
      render(modalComponent);
    });
  });

  afterEach(() => {
    report.fieldData.initiative = [mockInitiative];
    jest.clearAllMocks();
  });

  test("AddEditOverlayEntityModal shows the contents", () => {
    expect(
      screen.getByText(
        mockOverlayModalPageVerbiage.addEditModalAddTitle + mockEntityName
      )
    ).toBeTruthy();
  });

  test("AddEditOverlayEntityModal cancel button closes the modal", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditOverlayEntityModal close button closes the modal", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditOverlayEntityModal functionality", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });

  afterEach(() => {
    report.fieldData.initiative[0].evaluationPlan = [mockOverlayEntity];
    jest.clearAllMocks();
  });

  const fillAndSubmitForm = async (form: any) => {
    const textField = form.querySelector("[name='mock-modal-text-field']")!;
    await userEvent.clear(textField);
    await userEvent.type(textField, "mock input 2");
    const submitButton = screen.getByRole("button", { name: "Save & close" });
    await userEvent.click(submitButton);
  };

  test("Successfully adds new entity, even with existing entities", async () => {
    const result = render(modalComponent);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);

    const expectedUpdateCallPayload = {
      fieldData: mockedReportContext.report.fieldData,
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    expectedUpdateCallPayload.fieldData.initiative[0].evaluationPlan.push({
      id: "mock-eval-id-2",
      "mock-modal-text-field": "mock input 2",
    });

    expect(mockUpdateReport).toHaveBeenCalledTimes(1);

    expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      expectedUpdateCallPayload
    );

    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Successfuly edits an existing entity", async () => {
    const result = render(modalComponentWithSelectedEntity);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);

    const expectedEvaluationPlanEntity = {
      id: mockOverlayEntity.id,
      "mock-modal-text-field": "mock input 2",
      type: entityTypes[0],
    };

    const expectedUpdateCallPayload = {
      fieldData: mockedReportContext.report.fieldData,
      metadata: {
        lastAlteredBy: "Thelonious States",
        status: "In progress",
      },
    };

    expectedUpdateCallPayload.fieldData.initiative = [
      {
        id: "mock-id-1",
        type: entityTypes[0],
        initiative_name: "mock name 1",
        evaluationPlan: [expectedEvaluationPlanEntity],
      },
    ];

    expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      expectedUpdateCallPayload
    );

    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditOverlayEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
