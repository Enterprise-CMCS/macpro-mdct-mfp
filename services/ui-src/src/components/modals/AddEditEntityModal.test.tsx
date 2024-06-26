import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
//components
import { AddEditEntityModal, ReportContext } from "components";
import {
  mockModalDrawerReportPageVerbiage,
  mockModalForm,
  mockReportKeys,
  mockStateUserStore,
  mockTransitionBenchmarkModalForm,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";
import { MfpReportState, MfpUserState, entityTypes } from "../../types";
import { alertVerbiage } from "./AddEditEntityModal";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();
const mockSetError = jest.fn();

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));
jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
jest.mock("utils/auth/useUser");

const mockEntityName = "mock-name";

const mockEntity = {
  id: "mock-id-1",
  type: entityTypes[1],
  "mock-modal-text-field": "mock input 1",
};

const mockTransitionBenchmarkEntity = {
  id: "mock-id-1",
  type: entityTypes[1],
  transitionBenchmarks_targetPopulationName: "mock input 1",
};

const report = {
  ...mockWPFullReport,
  fieldData: {
    targetPopulations: [mockEntity],
  },
};

const transitionBenchmarkFilledReport = {
  ...mockWPFullReport,
  fieldData: {
    targetPopulations: [mockTransitionBenchmarkEntity],
  },
};

const mockUseStore: MfpReportState & MfpUserState = {
  report: report,
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

const mockedReportContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: report,
};

const mockTransitionBenchmarkContext = {
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: transitionBenchmarkFilledReport,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditEntityModal
        entityType={entityTypes[1]}
        verbiage={mockModalDrawerReportPageVerbiage}
        entityName={mockEntityName}
        form={mockModalForm}
        setError={mockSetError}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const transitionBenchmarkModalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditEntityModal
        entityType={entityTypes[1]}
        verbiage={mockModalDrawerReportPageVerbiage}
        entityName={mockEntityName}
        form={mockTransitionBenchmarkModalForm}
        setError={mockSetError}
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
      <AddEditEntityModal
        entityType={entityTypes[1]}
        selectedEntity={mockEntity}
        verbiage={mockModalDrawerReportPageVerbiage}
        form={mockModalForm}
        setError={mockSetError}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<AddEditEntityModal />", () => {
  describe("Test AddEditEntityModal", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      await act(async () => {
        render(modalComponent);
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("AddEditEntityModal shows the contents", () => {
      expect(
        screen.getByText(
          mockModalDrawerReportPageVerbiage.addEditModalAddTitle +
            mockEntityName
        )
      ).toBeTruthy();
      expect(screen.getByText("mock modal text field")).toBeTruthy();
    });

    test("AddEditEntityModal cancel button closes modal", () => {
      fireEvent.click(screen.getByText("Cancel"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("AddEditEntityModal close button closes modal", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("User cannot add duplicate 'Other' target populations", async () => {
      const form = screen.queryByTestId("add-edit-entity-form");
      const textField = form!.querySelector("input")!;
      await userEvent.clear(textField);
      await userEvent.type(textField, "mock input 1");
      const submitButton = screen.getByRole("button", { name: "Save" });
      expect(submitButton).toBeDisabled;
    });
  });

  describe("Test AddEditEntityModal functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
    });

    afterEach(() => {
      // reset report back to baseline with only the mockEntity
      report.fieldData.targetPopulations = [mockEntity];
      jest.clearAllMocks();
    });

    const fillAndSubmitForm = async (form: any) => {
      // fill and submit form
      const textField = form.querySelector("[name='mock-modal-text-field']")!;
      await userEvent.clear(textField);
      await userEvent.type(textField, "mock input 2");
      const submitButton = screen.getByRole("button", { name: "Save" });
      await userEvent.click(submitButton);
    };

    test("Successfully adds new entity, even with existing entities", async () => {
      const result = await render(modalComponent);
      const form = result.getByTestId("add-edit-entity-form");
      await fillAndSubmitForm(form);

      const expectedUpdateCallPayload = {
        fieldData: mockedReportContext.report.fieldData,
        metadata: {
          lastAlteredBy: "Thelonious States",
          status: "In progress",
        },
      };

      expectedUpdateCallPayload.fieldData.targetPopulations.push({
        id: "mock-id-2",
        "mock-modal-text-field": "mock input 2",
        type: entityTypes[1],
      });

      expect(mockUpdateReport).toHaveBeenCalledWith(
        { ...mockReportKeys, id: "mock-wp-full-report-id" },
        expectedUpdateCallPayload
      );
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("Successfully edits an existing entity", async () => {
      const result = render(modalComponentWithSelectedEntity);
      const form = result.getByTestId("add-edit-entity-form");
      await fillAndSubmitForm(form);

      const expectedUpdateCallPayload = {
        fieldData: mockedReportContext.report.fieldData,
        metadata: {
          lastAlteredBy: "Thelonious States",
          status: "In progress",
        },
      };

      expectedUpdateCallPayload.fieldData.targetPopulations = [
        {
          id: mockEntity.id,
          "mock-modal-text-field": "mock input 2",
          type: entityTypes[1],
        },
      ];

      expect(mockUpdateReport).toHaveBeenCalledWith(
        { ...mockReportKeys, id: "mock-wp-full-report-id" },
        expectedUpdateCallPayload
      );

      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("Doesn't edit an existing entity if no update was made", async () => {
      render(modalComponentWithSelectedEntity);
      const submitButton = screen.getByRole("button", { name: "Save" });
      await userEvent.click(submitButton);
      expect(mockUpdateReport).toHaveBeenCalledTimes(0);
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test TransitionBenchmarks Entity Error Throwing", () => {
    test("Throws error when attempting to add a duplicate entity for Transition Benchmarks", async () => {
      const transitionBenchmarkStore = {
        ...mockUseStore,
        report: transitionBenchmarkFilledReport,
      };
      mockedUseStore.mockReturnValue(transitionBenchmarkStore);
      const result = await render(transitionBenchmarkModalComponent);
      const form = result.getByTestId("add-edit-entity-form");

      const textField = form.querySelector(
        "[name='transitionBenchmarks_targetPopulationName']"
      )!;
      await userEvent.clear(textField);
      await userEvent.type(textField, "mock input 2");
      const submitButton = screen.getByRole("button", { name: "Save" });
      await userEvent.click(submitButton);

      const expectedUpdateCallPayload = {
        fieldData: mockTransitionBenchmarkContext.report.fieldData,
        metadata: {
          lastAlteredBy: "Thelonious States",
          status: "In progress",
        },
      };

      expectedUpdateCallPayload.fieldData.targetPopulations.push({
        id: "mock-id-2",
        type: entityTypes[1],
        transitionBenchmarks_targetPopulationName: "mock input 2",
      });

      expect(mockUpdateReport).toHaveBeenCalledWith(
        { ...mockReportKeys, id: "mock-wp-full-report-id" },
        expectedUpdateCallPayload
      );
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);

      await userEvent.clear(textField);
      await userEvent.type(textField, "mock input 2");

      expect(mockSetError).toHaveBeenCalledWith(alertVerbiage);
    });
  });

  testA11y(modalComponent);
});
