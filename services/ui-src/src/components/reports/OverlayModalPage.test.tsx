import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
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
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const {
  addEntityButtonText,
  editEntityButtonText,
  addEditModalEditTitle,
  deleteModalTitle,
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

describe("Test overlayModalPage with Work Plans's Evaluation Plan Entity", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseEvaluationPlanEntityStore);
    render(overlayModalPageComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("overlayModalPage should render the view", () => {
    expect(
      screen.getByText(mockEvaluationPlan[0].evaluationPlan_objectiveName)
    ).toBeVisible();
    expect(
      screen.getByText(mockEvaluationPlan[1].evaluationPlan_objectiveName)
    ).toBeVisible();
  });

  it("overlayModalPage opens the add edit modal correctly", async () => {
    const addEntityButton = screen.getAllByText(addEntityButtonText);
    await userEvent.click(addEntityButton[0]);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  it("overlayModalPage opens the edit modal and loads the data for the selectedEntity", async () => {
    const editEntityButtons = screen.getAllByText(editEntityButtonText);
    expect(editEntityButtons.length).toEqual(2);
    await userEvent.click(editEntityButtons[0]);
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(
      screen.getByText(
        `${addEditModalEditTitle} ${mockEntityStore.selectedEntity?.initiative_name}`
      )
    ).toBeVisible;
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  it("overlayModalPage opens the delete modal and close the delete modal", async () => {
    const deleteEntityButton = screen.getAllByTestId("delete-entity-button");
    expect(deleteEntityButton.length).toEqual(2);
    await userEvent.click(deleteEntityButton[0]);
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText(`${deleteModalTitle}`)).toBeVisible();
    const closeButton = screen.getByText("Cancel");
    await userEvent.click(closeButton);
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

  it("overlayModalPage should render the view", () => {
    expect(
      screen.getByText(mockObjectiveProgress[0].objectiveProgress_objectiveName)
    ).toBeVisible();
    expect(
      screen.getByText(mockObjectiveProgress[1].objectiveProgress_objectiveName)
    ).toBeVisible();
  });

  it("overlayModalPage CAN NOT open the add modal", async () => {
    const addEntityButton = screen.queryAllByText(addEntityButtonText);
    expect(addEntityButton.length).toEqual(0);
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    mockedUseStore.mockReturnValue(mockEntityStore);
    const { container } = render(overlayModalPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
