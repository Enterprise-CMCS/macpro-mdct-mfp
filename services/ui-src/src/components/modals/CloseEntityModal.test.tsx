import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { CloseEntityModal } from "components";
// utils
import { mockEntityDetailsOverlayJson } from "utils/testing/setupJest";

const mockCloseHandler = jest.fn();

const mockEntityName = "mock-name";

const modalComponent = (
  <CloseEntityModal
    route={mockEntityDetailsOverlayJson}
    modalDisclosure={{
      isOpen: true,
      onClose: mockCloseHandler,
    }}
  />
);

const {
  closeOutModalBodyText,
  closeOutModalConfirmButtonText,
  closeOutModalTitle,
} = mockEntityDetailsOverlayJson.verbiage.closeOutModal;

const closeOutModalTitleWithName = closeOutModalTitle + mockEntityName;

describe("Test CloseEntityModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("CloseEntityModal shows the contents", () => {
    expect(screen.getByText(closeOutModalTitleWithName)).toBeTruthy();
    expect(screen.getByText(closeOutModalBodyText)).toBeTruthy();
    expect(screen.getByText(closeOutModalConfirmButtonText)).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("CloseEntityModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("CloseEntityModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test CloseEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
