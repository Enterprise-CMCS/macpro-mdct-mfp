import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ModalDrawerReportPage } from "./ModalDrawerReportPage";
// utils
import {
  mockModalDrawerReportPageJson,
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
  // editEntityButtonText,
  enterEntityDetailsButtonText,
  // deleteModalConfirmButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const modalDrawerReportPageComponentWithEntities = (
  <RouterWrappedComponent>
    <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
  </RouterWrappedComponent>
);

describe("Test ModalDrawerReportPage with entities", () => {
  beforeEach(() => {
    render(modalDrawerReportPageComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ModalDrawerReportPage should render the view", () => {
    expect(screen.getByText(addEntityButtonText)).toBeVisible();
  });

  it("ModalDrawerReportPage Modal opens correctly", async () => {
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  it("ModalDrawerReportPage Modal opens correctly", async () => {
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  // TODO: test delete modal + functionality

  test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
    const enterDetailsButton = screen.getAllByText(
      enterEntityDetailsButtonText
    )[0];
    await userEvent.click(enterDetailsButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalDrawerReportPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
