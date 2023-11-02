import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ModalOverlayReportPage } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalOverlayReportPageJson,
  mockReportStore,
  mockUseEntityStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockSetSidebarHidden = jest.fn();

const {
  addEntityButtonText,
  editEntityButtonText,
  // deleteModalConfirmButtonText,
} = mockModalOverlayReportPageJson.verbiage;

const modalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <ModalOverlayReportPage
      route={mockModalOverlayReportPageJson}
      setSidebarHidden={mockSetSidebarHidden}
    />
  </RouterWrappedComponent>
);

const verbiage = mockModalOverlayReportPageJson.verbiage;

describe("Test ModalOverlayReportPage with entities", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("modaloverlaypage should render the view", () => {
    mockedUseStore.mockReturnValue(mockReportStore);
    render(modalOverlayReportPageComponent);
    expect(screen.getByText(addEntityButtonText)).toBeVisible();
  });

  it("should open the edit modal", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent);
    // Get the Edit button and click it
    const editEntityButton = screen.getByText(verbiage.editEntityButtonText);
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // Close out of the modal it created
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);

    // And make sure they can still add entities
    const addEntityButton = screen.getByText(verbiage.addEntityButtonText);
    expect(addEntityButton).toBeVisible();
  });

  it("overlayModal Modal edits open correctly", async () => {
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(modalOverlayReportPageComponent);
    const editEntityButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  // TODO: test delete modal + functionality
});

//to do: fix issue with accessibility
/*
 * describe("Test ModalOverlayReportPage accessibility", () => {
 *   it("Should not have basic accessibility issues", async () => {
 *     mockedUseStore.mockReturnValue(mockReportStore);
 *     const { container } = render(modalOverlayReportPageComponent);
 *     const results = await axe(container);
 *     expect(results).toHaveNoViolations();
 *   });
 * });
 */
