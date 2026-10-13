import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { CloseOutModal, ReportContext } from "components";
// utils
import {
  mockReportMethods,
  mockStateUserStore,
  mockWPFullReport,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import {
  EntityType,
  FormJson,
  ReportFormFieldType,
  ValidationType,
} from "types";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
const mockSetSelectedEntity = vi.fn();

mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  report: {
    ...mockWPFullReport,
    fieldData: {
      ...mockWPFullReport.fieldData,
      initiative: [{ id: "mockEntityId", type: "initiative" }],
    },
  },
  setSelectedEntity: mockSetSelectedEntity,
});

const mockCloseHandler = vi.fn();

const closeOutForm = {
  id: "close-out-form",
  fields: [
    {
      id: "closeOutInformation_actualEndDate",
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT_OPTIONAL,
      props: { label: "Actual end date" },
    },
  ],
} as FormJson;

const errorMessage = {
  title: "Warning",
  description: "This action cannot be undone.",
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <CloseOutModal
        disabled={false}
        entityType="initiative"
        errorMessage={errorMessage}
        form={closeOutForm}
        heading="Close-out Test Initiative"
        modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
        selectedEntity={{ id: "mockEntityId", type: EntityType.INITIATIVE }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<CloseOutModal />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("shows the heading, field, and warning", async () => {
    await act(async () => {
      await render(modalComponent);
    });
    expect(screen.getByText("Close-out Test Initiative")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Actual end date" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("cancel button closes the modal", async () => {
    await act(async () => {
      await render(modalComponent);
    });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("saving updates the report and closes the modal", async () => {
    await act(async () => {
      await render(modalComponent);
    });
    await act(async () => {
      await userEvent.type(
        screen.getByRole("textbox", { name: "Actual end date" }),
        "01/01/2026"
      );
    });
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Save" }));
    });
    expect(mockReportMethods.updateReport).toHaveBeenCalled();
    expect(mockSetSelectedEntity).toHaveBeenCalled();
    expect(mockCloseHandler).toHaveBeenCalled();
  });

  test("does not save when disabled, just closes", async () => {
    await act(async () => {
      await render(
        <RouterWrappedComponent>
          <ReportContext.Provider value={mockReportMethods}>
            <CloseOutModal
              disabled={true}
              entityType="initiative"
              errorMessage={errorMessage}
              form={closeOutForm}
              heading="Close-out Test Initiative"
              modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
              selectedEntity={{
                id: "mockEntityId",
                type: EntityType.INITIATIVE,
              }}
            />
          </ReportContext.Provider>
        </RouterWrappedComponent>
      );
    });
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Return" }));
    });
    expect(mockReportMethods.updateReport).not.toHaveBeenCalled();
    expect(mockCloseHandler).toHaveBeenCalled();
  });

  testA11yAct(modalComponent);
});
