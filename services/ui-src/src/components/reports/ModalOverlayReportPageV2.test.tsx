import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ModalOverlayReportPageV2, ReportContext } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalOverlayReportPageJson,
  mockReportFieldData,
  mockReportStore,
  mockUseEntityStore,
  mockWPFullReport,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import {
  ReportFormFieldType,
  ReportStatus,
  ReportType,
  ValidationType,
} from "types";
import { mockAdminUser, mockStateUser } from "utils/testing/mockUsers";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

const mockSetSidebarHidden = jest.fn();

const {
  addEditModalAddTitle,
  addEditModalEditTitle,
  addEntityButtonText,
  dashboardSubtitle,
  dashboardTitle,
  deleteModalConfirmButtonText,
  deleteModalTitle,
  editEntityButtonText,
  emptyDashboardText,
  enterEntityDetailsButtonText,
} = mockModalOverlayReportPageJson.verbiage;

const cloneEntityStore = structuredClone(mockUseEntityStore);
const emptyStore = {
  ...cloneEntityStore,
  report: {
    ...cloneEntityStore.report,
    fieldData: {},
  },
};

const modalOverlayReportPageComponent = (
  route = mockModalOverlayReportPageJson
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <ModalOverlayReportPageV2
        route={route}
        setSidebarHidden={mockSetSidebarHidden}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ModalOverlayReportPageV2 />", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: false });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders desktop table", () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.getByRole("columnheader", { name: "Mock table header" })
    ).toBeVisible();

    expect(
      screen.getByRole("heading", { name: `${dashboardTitle} 1`, level: 3 })
    );
    expect(screen.getByRole("heading", { name: dashboardSubtitle, level: 2 }));
  });

  test("renders mobile table", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: true, isTablet: true });
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.queryByRole("columnheader", { name: "Mock table header" })
    ).not.toBeInTheDocument();
  });

  test("shows empty table message", async () => {
    mockedUseStore.mockReturnValue(emptyStore);
    render(modalOverlayReportPageComponent());

    expect(screen.getByText(emptyDashboardText)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: `${dashboardTitle} 0`, level: 3 })
    );
  });

  test("shows alert", async () => {
    mockedUseStore.mockReturnValue(emptyStore);
    const route = {
      ...mockModalOverlayReportPageJson,
      entityType: "initiative",
    };
    render(modalOverlayReportPageComponent(route));

    expect(screen.getByText("Alert:")).toBeVisible();
  });

  test("renders SAR table", () => {
    const sarStore = {
      ...cloneEntityStore,
      report: {
        ...cloneEntityStore.report,
        reportType: ReportType.SAR,
      },
    };
    mockedUseStore.mockReturnValue(sarStore);
    render(modalOverlayReportPageComponent());

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    const editButton = screen.queryByRole("button", {
      name: editEntityButtonText,
    });
    expect(editButton).not.toBeInTheDocument();
  });

  test("opens and closes add modal", async () => {
    const addStore = {
      ...mockUseEntityStore,
      selectedEntity: undefined,
    };
    mockedUseStore.mockReturnValue(addStore);
    render(modalOverlayReportPageComponent());

    const addButton = screen.getByRole("button", { name: addEntityButtonText });
    await act(async () => {
      await userEvent.click(addButton);
    });
    const modal = screen.getByRole("dialog", { name: addEditModalAddTitle });
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    const input = screen.getByRole("textbox", { name: "mock text field" });
    await act(async () => {
      await userEvent.type(input, "123");
    });

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    await waitFor(async () => {
      const closedModal = screen.queryByRole("dialog", {
        name: addEditModalAddTitle,
      });
      await act(() => {
        expect(closedModal).not.toBeVisible();
      });
    });
  });

  test("opens and closes edit modal", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());

    const editButton = screen.getByRole("button", {
      name: editEntityButtonText,
    });
    await act(async () => {
      await userEvent.click(editButton);
    });
    const modal = screen.getByRole("dialog", { name: addEditModalEditTitle });
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    await waitFor(async () => {
      const closedModal = screen.queryByRole("dialog", {
        name: addEditModalEditTitle,
      });
      await act(() => {
        expect(closedModal).not.toBeVisible();
      });
    });
  });

  test("opens and closes delete modal", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    const modal = screen.getByRole("dialog", { name: deleteModalTitle });
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    const deleteConfirmButton = screen.getByRole("button", {
      name: deleteModalConfirmButtonText,
    });
    expect(deleteConfirmButton).toBeVisible();

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    await waitFor(async () => {
      const closedModal = screen.queryByRole("dialog", {
        name: deleteModalTitle,
      });
      await act(() => {
        expect(closedModal).not.toBeVisible();
      });
    });
  });

  test("opens and closes overlay", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const backButton = screen.getByRole("button", {
      name: "Mock back button text",
    });
    await act(async () => {
      await userEvent.click(backButton);
    });
    expect(backButton).not.toBeInTheDocument();
  });

  test("submits overlay form for state user", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUser,
      ...mockWpReportContext,
      editable: true,
      setAutosaveState: jest.fn(),
      setSelectedEntity: jest.fn(),
    });
    render(modalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const button = screen.getByRole("button", {
      name: "Save & return",
    });
    const inputs = screen.getAllByRole("textbox");

    for (const input of inputs) {
      await act(async () => {
        await userEvent.type(input, "123");
      });
    }

    await act(async () => {
      await userEvent.click(button);
    });

    expect(mockWpReportContext.updateReport).toHaveBeenCalledWith(
      {
        id: mockWPFullReport.id,
        reportType: mockWPFullReport.reportType,
        state: mockStateUser.user?.state,
      },
      {
        fieldData: {
          entityType: [
            {
              ...mockReportFieldData.entityType[0],
              "mock-number-field": "123",
              "mock-optional-text-field": "123",
              "mock-text-field": "123",
            },
          ],
        },
        metadata: {
          lastAlteredBy: mockStateUser.user?.full_name,
          status: ReportStatus.IN_PROGRESS,
        },
      }
    );
  });

  test("does not submits overlay form for admin user", async () => {
    mockedUseStore.mockReturnValue({
      ...mockAdminUser,
      ...mockWpReportContext,
      editable: true,
      setAutosaveState: jest.fn(),
      setSelectedEntity: jest.fn(),
    });
    render(modalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const button = screen.getByRole("button", {
      name: "Return",
    });
    await act(async () => {
      await userEvent.click(button);
    });

    expect(mockWpReportContext.updateReport).not.toHaveBeenCalled();
  });

  test("shows forCopyoverOnly fields for copied report", async () => {
    const route = {
      ...mockModalOverlayReportPageJson,
      overlayForm: {
        ...mockModalOverlayReportPageJson.overlayForm,
        fields: [
          ...mockModalOverlayReportPageJson.overlayForm.fields,
          {
            forCopyoverOnly: true,
            id: "mock-copyover-field",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
            props: {
              label: "mock copyover field",
            },
          },
        ],
      },
    };
    mockedUseStore.mockReturnValue({
      ...mockUseEntityStore,
      report: {
        ...mockUseEntityStore.report,
        isCopied: true,
      },
    });
    render(modalOverlayReportPageComponent(route));
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const textbox = screen.getByRole("textbox", {
      name: "mock copyover field",
    });
    expect(textbox).toBeVisible();
  });

  test("hides forCopyoverOnly fields for new report", async () => {
    const route = {
      ...mockModalOverlayReportPageJson,
      overlayForm: {
        ...mockModalOverlayReportPageJson.overlayForm,
        fields: [
          ...mockModalOverlayReportPageJson.overlayForm.fields,
          {
            forCopyoverOnly: true,
            id: "mock-copyover-field",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
            props: {
              label: "mock copyover field",
            },
          },
        ],
      },
    };
    mockedUseStore.mockReturnValue({
      ...mockUseEntityStore,
      report: {
        ...mockUseEntityStore.report,
        isCopied: false,
      },
    });
    render(modalOverlayReportPageComponent(route));
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const textbox = screen.queryByRole("textbox", {
      name: "mock copyover field",
    });
    expect(textbox).not.toBeInTheDocument();
  });

  testA11yAct(modalOverlayReportPageComponent(), () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
