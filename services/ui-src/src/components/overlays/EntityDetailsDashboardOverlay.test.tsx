import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockUseEntityStore,
  mockEntityDetailsDashboardOverlayJson,
  mockFormField,
  mockVerbiageIntro,
  mockGenericEntity,
  mockModalForm,
  mockModalOverlayReportPageVerbiage,
} from "../../utils/testing/setupJest";
import { EntityDetailsDashboardOverlay } from "./EntityDetailsDashboardOverlay";
import { useStore } from "utils";
import { axe } from "jest-axe";
import { entityTypes } from "../../types";
import userEvent from "@testing-library/user-event";

const mockCloseEntityDetailsOverlay = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseEntityStore);

const mockDashboard = {
  id: "mock id",
  fields: [mockFormField],
  name: "mock dashboard",
  pageType: "entityDetailsDashboardOverlay",
  verbiage: {
    intro: mockVerbiageIntro,
  },
};

export const mockEntitySteps = [
  {
    stepName: "mock entity 1 1",
    stepType: "mock type",
    stepInfo: ["mock step info"],
    hint: "mock hint",
    verbiage: mockModalOverlayReportPageVerbiage,
    modalForm: mockModalForm,
    entityType: entityTypes[0],
    name: "mock name",
    path: "/mock/mock-route-entity-dashboard-overlay",
  },
];

const entityDetailsDashboardOverlayComponent = (
  <RouterWrappedComponent>
    <EntityDetailsDashboardOverlay
      dashboard={mockDashboard}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      entitySteps={mockEntitySteps}
    />
  </RouterWrappedComponent>
);

const entityDetailsDashboardOverlayComponentWithSelectedEntity = (
  <RouterWrappedComponent>
    <EntityDetailsDashboardOverlay
      dashboard={mockDashboard}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      selectedEntity={mockGenericEntity}
      entitySteps={mockEntitySteps}
    />
  </RouterWrappedComponent>
);

describe("Test EntityDetailsDashboardOverlay", () => {
  beforeEach(async () => {
    render(entityDetailsDashboardOverlayComponent);
  });

  test("EntityDetailsDashboardOverlay view renders", () => {
    // Check that the header rendered
    expect(
      screen.getByText(
        mockEntityDetailsDashboardOverlayJson.verbiage.intro.section
      )
    ).toBeVisible();

    // Check that the subsection rendered
    expect(
      screen.getByText(
        mockEntityDetailsDashboardOverlayJson.verbiage.intro.subsection
      )
    ).toBeVisible();
  });

  test("EntityDetailsDashboardOverlay left arrow returns user to all initiatives", async () => {
    await userEvent.click(
      screen.getAllByText("Return to all initiatives")[0] as HTMLAnchorElement
    );
    await expect(mockCloseEntityDetailsOverlay).toHaveBeenCalledTimes(1);
  });
});

describe("Test EntityDetailsDashboardOverlay with selected entity", () => {
  test("EntityDetailsDashboardOverlay with selected entity renders view", () => {
    render(entityDetailsDashboardOverlayComponentWithSelectedEntity);

    // Check that the header rendered
    expect(
      screen.getByText(
        mockEntityDetailsDashboardOverlayJson.verbiage.intro.section
      )
    ).toBeVisible();
  });
});

describe("Test EntityDetailsDashboardOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDetailsDashboardOverlayComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
