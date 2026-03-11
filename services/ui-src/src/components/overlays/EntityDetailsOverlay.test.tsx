import {
  RenderResult,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
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
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseEntityStore);

const mockCloseEntityDetailsOverlay = jest.fn();

let component: RenderResult;

//bypass autosave call when simulating type inputs
jest.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: jest.fn().mockImplementation(() => {
    return [
      {
        id: "mockId",
        name: "Mock name",
      },
    ];
  }),
  autosaveFieldData: jest.fn().mockImplementation(() => Promise.resolve("")),
}));

//mock closeout status to enable closeout button
jest.mock("components/tables/getEntityStatus", () => ({
  getCloseoutStatus: jest.fn().mockImplementation(() => {
    return true;
  }),
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

describe("<EntityDetailsOverlayPage />", () => {
  describe("Renders", () => {
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
        screen.getByText(
          mockEntityDetailsOverlayJson.form.fields[0].props.label
        )
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
      //fill out form
      const textbox = component.container.querySelector("#mock-text-field");
      await act(async () => {
        await userEvent.type(textbox!, "mock text");
      });
      expect(textbox).toHaveValue("mock text");

      const dateField = component.container.querySelector(
        '[name="mock-date-field"]'
      );
      await act(async () => {
        await userEvent.type(dateField!, "2/2/2022");
      });
      expect(dateField).toHaveValue("2/2/2022");

      const number = component.container.querySelector("#mock-number-field");
      await act(async () => {
        await userEvent.type(number!, "3");
      });
      expect(number).toHaveValue("3");

      // trigger onSubmit
      const saveButton = screen.getByText("Save & return");
      await act(async () => {
        await userEvent.click(saveButton);
      });
      expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
    });

    test("Test Closeout Modal", async () => {
      const closeoutBtn = screen.getByText(
        closeOutModal.closeOutModalButtonText
      );
      await act(async () => {
        await userEvent.click(closeoutBtn);
      });

      const modal = screen.getByText("This is a modal");
      await waitFor(() => {
        expect(modal).toBeVisible();
      });

      const modalCloseBtn = screen.getByText("Cancel");
      await act(async () => {
        await userEvent.click(modalCloseBtn);
      });
    });
  });

  testA11yAct(entityDetailsOverlayComponent);
});
