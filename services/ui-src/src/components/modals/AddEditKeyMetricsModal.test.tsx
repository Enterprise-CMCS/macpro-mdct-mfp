import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AddEditKeyMetricsModal } from "./AddEditKeyMetricsModal";
// utils
import {
  mockDynamicFieldId,
  mockDynamicRowsTemplateForKeyMetricsTableWithModalForm,
  mockDynamicTemplateId,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { ReportContext } from "components/reports/ReportProvider";
import { EntityType, ReportShape, ReportStatus } from "types";

const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();
const mockCurrentEntityId = "mockCurrentEntityId";

const getReport = (
  submittedReport: boolean = false,
  emptyFieldData: boolean = false
) => ({
  ...mockWPFullReport,
  status: submittedReport ? ReportStatus.SUBMITTED : ReportStatus.IN_PROGRESS,
  fieldData: emptyFieldData
    ? undefined
    : {
        [EntityType.INITIATIVE]: [
          {
            id: mockDynamicFieldId,
            [mockDynamicTemplateId]: [
              {
                id: mockCurrentEntityId,
                name: "Mock name",
                baselineStartDate: "01/01/2026",
              },
            ],
          },
        ],
      },
});

const mockedReportContext = (
  submittedReport: boolean = false,
  emptyFieldData: boolean = false
) => ({
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: getReport(submittedReport, emptyFieldData),
});
const modalComponent = (
  userIsAdmin?: boolean,
  currentEntityId?: string,
  submittedReport?: boolean,
  emptyFieldData?: boolean
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={mockedReportContext(submittedReport, emptyFieldData)}
    >
      <AddEditKeyMetricsModal
        currentEntityId={currentEntityId}
        dynamicTemplateId={mockDynamicTemplateId}
        entityType={EntityType.INITIATIVE}
        form={
          mockDynamicRowsTemplateForKeyMetricsTableWithModalForm.props
            .dynamicModalForm
        }
        modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
        parentEntityId={mockDynamicFieldId}
        report={getReport(submittedReport, emptyFieldData) as ReportShape}
        userIsAdmin={userIsAdmin}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("AddEditKeyMetricsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("state user - add", () => {
    test("renders add headings and fields", async () => {
      render(modalComponent());

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Add mock heading" })
        ).toBeVisible();
        expect(screen.getByText("Add mock subheading")).toBeVisible();

        const field1 = screen.getByRole("textbox", {
          name: "Mock modal name",
        });
        expect(field1).toHaveValue("");

        const field2 = screen.getByRole("textbox", {
          name: "Mock modal baseline start date",
        });
        expect(field2).toHaveValue("");
      });
    });

    test("close button closes modal", async () => {
      render(modalComponent());

      const closeButton = screen.getByRole("button", { name: "Close" });
      await act(async () => {
        await userEvent.click(closeButton);
      });
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("submit button triggers form submission and closes modal", async () => {
      render(modalComponent(false, undefined, false, true));

      const submitButton = screen.getByRole("button", { name: "Save" });
      await act(async () => {
        await userEvent.click(submitButton);
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("state user - edit", () => {
    test("renders edit headings and fields with values", async () => {
      await act(async () => {
        render(modalComponent(false, mockCurrentEntityId));
      });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Edit mock heading" })
        ).toBeVisible();
        expect(screen.getByText("Edit mock subheading")).toBeVisible();

        const field1 = screen.getByRole("textbox", {
          name: "Mock modal name",
        });
        expect(field1).toHaveValue("Mock name");

        const field2 = screen.getByRole("textbox", {
          name: "Mock modal baseline start date",
        });
        expect(field2).toHaveValue("01/01/2026");
      });
    });

    test("submit button triggers form submission and closes modal", async () => {
      await act(async () => {
        render(modalComponent(false, mockCurrentEntityId));
      });

      const submitButton = screen.getByRole("button", { name: "Save" });
      await act(async () => {
        await userEvent.click(submitButton);
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    describe("submitted report", () => {
      test("form fields are disabled", async () => {
        await act(async () => {
          render(modalComponent(false, mockCurrentEntityId, true));
        });

        const fieldset = screen.getByRole("group");
        const inputs = within(fieldset).getAllByRole("textbox");

        inputs.forEach((input) => {
          expect(input).toBeDisabled();
        });
      });

      test("submit button closes modal", async () => {
        await act(async () => {
          render(modalComponent(false, mockCurrentEntityId, true));
        });

        const submitButton = screen.getByRole("button", { name: "Return" });
        await act(async () => {
          await userEvent.click(submitButton);
        });

        expect(mockCloseHandler).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("admin user", () => {
    test("form fields are disabled", () => {
      render(modalComponent(true));

      const fieldset = screen.getByRole("group");
      const inputs = within(fieldset).getAllByRole("textbox");

      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    test("submit button closes modal", async () => {
      render(modalComponent(true));

      const submitButton = screen.getByRole("button", { name: "Return" });
      await act(async () => {
        await userEvent.click(submitButton);
      });

      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });
});
