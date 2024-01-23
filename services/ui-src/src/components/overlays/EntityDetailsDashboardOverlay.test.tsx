import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "../../utils/testing/mockRouter";
import {
  mockUseEntityStore,
  mockEntityDetailsDashboardOverlayJson,
  mockFormField,
  mockVerbiageIntro,
} from "../../utils/testing/setupJest";
import { EntityDetailsDashboardOverlay } from "./EntityDetailsDashboardOverlay";
import { useStore } from "utils";
import { axe } from "jest-axe";

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
    <EntityDetailsDashboardOverlay dashboard={mockDashboard} />
  </RouterWrappedComponent>
);

describe("Test EntityDetailsDashboardOverlay", () => {
  test("EntityDetailsDashboardOverlay view renders", () => {
    render(entityDetailsDashboardOverlayComponent);
    // Check that the header rendered
    expect(
      screen.getByText(
        mockEntityDetailsDashboardOverlayJson.verbiage.intro.section
      )
    ).toBeVisible();

    expect(
      screen.getByText(
        mockEntityDetailsDashboardOverlayJson.verbiage.intro.subsection
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
