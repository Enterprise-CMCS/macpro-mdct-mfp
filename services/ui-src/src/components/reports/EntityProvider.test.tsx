import { MockedFunction } from "vitest";
import { render } from "@testing-library/react";
import { mockEntityStore, mockReportStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { useContext } from "react";
import { EntityProvider, EntityContext } from "./EntityProvider";
import userEvent from "@testing-library/user-event";
import { testA11yAct } from "utils/testing/commonTests";

const mockUseNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
  useLocation: vi.fn(() => ({
    pathname: "/mock-route",
  })),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockEntityStore);

const TestComponent = () => {
  const { prepareEntityPayload } = useContext(EntityContext);
  return (
    <div>
      <button onClick={() => prepareEntityPayload({ test: "update" })}>
        Prepare Entity
      </button>
      <p id="entities">{JSON.stringify(mockEntityStore.selectedEntity)}</p>
      <p data-testid="initiative-name">
        {JSON.stringify(mockEntityStore.selectedEntity?.initiative_name)}
      </p>
    </div>
  );
};

const testComponent = (
  <EntityProvider>
    <TestComponent />
  </EntityProvider>
);

describe("<EntityProvider />", () => {
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
    expect(
      result.container.querySelector("[id='entities']")?.innerHTML
    ).toMatch(JSON.stringify(mockEntityStore.selectedEntity));
  });

  testA11yAct(testComponent);
});
