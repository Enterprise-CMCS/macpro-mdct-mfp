import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { OverlayModalPage } from "./OverlayModalPage";
import { useStore } from "utils";
// utils
import {
  mockOverlayModalPageJson,
  RouterWrappedComponent,
  mockReportStore,
  mockEntityStore,
  mockEvaluationPlan,
  mockUseEvaluationPlanEntityStore,
  mockUseObjectiveProgressEntityStore,
  mockOverlayModalWithCardsPageJson,
  mockObjectiveProgress,
  mockUseSARStore,
  mockObjectiveProgressEntityStore,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const {
  addEntityButtonText,
  editEntityButtonText,
  addEditModalEditTitle,
  deleteModalTitle,
  reportProgressButtonText,
} = mockOverlayModalPageJson.verbiage;

const overlayModalPageComponentWithEntities = (
  <RouterWrappedComponent>
    <OverlayModalPage route={mockOverlayModalPageJson} />
  </RouterWrappedComponent>
);

const overlayModalPageComponentWithCardsEntities = (
  <RouterWrappedComponent>
    <OverlayModalPage route={mockOverlayModalWithCardsPageJson} />
  </RouterWrappedComponent>
);

describe("<OverlayModalPage />", () => {
  describe("Test overlayModalPage with Work Plans's Evaluation Plan Entity", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseEvaluationPlanEntityStore);
      render(overlayModalPageComponentWithEntities);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("overlayModalPage should render the view", () => {
      expect(
        screen.getByText(mockEvaluationPlan[0].evaluationPlan_objectiveName)
      ).toBeVisible();
      expect(
        screen.getByText(mockEvaluationPlan[1].evaluationPlan_objectiveName)
      ).toBeVisible();
    });

    test("overlayModalPage opens the add edit modal correctly", async () => {
      const addEntityButton = screen.getAllByText(addEntityButtonText);
      await act(async () => {
        await userEvent.click(addEntityButton[0]);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });

      const closeButton = screen.getByText("Close");
      await act(async () => {
        await userEvent.click(closeButton);
      });
    });

    test("overlayModalPage opens the edit modal and loads the data for the selectedEntity", async () => {
      const editEntityButtons = screen.getAllByText(editEntityButtonText);
      expect(editEntityButtons.length).toEqual(2);
      await act(async () => {
        await userEvent.click(editEntityButtons[0]);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });
      expect(
        screen.getByText(
          `${addEditModalEditTitle} ${mockEntityStore.selectedEntity?.initiative_name}`
        )
      ).toBeVisible;
      const closeButton = screen.getByText("Close");
      await act(async () => {
        await userEvent.click(closeButton);
      });
    });

    test("overlayModalPage opens the delete modal and close the delete modal", async () => {
      const deleteEntityButton = screen.getAllByTestId("delete-entity-button");
      expect(deleteEntityButton.length).toEqual(2);
      await act(async () => {
        await userEvent.click(deleteEntityButton[0]);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });
      expect(screen.getByText(`${deleteModalTitle}`)).toBeVisible();
      const closeButton = screen.getByText("Cancel");
      await act(async () => {
        await userEvent.click(closeButton);
      });
      expect(deleteEntityButton.length).toEqual(2);
    });
  });

  describe("Test overlayModalPage with SAR's Objective Progress Entity", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseObjectiveProgressEntityStore);
      render(overlayModalPageComponentWithCardsEntities);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("overlayModalPage should render the view", () => {
      expect(
        screen.getByText(
          mockObjectiveProgress[0].objectiveProgress_objectiveName
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          mockObjectiveProgress[1].objectiveProgress_objectiveName
        )
      ).toBeVisible();
    });

    test("overlayModalPage CAN NOT open the add modal", async () => {
      const addEntityButton = screen.queryAllByText(addEntityButtonText);
      expect(addEntityButton.length).toEqual(0);
    });

    test("overlayModalPage opens the edit modal with enabled submit for closed initiative", async () => {
      let mockEntityStore = {
        ...mockObjectiveProgressEntityStore,
        selectedEntity: {
          id: "mock-id",
          type: "objectiveProgress",
          initiative_name: "mock-initiative-name",
          objectiveProgress: mockObjectiveProgress,
          isInitiativeClosed: true,
        },
      };

      const mockEntityWithDisabledInitiative = {
        ...mockUseSARStore,
        ...mockEntityStore,
      };
      mockedUseStore.mockReturnValue(mockEntityWithDisabledInitiative);
      render(overlayModalPageComponentWithCardsEntities);
      const reportProgressButton = screen.getAllByText(
        reportProgressButtonText
      );
      await act(async () => {
        await userEvent.click(reportProgressButton[0]);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });
      const textField = screen.getByRole("textbox", {
        name: "mock-performance-indicators",
      });
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test");
      });
      const submitButton = screen.getByRole("button", { name: "Save" });
      expect(submitButton).not.toBeDisabled();
    });
  });

  testA11yAct(overlayModalPageComponentWithEntities, () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    mockedUseStore.mockReturnValue(mockEntityStore);
  });
});
