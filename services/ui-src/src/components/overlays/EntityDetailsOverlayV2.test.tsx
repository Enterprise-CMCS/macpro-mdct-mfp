import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlayV2 } from "./EntityDetailsOverlayV2";
// utils
import {
  mockEntityStore,
  mockModalOverlayForm,
  mockModalOverlayReportPageJson,
  mockModalOverlayReportPageVerbiage,
  mockStateUserStore,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { useStore } from "utils";
import { ReportContext } from "components";
import { EntityShape, ReportType } from "types";

const mockCloseEntityDetailsOverlay = vi.fn();
const mockOnSubmit = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
  setAutosaveState: vi.fn(),
});

vi.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: vi.fn().mockImplementation(() => {
    return [
      {
        name: "mockId",
        value: "123",
      },
    ];
  }),
  autosaveFieldData: vi.fn().mockImplementation(() => Promise.resolve("")),
  enqueueWrite: vi.fn().mockImplementation((work) => work()),
}));

const entityDetailsOverlayComponent = (
  editable: boolean = true,
  selectedEntity: EntityShape = mockEntityStore.selectedEntity as EntityShape
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <EntityDetailsOverlayV2
        backButtonText="Mock back button text"
        closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
        disabled={false}
        editable={editable}
        errorMessage={mockModalOverlayReportPageVerbiage.errorMessage}
        form={mockModalOverlayForm}
        onSubmit={mockOnSubmit}
        route={mockModalOverlayReportPageJson}
        selectedEntity={selectedEntity}
        submitting={false}
        setEntering={vi.fn()}
        validateOnRender={false}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayV2 />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockEntityStore,
    });
  });

  test("renders form", () => {
    render(entityDetailsOverlayComponent());
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "mock-route-2c",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "mock-initiative-name",
      })
    ).toBeVisible();

    expect(
      screen.getByRole("textbox", {
        name: "mock text field",
      })
    ).toBeVisible();

    expect(
      screen.getByRole("textbox", {
        name: "mock number field",
      })
    ).toBeVisible();

    expect(
      screen.getByRole("textbox", {
        name: "mock optional field(optional)",
      })
    ).toBeVisible();
  });

  test("updates initiative endDates", async () => {
    const copiedEntity = {
      ...mockEntityStore.selectedEntity,
      isCopied: true,
    } as EntityShape;
    render(entityDetailsOverlayComponent(true, copiedEntity));

    const endDate = screen.getByRole("textbox", {
      name: "mock end date field",
    });
    expect(endDate).toHaveValue("");

    await act(async () => {
      await userEvent.type(endDate, "01/01/2026");
      await userEvent.tab();
    });

    // the projected end date lives in the close-out modal
    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Update close-out status" })
      );
    });

    const projectEndDate = screen.getByRole("textbox", {
      name: "mock projected end date field",
    });
    expect(projectEndDate).toHaveValue("01/01/2026");
  });

  test("does not show alert for open initiative", async () => {
    render(entityDetailsOverlayComponent());

    expect(
      screen.queryByRole("alert", { name: "Warning: Mock error title" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Mock error description")
    ).not.toBeInTheDocument();
  });

  test("shows alert for initiative close-out", async () => {
    const closedOutEntity = {
      ...mockEntityStore.selectedEntity,
      isCopied: true,
    } as EntityShape;

    await act(async () => {
      await render(entityDetailsOverlayComponent(true, closedOutEntity));
    });

    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Update close-out status" })
      );
    });

    expect(
      screen.getByRole("alert", { name: "Warning: Mock error title" })
    ).toBeVisible();
    expect(screen.getByText("Mock error description")).toBeVisible();
  });

  test("calls onSubmit function when clicking Save & return button", async () => {
    render(entityDetailsOverlayComponent());
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

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("shows Return button for non-editable form", async () => {
    render(entityDetailsOverlayComponent(false));
    const button = screen.getByRole("button", {
      name: "Return",
    });
    expect(button).toBeVisible();
  });

  test("keeps a closed initiative editable in the SAR", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockEntityStore,
      report: { reportType: ReportType.SAR } as any,
    });
    const closedEntity = {
      ...mockEntityStore.selectedEntity,
      isCopied: true,
      isInitiativeClosed: true,
    } as EntityShape;

    await act(async () => {
      await render(entityDetailsOverlayComponent(true, closedEntity));
    });

    expect(screen.getByRole("button", { name: "Save & return" })).toBeVisible();
  });

  test("locks a closed initiative in the Work Plan", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockEntityStore,
      report: { reportType: ReportType.WP } as any,
    });
    const closedEntity = {
      ...mockEntityStore.selectedEntity,
      isCopied: true,
      isInitiativeClosed: true,
    } as EntityShape;

    await act(async () => {
      await render(entityDetailsOverlayComponent(true, closedEntity));
    });

    expect(screen.getByRole("button", { name: "Return" })).toBeVisible();
  });

  test("calls close overlay function when clicking back button", async () => {
    render(entityDetailsOverlayComponent());
    const button = screen.getByRole("button", {
      name: "Mock back button text",
    });
    await act(async () => {
      await userEvent.click(button);
    });
    expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
  });

  test("calls close overlay function when clicking previous button", async () => {
    render(entityDetailsOverlayComponent());
    const button = screen.getByRole("button", {
      name: "Previous",
    });
    await act(async () => {
      await userEvent.click(button);
    });
    expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
  });
});
