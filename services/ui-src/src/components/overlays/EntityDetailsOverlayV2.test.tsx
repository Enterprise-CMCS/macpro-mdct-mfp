import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlayV2 } from "./EntityDetailsOverlayV2";
// utils
import {
  mockEntityStore,
  mockModalOverlayForm,
  mockModalOverlayReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";

const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsOverlayComponent = (editable?: boolean) => (
  <RouterWrappedComponent>
    <EntityDetailsOverlayV2
      backButtonText="Mock back button text"
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={false}
      editable={editable}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      route={mockModalOverlayReportPageJson}
      selectedEntity={mockEntityStore.selectedEntity}
      submitting={false}
      setEntering={jest.fn()}
      validateOnRender={false}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayV2 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        name: "mock optional field (optional)",
      })
    ).toBeVisible();
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
});
