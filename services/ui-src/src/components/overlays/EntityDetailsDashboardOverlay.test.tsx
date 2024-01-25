import { fireEvent, render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockUseEntityStore,
  mockEntityDetailsDashboardOverlayJson,
  mockFormField,
  mockVerbiageIntro,
  mockGenericEntity,
} from "../../utils/testing/setupJest";
import { EntityDetailsDashboardOverlay } from "./EntityDetailsDashboardOverlay";
import { useStore } from "utils";
import { axe } from "jest-axe";

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

const entityDetailsDashboardOverlayComponent = (
  <RouterWrappedComponent>
    <EntityDetailsDashboardOverlay
      route={mockEntityDetailsDashboardOverlayJson}
      dashboard={mockDashboard}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
    />
  </RouterWrappedComponent>
);

const entityDetailsDashboardOverlayComponentWithSelectedEntity = (
  <RouterWrappedComponent>
    <EntityDetailsDashboardOverlay
      route={mockEntityDetailsDashboardOverlayJson}
      dashboard={mockDashboard}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      selectedEntity={mockGenericEntity}
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

  test("EntityDetailsDashboardOverlay left arrow returns user to all initiatives", () => {
    fireEvent.click(
      screen.getAllByText("Return to all initiatives")[0] as HTMLAnchorElement
    );
    expect(mockCloseEntityDetailsOverlay).toHaveBeenCalledTimes(1);
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
