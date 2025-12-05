import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext } from "components";
import { AddEditOverlayEntityModal } from "./AddEditOverlayEntityModal";
// types
import {
  EntityShape,
  MfpReportState,
  MfpUserState,
  entityTypes,
} from "../../types";
// utils
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockEntityStore,
  mockModalDrawerReportPageVerbiage,
  mockModalForm,
  mockOverlayModalPageVerbiage,
  mockReportKeys,
  mockSARFullReport,
  mockSARReportContext,
  mockStateUserStore,
  mockWPFullReport,
  mockWpReportContext,
} from "../../utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

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

const wpReport = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [mockInitiative],
  },
};

const sarReport = {
  ...mockSARFullReport,
  fieldData: {
    initiative: [mockInitiative],
  },
};

const entityIdLookup = { [entityType]: wpReport.fieldData.initiative[0].id };

const selectedStepEntity: EntityShape = {
  type: entityTypes[0],
  id: mockOverlayEntity.id,
  objectiveProgress_objectiveName: "mock-title",
};

// mock store for WP
const mockUseStore: MfpReportState & MfpUserState = {
  report: wpReport,
  reportsByState: [mockWPFullReport],
  submittedReportsByState: [mockWPFullReport],
  lastSavedTime: "12:30 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
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

// mock report context for WP
const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: wpReport,
};

// mock store for SAR
const mockSarUseStore: MfpReportState & MfpUserState = {
  report: sarReport,
  reportsByState: [mockSARFullReport],
  submittedReportsByState: [mockWPFullReport],
  lastSavedTime: "12:30 PM",
  workPlanToCopyFrom: undefined,
  autosaveState: false,
  editable: true,
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

// mock report context for SAR
const mockedSarReportContext = {
  ...mockSARReportContext,
  updateReport: mockUpdateReport,
  report: sarReport,
};

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

const sarModalComponentWithSelectedEntity = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedSarReportContext}>
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

describe("<AddEditOverlayEntityModal />", () => {
  describe("Test AddEditOverlayEntityModal for WP", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      await act(async () => {
        render(modalComponent);
      });
    });

    afterEach(() => {
      wpReport.fieldData.initiative = [mockInitiative];
      jest.clearAllMocks();
    });

    test("AddEditOverlayEntityModal shows the correct contents for WP", () => {
      expect(
        screen.getByText(
          `${mockOverlayModalPageVerbiage.addEditModalAddTitle} ${mockEntityName}`
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

  describe("Test AddEditOverlayEntityModal for SAR", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockSarUseStore);
      await act(async () => {
        render(sarModalComponentWithSelectedEntity);
      });
    });

    afterEach(() => {
      sarReport.fieldData.initiative = [mockInitiative];
      jest.clearAllMocks();
    });

    test("AddEditOverlayEntityModal shows the correct contents for SAR", () => {
      expect(
        screen.getByText(
          `${mockOverlayModalPageVerbiage.addEditModalEditTitle} ${selectedStepEntity.objectiveProgress_objectiveName}`
        )
      ).toBeTruthy();
    });
  });

  describe("Test AddEditOverlayEntityModal functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
    });

    afterEach(() => {
      wpReport.fieldData.initiative[0].evaluationPlan = [mockOverlayEntity];
      jest.clearAllMocks();
    });

    const fillAndSubmitForm = async (form: any) => {
      const textField = form.querySelector("[name='mock-modal-text-field']")!;
      await act(async () => {
        await userEvent.clear(textField);
        await userEvent.type(textField, "mock input 2");
      });
      const submitButton = screen.getByRole("button", { name: "Save" });
      await act(async () => {
        await userEvent.click(submitButton);
      });
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
        { ...mockReportKeys, id: "mock-wp-full-report-id" },
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
        { ...mockReportKeys, id: "mock-wp-full-report-id" },
        expectedUpdateCallPayload
      );

      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  testA11yAct(modalComponent);
});
