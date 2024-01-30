import {
  RenderResult,
  render,
  screen,
} from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { EntityDetailsOverlay, ReportContext } from "components";
// utils
import {
  mockEntityDetailsOverlayJson,
  RouterWrappedComponent,
  mockUseEntityStore,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseEntityStore);

const mockCloseEntityDetailsOverlay = jest.fn();

//bypass autosave call when simulating type inputs
jest.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: jest.fn().mockImplementation(() => {
    return {};
  }),
  autosaveFieldData: jest.fn().mockImplementation(() => Promise.resolve("")),
}));

const { closeOutWarning, closeOutModal } =
  mockEntityDetailsOverlayJson.verbiage;

const entityDetailsOverlayComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <RouterWrappedComponent>
      <EntityDetailsOverlay
        route={mockEntityDetailsOverlayJson}
        closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      />
    </RouterWrappedComponent>
  </ReportContext.Provider>
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

  test("Test onSubmit Function", async () => {
    let component = render(entityDetailsOverlayComponent);
    //fill out form
    const textbox = component.container.querySelector("#mock-text-field");
    await userEvent.type(textbox!, "test");
    const dateField = component.container.querySelector('[name="mock-date-field"]')
    await userEvent.type(dateField!, "2/2/2022");
    const number = component.container.querySelector("#mock-number-field");
    await userEvent.type(number!, "3");

    //trigger onSubmit
    const saveButton = screen.getByText("Save & return");
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
