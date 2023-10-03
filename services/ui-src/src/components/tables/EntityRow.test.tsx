import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import {
  mockDrawerReportPageJson,
  RouterWrappedComponent,
  mockReportStore,
  mockEntityRow,
  mockTargetPopulationEntity,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// constants
import { EntityRow } from "./EntityRow";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const entityRowContent = {
  entity: "",
  entityInfo: "",
  entityType: "",
  verbiage: "",
  openAddEditEntityModal: () => {},
  openDeleteEntityModal: () => {},
  openDrawer: () => {},
};

const entityRowComponent = (
  <RouterWrappedComponent>
    <EntityRow
      entity={mockTargetPopulationEntity}
      verbiage={undefined}
      openAddEditEntityModal={undefined}
      openDeleteEntityModal={undefined}
      openDrawer={undefined}
    />
  </RouterWrappedComponent>
);

describe("Test EntityRow with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(entityRowComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    expect(
      screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
    ).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    const launchDrawerButton = screen.getAllByText("Edit")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test EntityRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(drawerReportPageWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
