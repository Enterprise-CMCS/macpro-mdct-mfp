import { act } from "react-dom/test-utils";
import { MfpReportState, MfpUserState, entityTypes } from "../../types";
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockEntityStore,
  mockModalDrawerReportPageVerbiage,
  mockOverlayEntityModalForm,
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
  "mock-radio-field": {
    key: "mock-radio-field",
    value: "option 1",
  },
};

const report = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [
      {
        id: "mock-id-1",
        type: "initiative",
        initiative_name: "mock name 1",
        evaluationPlan: [mockOverlayEntity],
      },
    ],
  },
};

const entityIdLookup = { [entityType]: report.fieldData.initiative[0].id };

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
        form={mockOverlayEntityModalForm}
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
    // TODO: Reset back to mockOverlayEntity here
  });

  const fillAndSubmitForm = async (form: any) => {
    const textField = form.querySelector("[name='mock-modal-text-field']")!;
    await userEvent.clear(textField);
    await userEvent.type(textField, "mock input 2");
    const choice = screen.getByLabelText("option 1") as HTMLInputElement;
    await userEvent.click(choice);
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
      "mock-radio-field": [
        {
          key: "mock-radio-field-option1uuid",
          value: "option 1",
        },
      ],
    });

    expect(mockUpdateReport).toHaveBeenCalledTimes(1);

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
