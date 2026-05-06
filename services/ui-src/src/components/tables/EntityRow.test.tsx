import { render, screen, within } from "@testing-library/react";
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
import {
  EntityDetailsOverlayShape,
  EntityDetailsOverlayTypes,
  EntityShape,
  ModalDrawerEntityTypes,
  OverlayModalStepTypes,
  OverlayModalTypes,
} from "types";
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
  deleteEntityDetailsButtonText: "Delete",
  drawerTitle: "Report transition benchmarks for ",
};

const tableContent = {
  headRow: ["", "", ""],
  bodyRows: [],
};

const mockEntityInfo = ["transitionBenchmarks_targetPopulationName"];
const mockEntityClosed = {
  ...mockGenericEntity,
  isInitiativeClosed: true,
  closeOutInformation_actualEndDate: "01/01/2026",
  closedBy: "Mock User",
};

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

const entityRowInitiative = (
  entity: EntityShape,
  formEntity?: EntityDetailsOverlayShape
) => (
  <RouterWrappedComponent>
    <Table content={tableContent}>
      <EntityRow
        entity={entity}
        entityInfo={["initiative_name", "initiative_wpTopic"]}
        entityType={OverlayModalTypes.INITIATIVE}
        formEntity={formEntity}
        openAddEditEntityModal={mockOpenAddEditEntityModal}
        openDeleteEntityModal={mockOpenDeleteEntityModal}
        openOverlayOrDrawer={mockOpenDrawer}
        verbiage={verbiage}
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
      const launchDrawerButton = screen.getByRole("button", {
        name: `${verbiage.enterEntityDetailsButtonText} Older Adults`,
      });
      await userEvent.click(launchDrawerButton);
      expect(mockOpenDrawer).toHaveBeenCalledTimes(1);
    });
  });

  describe("Test EntityRow with closed status", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render the correct button text in a work plan", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowWithClosedEntities);
      const viewButton = screen.getByRole("button", {
        name: `${verbiage.readOnlyEntityDetailsButtonText} Other:`,
      });
      expect(viewButton).toBeVisible();
    });

    test("should render the correct button text in a SAR", () => {
      mockedUseStore.mockReturnValue(mockSARReportStore);
      render(entityRowWithClosedEntities);
      const editButton = screen.getByRole("button", {
        name: `${verbiage.enterEntityDetailsButtonText} Other:`,
      });
      expect(editButton).toBeVisible();
    });

    test("should show closeout details if specified", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowWithCloseoutDetails);
      expect(
        screen.getByRole("columnheader", { name: "Actual end date" })
      ).toBeVisible();
      expect(
        screen.getByRole("columnheader", { name: "Closed by" })
      ).toBeVisible();
      expect(screen.getByRole("cell", { name: "01/01/2026" })).toBeVisible();
      expect(screen.getByRole("cell", { name: "Mock User" })).toBeVisible();
    });
  });

  describe("EntityRow with initiative", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("show initiative with close-out step", () => {
      const entity = {
        ...mockGenericEntity,
        initiative_name: "Mock initiative name",
        initiative_wpTopic: [
          {
            key: "mockId",
            value: "Mock topic",
          },
        ],
      };

      const formEntity = {
        stepType: EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION,
      } as EntityDetailsOverlayShape;

      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowInitiative(entity, formEntity));

      const cells = screen.getAllByRole("cell");
      const firstCell = cells[0];
      const statusIcon = within(firstCell).queryByRole("img");
      expect(statusIcon).not.toBeInTheDocument();
      expect(screen.getByText("Mock initiative name")).toBeVisible();
      expect(screen.getByText("Mock topic")).toBeVisible();
    });

    test("show initiative with other step", () => {
      const entity = {
        ...mockGenericEntity,
        initiative_name: "Mock initiative name",
        initiative_wpTopic: [
          {
            key: "mockId",
            value: "Mock topic",
          },
        ],
      };

      const formEntity = {
        stepType: OverlayModalStepTypes.EVALUATION_PLAN,
      } as EntityDetailsOverlayShape;

      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowInitiative(entity, formEntity));

      const cells = screen.getAllByRole("cell");
      const firstCell = cells[0];
      const statusIcon = within(firstCell).getByRole("img", {
        name: "warning icon",
      });
      expect(statusIcon).toBeVisible();
      expect(screen.getByText("Mock initiative name")).toBeVisible();
      expect(screen.getByText("Mock topic")).toBeVisible();
      expect(screen.getByText('Select "Edit" to report data.')).toBeVisible();
    });

    test("show closed initiative with close-out step", () => {
      const entity = {
        ...mockEntityClosed,
        initiative_name: "Mock initiative name",
        initiative_wpTopic: [
          {
            key: "mockId",
            value: "Mock topic",
          },
        ],
      };

      const formEntity = {
        stepType: EntityDetailsOverlayTypes.CLOSEOUT_INFORMATION,
      } as EntityDetailsOverlayShape;

      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowInitiative(entity, formEntity));

      const cells = screen.getAllByRole("cell");
      const firstCell = cells[0];
      const statusIcon = within(firstCell).getByRole("img", {
        name: "close icon",
      });
      expect(statusIcon).toBeVisible();
      expect(screen.getByText("Mock initiative name")).toBeVisible();
      expect(screen.getByText("Mock topic")).toBeVisible();
    });

    test("show closed initiative details", () => {
      const entity = {
        ...mockEntityClosed,
        initiative_name: "Mock initiative name",
        initiative_wpTopic: [
          {
            key: "mockId",
            value: "Mock topic",
          },
        ],
      };

      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowInitiative(entity));

      const cells = screen.getAllByRole("cell");
      const firstCell = cells[0];
      const statusIcon = within(firstCell).getByRole("img", {
        name: "close icon",
      });
      expect(statusIcon).toBeVisible();
      expect(screen.getByText("[Closed] Mock initiative name")).toBeVisible();
      expect(screen.getByText("Mock topic")).toBeVisible();
    });

    test("show closed initiative details with other topic", () => {
      const entity = {
        ...mockEntityClosed,
        initiative_wpTopic: [
          {
            key: "mockId",
            value: "Other, specify",
          },
        ],
        initiative_wp_otherTopic: "Mock other topic",
      };

      mockedUseStore.mockReturnValue(mockReportStore);
      render(entityRowInitiative(entity));
      expect(screen.getByText("Mock other topic")).toBeVisible();
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
      const editNameButton = screen.getByRole("button", {
        name: `${verbiage.editEntityButtonText}`,
      });
      await userEvent.click(editNameButton);
      expect(mockOpenAddEditEntityModal).toHaveBeenCalledTimes(1);
    });

    test("includes a delete button that removes the new other target population", async () => {
      const deleteButton = screen.getByRole("button", {
        name: `${verbiage.deleteEntityDetailsButtonText}`,
      });
      await userEvent.click(deleteButton);
      expect(mockOpenDeleteEntityModal).toHaveBeenCalledTimes(1);
    });
  });

  testA11yAct(entityRowWithEntities, () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
