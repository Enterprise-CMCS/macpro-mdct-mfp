import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { Timeout } from "components";
// constants
import { IDLE_WINDOW, PROMPT_AT } from "../../constants";
// utils
import {
  mockStateUserStore,
  mockUserContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { initAuthManager, useUser } from "utils";

const timeoutComponent = (
  <RouterWrappedComponent>
    <Timeout />
  </RouterWrappedComponent>
);

const mockLogout = { logout: jest.fn() };

const mockUser = {
  ...mockStateUserStore,
};

jest.mock("utils/state/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const timeoutSpy = jest.spyOn(global, "setTimeout");
const logoutSpy = jest.spyOn(mockLogout, "logout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    mockedUseUser.mockReturnValue(mockUser);
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    logoutSpy.mockClear();
    timeoutSpy.mockClear();
  });

  test("Timeout modal is visible", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    await waitFor(() => {
      expect(screen.getByTestId("modal-refresh-button")).toBeVisible();
      expect(screen.getByTestId("modal-logout-button")).toBeVisible();
    });
  });

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const refreshButton = screen.getByTestId("modal-refresh-button");
    await act(async () => {
      await fireEvent.click(refreshButton);
    });
    await waitFor(() => {
      expect(screen.getByTestId("modal-refresh-button")).not.toBeVisible();
      expect(screen.getByTestId("modal-logout-button")).not.toBeVisible();
    });
  });

  test("Timeout modal logout button is clickable and triggers logout", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const logoutButton = screen.getByTestId("modal-logout-button");
    mockLogout.mockReset();
    await act(async () => {
      await fireEvent.click(logoutButton);
    });
    expect(mockUserContext.logout()).toHaveBeenCalledTimes(1);
  });
  test("Timeout modal executes logout on timeout", async () => {
    mockLogout.mockReset();

    await act(async () => {
      jest.advanceTimersByTime(10 * IDLE_WINDOW);
    });
    expect(mockUserContext.logout()).toHaveBeenCalledTimes(1);
  });
});

describe("Test Timeout Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    initAuthManager();
    mockedUseUser.mockReturnValue(mockUser);
    const { container } = render(timeoutComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
