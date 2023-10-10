import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { OverlayModalPage } from "./OverlayModalPage";
import { useStore } from "utils";
// utils
import {
  mockOverlayModalPageJson,
  RouterWrappedComponent,
  mockReportStore,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const { addEntityButtonText } = mockOverlayModalPageJson.verbiage;

const mockEntity = {
  id: "mock-id",
  initiative_name: "mock-name",
};

const overlayModalPageComponentWithEntities = (
  <RouterWrappedComponent>
    <OverlayModalPage entity={mockEntity} route={mockOverlayModalPageJson} />
  </RouterWrappedComponent>
);

describe("Test overlayModalPage with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(overlayModalPageComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("overlayModalPage should render the view", () => {
    expect(screen.getAllByText(addEntityButtonText)[0]).toBeVisible();
  });

  it("overlayModalPage Modal opens correctly", async () => {
    const addEntityButton = screen.getAllByText(addEntityButtonText);
    await userEvent.click(addEntityButton[0]);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  // TODO: add some unit tests
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(overlayModalPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
