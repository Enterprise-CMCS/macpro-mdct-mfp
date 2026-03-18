import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { Menu } from "components";
// utils
import {
  mockUserContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { UserContext } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockLogout = jest.fn();

const mockContext = {
  ...mockUserContext,
  logout: mockLogout,
};

const menuComponent = (
  <RouterWrappedComponent>
    <UserContext.Provider value={mockContext}>
      <Menu />
    </UserContext.Provider>
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  test("Menu button is visible", () => {
    render(menuComponent);
    expect(screen.getByTestId("header-menu-dropdown-button")).toBeVisible();
  });

  test("Menu button exposes required ARIA attributes and state", async () => {
    const user = userEvent.setup();
    render(menuComponent);

    const menuButton = screen.getByTestId("header-menu-dropdown-button");
    const menuList = screen.getByTestId("header-menu-options-list");

    expect(menuButton).toHaveAttribute("aria-haspopup", "menu");

    const ariaControls = menuButton.getAttribute("aria-controls");
    expect(ariaControls).toBeTruthy();
    expect(menuList).toHaveAttribute("id", ariaControls);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  test("Menu button logout fires logout function", async () => {
    const user = userEvent.setup();
    render(menuComponent);

    const menuButton = screen.getByTestId("header-menu-dropdown-button");
    await user.click(menuButton);

    const logoutButton = screen.getByTestId("header-menu-option-log-out");
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(menuButton).toHaveFocus();
  });

  test("Escape closes the menu and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(menuComponent);

    const menuButton = screen.getByTestId("header-menu-dropdown-button");
    await user.click(menuButton);

    const manageAccountOption = screen.getByTestId(
      "header-menu-option-manage-account"
    );
    manageAccountOption.focus();
    expect(manageAccountOption).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(menuButton).toHaveFocus();
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  testA11yAct(menuComponent);
});
