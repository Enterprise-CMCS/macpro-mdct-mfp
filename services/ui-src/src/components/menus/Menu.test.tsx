import { act, render, screen } from "@testing-library/react";
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

  test("Menu button logout fires logout function", async () => {
    render(menuComponent);
    const logoutButton = screen.getByText("Log Out");
    await act(async () => {
      await userEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  testA11yAct(menuComponent);
});
