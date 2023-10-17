import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { EntityDetailsOverlay } from "components";
// utils
import {
  mockEntityDetailsOverlayJson,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const { closeOutWarning, closeOutModal } =
  mockEntityDetailsOverlayJson.verbiage;

const mockEntity = {
  id: "mock-id",
  initiative_name: "mock-initiative-name",
};

const entityDetailsOverlayComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      selectedEntity={mockEntity}
      route={mockEntityDetailsOverlayJson}
    />
  </RouterWrappedComponent>
);

describe("Test EntityDetailsOverlayPage", () => {
  test("EntityDetailsOverlayPage view renders", () => {
    render(entityDetailsOverlayComponent);
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
});

describe("Test EntityDetailsOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDetailsOverlayComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
