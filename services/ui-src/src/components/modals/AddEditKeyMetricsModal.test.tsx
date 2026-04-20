import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { AddEditKeyMetricsModal, ReportContext } from "components";
import {
  mockDynamicRowsTemplateForKeyMetricsTable,
  mockDynamicTemplateId,
  mockReportKeys,
  mockStateUserStore,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { MfpReportState, MfpUserState } from "../../types";
import { testA11yAct } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));
jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
jest.mock("utils/auth/useUser");

const report = {
  ...mockWPFullReport,
  fieldData: {
    initiative: [
      {
        id: "mock-initiative-id",
        type: "initiative",
        initiative_name: "mock-name",
      },
    ],
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

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditKeyMetricsModal
        currentEntityId={"mock-id"}
        dynamicTemplateId={mockDynamicTemplateId}
        form={mockDynamicRowsTemplateForKeyMetricsTable.props.dynamicModalForm}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<AddEditKeyMetricsModal />", () => {
  describe("Test AddEditKeyMetricsModal", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      await act(async () => {
        render(modalComponent);
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("AddEditKeyMetricsModal shows the contents", () => {
      expect(
        screen.getByText(
          mockDynamicRowsTemplateForKeyMetricsTable.props.dynamicModalForm
            .heading.add
        )
      ).toBeTruthy();
      expect(screen.getByText("Mock modal key metric name")).toBeTruthy();
    });

    test("AddEditKeyMetricsModal cancel button closes modal", () => {
      fireEvent.click(screen.getByText("Cancel"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("AddEditKeyMetricsModal close button closes modal", () => {
      fireEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test AddEditKeyMetricsModal functionality", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
    });

    afterEach(() => {
      // reset report back to baseline with only the mockEntity
      report.fieldData.initiative = [];
      jest.clearAllMocks();
    });

    const fillAndSubmitForm = async (form: any) => {
      // fill and submit form
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
      const result = await render(modalComponent);
      const form = result.getByTestId("add-edit-key-metrics-form");
      await fillAndSubmitForm(form);

      expect(mockUpdateReport).toHaveBeenCalledWith({
        ...mockReportKeys,
        id: "mock-wp-full-report-id",
      });
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("Successfully edits an existing entity", async () => {});

    test("Doesn't edit an existing entity if no update was made", async () => {});
  });

  testA11yAct(modalComponent);
});
