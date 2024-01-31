import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockEntityStore, mockReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { useContext } from "react";
import { EntityProvider, EntityContext } from "./EntityProvider";
import userEvent from "@testing-library/user-event";

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
  const { prepareEntityPayload } = useContext(EntityContext);
  if (props) {
    return (
      <div>
        <button
          onClick={() => prepareEntityPayload(mockEntityStore.selectedEntity)}
        >
          Prepare Entity
        </button>
        <p data-testid="initiative-name">
          {JSON.stringify(mockEntityStore.selectedEntity?.initiative_name)}
        </p>
      </div>
    );
  } else {
    return <div></div>;
  }
};

const testComponent = (
  <EntityProvider>
    <TestComponent />
  </EntityProvider>
);

describe("Test EntityProvider", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    mockedUseStore.mockReturnValue(mockEntityStore);
  });

  test("EntityProvider prepares entity payload successfully", async () => {
    const result = render(testComponent);
    expect(
      result.container.querySelector("[data-testid='initiative-name']")
        ?.innerHTML
    ).toMatch(JSON.stringify(mockEntityStore.selectedEntity?.initiative_name));
    const button = await result.findByText("Prepare Entity");
    await userEvent.click(button);
  });
});

describe("Test EntityProvider accessibility", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    mockedUseStore.mockReturnValue(mockEntityStore);
  });

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
