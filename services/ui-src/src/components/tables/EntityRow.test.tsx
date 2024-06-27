import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterWrappedComponent,
  mockReportStore,
  mockUseStore,
  mockTargetPopulationEntity,
  mockOtherTargetPopulationEntity,
  mockGenericEntity,
  mockSARReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// constants
import { EntityRow } from "./EntityRow";
import { Table } from "components";
import { ModalDrawerEntityTypes } from "types";
import { testA11y } from "utils/testing/commonTests";

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
  readOnlyEntityDetailsButtonText: "View",
  drawerTitle: "Report transition benchmarks for ",
};

const tableContent = {
  headRow: ["", "", ""],
  bodyRows: [],
};

const mockEntityInfo = ["transitionBenchmarks_targetPopulationName"];
const mockEntityClosed = { ...mockGenericEntity, isInitiativeClosed: true };

const entityRowWithEntities = (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={mockTargetPopulationEntity}
        entityType={ModalDrawerEntityTypes.TARGET_POPULATIONS}
        verbiage={verbiage}
        entityInfo={mockEntityInfo}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openOverlayOrDrawer={mockOpenDrawer}
      />
    </Table>
  </RouterWrappedComponent>
);

const entityRowWithClosedEntities = (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={mockEntityClosed}
        entityType={ModalDrawerEntityTypes.TARGET_POPULATIONS}
        verbiage={verbiage}
        entityInfo={mockEntityInfo}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openOverlayOrDrawer={mockOpenDrawer}
      />
    </Table>
  </RouterWrappedComponent>
);

const entityRowWithCloseoutDetails = (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={mockEntityClosed}
        entityType={ModalDrawerEntityTypes.TARGET_POPULATIONS}
        verbiage={verbiage}
        entityInfo={mockEntityInfo}
        showEntityCloseoutDetails={true}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openOverlayOrDrawer={mockOpenDrawer}
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
        openOverlayOrDrawer={mockOpenDrawer}
      />
    </Table>
  </RouterWrappedComponent>
);

describe("<EntityRow />", () => {
  describe("Test EntityRow with entities", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(entityRowWithEntities);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render the view", () => {
      expect(screen.getByText("Older Adults")).toBeVisible();
    });

    test("should have a completed icon on the first entity", () => {
      expect(screen.getAllByAltText("complete icon")[0]).toBeTruthy();
    });

    test("Opens the drawer correctly", async () => {
      const launchDrawerButton = screen.getByText(
        verbiage.enterEntityDetailsButtonText
      );
      await userEvent.click(launchDrawerButton);
      expect(mockOpenDrawer).toBeCalledTimes(1);
    });
  });

  describe("Test EntityRow with closed status", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render the correct button text in a work plan", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowWithClosedEntities);
      const viewButton = screen.getByText(
        verbiage.readOnlyEntityDetailsButtonText
      );
      expect(viewButton).toBeVisible();
    });

    test("should render the correct button text in a SAR", () => {
      mockedUseStore.mockReturnValue(mockSARReportStore);
      render(entityRowWithClosedEntities);
      const editButton = screen.getByText(
        verbiage.enterEntityDetailsButtonText
      );
      expect(editButton).toBeVisible();
    });

    test("should show closeout details if specified", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowWithCloseoutDetails);
      expect(screen.getByText("Closed by")).toBeVisible();
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

    test("should have an incomplete icon on the new entity", () => {
      expect(screen.getAllByAltText("warning icon")[0]).toBeTruthy();
    });

    test("includes an edit name button in the row", async () => {
      const editNameButton = screen.getByText(verbiage.editEntityButtonText);
      await userEvent.click(editNameButton);
      expect(mockOpenAddEditEntityModal).toBeCalledTimes(1);
    });

    test("includes a delete button that removes the new other target population", async () => {
      const deleteButton = screen.getByTestId("delete-entity");
      await userEvent.click(deleteButton);
      expect(mockOpenDeleteEntityModal).toBeCalledTimes(1);
    });
  });

  testA11y(entityRowWithEntities, () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
