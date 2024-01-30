import { RenderResult, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { EntityDetailsOverlay } from "components";
// utils
import {
  mockEntityDetailsOverlayJson,
  RouterWrappedComponent,
  mockUseEntityStore,
} from "utils/testing/setupJest";
import { autosaveFieldData, useStore } from "utils";
import userEvent from "@testing-library/user-event";
import { UseFormReturn, FieldValues } from "react-hook-form";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseEntityStore);

const mockCloseEntityDetailsOverlay = jest.fn();
const mockAutoSave = jest.fn();

const { closeOutWarning, closeOutModal } =
  mockEntityDetailsOverlayJson.verbiage;

const entityDetailsOverlayComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      route={mockEntityDetailsOverlayJson}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
    />
  </RouterWrappedComponent>
);

let component: RenderResult;
describe("Test EntityDetailsOverlayPage", () => {
  beforeEach(() => {
    component = render(entityDetailsOverlayComponent);
  });
  test("EntityDetailsOverlayPage view renders", () => {
    // Check that the header rendered
    expect(
      screen.getByText(mockEntityDetailsOverlayJson.verbiage.intro.section)
    ).toBeVisible();

    // Check that the form rendered
    expect(
      screen.getByText(mockEntityDetailsOverlayJson.form.fields[0].props.label)
    ).toBeVisible();

    // Check that the footer rendered
    expect(
      screen.getByRole("button", {
        name: /Save & return/,
      })
    ).toBeVisible();

    // Check that the warning alert rendered
    expect(screen.getByText(closeOutWarning.description)).toBeVisible();

    // Check that the modal button rendered
    expect(
      screen.getByText(closeOutModal.closeOutModalButtonText)
    ).toBeVisible();
  });
  test("Test onChange Function", async () => {
    const textbox = component.container.querySelector("#mock-text-field");
    await userEvent.type(textbox!, "test");
  });
  test("Test onSubmit Function", async () => {
    const saveButton = screen.getByText(
      "Return to dashboard for this initiative"
    );
    await userEvent.click(saveButton);
  });
});

describe("Test EntityDetailsOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDetailsOverlayComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
