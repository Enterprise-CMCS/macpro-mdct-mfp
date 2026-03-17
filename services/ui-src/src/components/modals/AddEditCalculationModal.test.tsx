import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AddEditCalculationModal } from "./AddEditCalculationModal";
// utils
import {
  mockDynamicFieldId,
  mockDynamicRowsTemplateWithModalForm,
  mockDynamicTemplateId,
  mockTableId,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { ReportContext } from "components/reports/ReportProvider";
import { ReportStatus } from "types";

const mockCloseHandler = jest.fn();
const mockUpdateReport = jest.fn();

const getReport = (submitedReport: boolean = false) => ({
  ...mockWPFullReport,
  status: submitedReport ? ReportStatus.SUBMITTED : ReportStatus.IN_PROGRESS,
  fieldData: {
    [mockDynamicTemplateId]: [
      {
        id: mockDynamicFieldId,
        totalComputable: "123.45",
        percentageOverride: "50",
      },
    ],
  },
});

const mockedReportContext = (submitedReport: boolean = false) => ({
  ...mockWpReportContext,
  updateReport: mockUpdateReport,
  report: getReport(submitedReport),
});
const modalComponent = (
  userIsAdmin = false,
  selectedId?: string,
  submittedReport?: boolean
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext(submittedReport)}>
      <AddEditCalculationModal
        dynamicTemplateId={mockDynamicTemplateId}
        form={mockDynamicRowsTemplateWithModalForm.props.dynamicModalForm}
        modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
        report={getReport(submittedReport)}
        userIsAdmin={userIsAdmin}
        selectedId={selectedId}
        tableId={mockTableId}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("AddEditCalculationModal", () => {
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
          name: "Mock modal total computable",
        });
        expect(field1).toHaveValue("");

        const field2 = screen.getByRole("textbox", {
          name: "Mock modal percentage override",
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
      render(modalComponent());

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
        render(modalComponent(false, mockDynamicFieldId));
      });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Edit mock heading" })
        ).toBeVisible();
        expect(screen.getByText("Edit mock subheading")).toBeVisible();

        const field1 = screen.getByRole("textbox", {
          name: "Mock modal total computable",
        });
        expect(field1).toHaveValue("123.45");

        const field2 = screen.getByRole("textbox", {
          name: "Mock modal percentage override",
        });
        expect(field2).toHaveValue("50");
      });
    });

    describe("submitted report", () => {
      test("form fields are disabled", async () => {
        await act(async () => {
          render(modalComponent(false, mockDynamicFieldId, true));
        });

        const fieldset = screen.getByRole("group");
        const inputs = within(fieldset).getAllByRole("textbox");

        inputs.forEach((input) => {
          expect(input).toBeDisabled();
        });
      });

      test("submit button closes modal", async () => {
        await act(async () => {
          render(modalComponent(false, mockDynamicFieldId, true));
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
