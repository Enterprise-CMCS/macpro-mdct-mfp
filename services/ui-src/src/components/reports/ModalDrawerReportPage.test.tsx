import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
  mockUseStore,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// constants
import { saveAndCloseText } from "../../constants";
import { useStore } from "utils/state/useStore";
import { ReportShape } from "types";

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

const mockReportStoreWithoutEntities = {
  ...mockUseStore,
  report: {
    ...(mockWPFullReport as ReportShape),
    fieldData: {},
  },
};

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const {
  addEntityButtonText,
  editEntityButtonText,
  enterEntityDetailsButtonText,
  deleteModalConfirmButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const modalDrawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalDrawerReportPage without entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockReportStoreWithoutEntities);
    render(modalDrawerReportPageComponent);
  });

  it("should render the view", () => {
    expect(screen.getByText(addEntityButtonText)).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(modalDrawerReportPageComponent);
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

    const closeButton = screen.getByText("Cancel");
    await userEvent.click(closeButton);
  });

  it("ModalDrawerReportPage Edit Modal opens correctly", async () => {
    const editEntityButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Cancel");
    await userEvent.click(closeButton);
  });

  test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
    const addEntityButton = screen.getByText(addEntityButtonText);
    const removeButton = screen.getByTestId("delete-entity");
    await userEvent.click(removeButton);
    // click delete in modal
    const deleteButton = screen.getByText(deleteModalConfirmButtonText);
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.queryAllByTestId("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(0);
    expect(addEntityButton).toBeVisible();
  });

  test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
    const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(enterDetailsButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const textField = await screen.getByLabelText("mock drawer text field");
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer doesn't autosave if no change was made by State User", async () => {
    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    const { container } = render(modalDrawerReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
