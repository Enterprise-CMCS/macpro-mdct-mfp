import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockEntityStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { useContext, useMemo } from "react";
// constants
import { EntityProvider, EntityContext } from "./EntityProvider";

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
mockedUseStore.mockReturnValue(mockEntityStore);

interface Props {
  value?: Object;
}

const TestComponent = (props: Props) => {
  if (props) {
    return (
      <div>
        <p data-testid="initiative-name">
          {JSON.stringify(mockEntityStore.selectedEntity?.initiative_name)}
        </p>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const providerValue = () => {
  const { prepareEntityPayload } = useContext(EntityContext);
  return useMemo(
    () => ({
      prepareEntityPayload,
    }),
    [mockEntityStore.selectedEntity]
  );
};
const testComponent = (
  <EntityProvider>
    <EntityContext.Provider
      value={mockEntityStore.selectedEntity?.initiative_name}
    >
      <TestComponent value={providerValue} />
    </EntityContext.Provider>
  </EntityProvider>
);

describe("Test EntityProvider accessibility", () => {
  it("Should not have basic accessibility issues", () => {
    render(testComponent);
    expect(screen.getByTestId("initiative-name")).toBeVisible();
  });
});

describe("Test EntityProvider accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(testComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
