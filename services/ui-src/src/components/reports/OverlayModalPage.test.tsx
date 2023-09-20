import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { OverlayModalPage } from "./OverlayModalPage";
// utils
import {
  mockOverlayModalPageJson,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const {
  addEntityButtonText,
  editEntityButtonText,
  // deleteModalConfirmButtonText,
} = mockOverlayModalPageJson.verbiage;

const overlayModalPageComponentWithEntities = (
  <RouterWrappedComponent>
    <OverlayModalPage route={mockOverlayModalPageJson} />
  </RouterWrappedComponent>
);

describe("Test overlayModalPage with entities", () => {
  beforeEach(() => {
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

    const editButton = screen.getAllByText(editEntityButtonText)[0];
    await userEvent.click(editButton);
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  // TODO: test delete modal + functionality
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(overlayModalPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
