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

const { addEntityButtonText, editEntityButtonText } =
  mockOverlayModalPageJson.verbiage;

const overlayModalPageComponentWithEntities = (
  <RouterWrappedComponent>
    <OverlayModalPage route={mockOverlayModalPageJson} />
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

  it("overlayModal Modal edits open correctly", async () => {
    const editEntityButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  // TODO: test delete modal + functionality
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    const { container } = render(overlayModalPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
