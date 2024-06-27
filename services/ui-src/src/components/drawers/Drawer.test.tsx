import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { Drawer } from "components";
// constants
import { closeText } from "../../constants";
import { testA11y } from "utils/testing/commonTests";

const mockOnClose = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

const mockVerbiage = {
  drawerTitle: "mock title",
  drawerInfo: [{ type: "heading", content: "mock heading" }],
};

const drawerComponent = (
  <Drawer verbiage={mockVerbiage} drawerDisclosure={mockDrawerDisclosure} />
);

describe("<Drawer />", () => {
  describe("Test Drawer fill form and close", () => {
    test("Drawer can be closed with close button", async () => {
      render(drawerComponent);
      const closeButton = screen.getByText(closeText);
      expect(closeButton).toBeVisible();
      await userEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  testA11y(drawerComponent);
});
