import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  RouterWrappedComponent,
  mockEntityStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// constants
import { EntityProvider } from "./EntityProvider";

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

const entityProviderPage = (
  <RouterWrappedComponent>
    <EntityProvider />
  </RouterWrappedComponent>
);

describe("Test EntityProvider accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockEntityStore);
    const { container } = render(entityProviderPage);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
