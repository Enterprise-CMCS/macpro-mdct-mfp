import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ModalOverlayReportPageV2 } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalOverlayReportPageJson,
  mockReportStore,
  mockUseEntityStore,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { ReportType } from "types";

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
    <ModalOverlayReportPageV2
      route={route}
      setSidebarHidden={mockSetSidebarHidden}
    />
  </RouterWrappedComponent>
);

describe("<ModalOverlayReportPageV2 />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders desktop table", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: false });
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
    expect(screen.getByRole("heading", { name: dashboardTitle, level: 3 }));
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
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: addEditModalAddTitle, level: 1 })
    );

    const input = screen.getByRole("textbox", { name: "mock text field" });
    await act(async () => {
      await userEvent.type(input, "123");
    });

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: addEditModalEditTitle, level: 1 })
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("opens and closes delete modal", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent());

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("heading", { name: deleteModalTitle, level: 1 }));

    const deleteConfirmButton = screen.getByRole("button", {
      name: deleteModalConfirmButtonText,
    });
    expect(deleteConfirmButton).toBeVisible();

    const closeButton = screen.getByRole("button", { name: "Close" });
    await act(async () => {
      await userEvent.click(closeButton);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
      name: "Return to all initiatives",
    });
    await act(async () => {
      await userEvent.click(backButton);
    });
    expect(backButton).not.toBeInTheDocument();
  });

  testA11yAct(modalOverlayReportPageComponent(), () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
