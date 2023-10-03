import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import {
  RouterWrappedComponent,
  mockReportStore,
  mockUseStore,
  mockTargetPopulationEntity,
  mockOtherTargetPopulationEntity,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// constants
import { EntityRow } from "./EntityRow";
import { Table } from "components";
import { ModalDrawerEntityTypes } from "types";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockOpenAddEditEntityModal = jest.fn();
const mockOpenDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

const verbiage = {
  dashboardTitle:
    "Report projected number of transitions for each target population",
  addEntityButtonText: "Add other target population",
  editEntityButtonText: "Edit name",
  addEditModalAddTitle: "Add other target population",
  addEditModalEditTitle: "Edit other target population",
  deleteEntityButtonAltText: "Delete other target population",
  enterEntityDetailsButtonText: "Edit",
  drawerTitle: "Report transition benchmarks for ",
};

const tableContent = {
  headRow: ["", "", ""],
  bodyRows: [],
};

const mockEntityInfo = ["transitionBenchmarks_targetPopulationName"];

const entityRowWithEntities = (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={mockTargetPopulationEntity}
        verbiage={verbiage}
        entityInfo={mockEntityInfo}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openDrawer={mockOpenDrawer}
      />
    </Table>
  </RouterWrappedComponent>
);

const addedOtherEntityRow = (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={mockOtherTargetPopulationEntity}
        entityType={ModalDrawerEntityTypes.TARGET_POPULATIONS}
        verbiage={verbiage}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openDrawer={mockOpenDrawer}
      />
    </Table>
  </RouterWrappedComponent>
);

describe("Test EntityRow with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(entityRowWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    expect(screen.getByText("Older Adults")).toBeVisible();
  });

  it("should have a completed icon on the first entity", () => {
    expect(screen.getAllByAltText("complete icon")[0]).toBeTruthy();
  });

  it("Opens the drawer correctly", async () => {
    const launchDrawerButton = screen.getByText(
      verbiage.enterEntityDetailsButtonText
    );
    await userEvent.click(launchDrawerButton);
    expect(mockOpenDrawer).toBeCalledTimes(1);
  });
});

describe("Test other EntityRow", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(addedOtherEntityRow);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should have an incomplete icon on the new entity", () => {
    expect(screen.getAllByAltText("warning icon")[0]).toBeTruthy();
  });

  it("includes an edit name button in the row", async () => {
    const editNameButton = screen.getByText(verbiage.editEntityButtonText);
    await userEvent.click(editNameButton);
    expect(mockOpenAddEditEntityModal).toBeCalledTimes(1);
  });

  it("includes a delete button that removes the new other target population", async () => {
    const deleteButton = screen.getByTestId("delete-entity");
    await userEvent.click(deleteButton);
    expect(mockOpenDeleteEntityModal).toBeCalledTimes(1);
  });
});

describe("Test EntityRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(entityRowWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
