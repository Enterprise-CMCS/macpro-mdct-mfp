import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// utils
import {
  RouterWrappedComponent,
  mockStateUserStore,
  mockNoUserStore,
} from "utils/testing/setupJest";
import { useUserStore, UserProvider } from "utils";
//components
import { App } from "components";

jest.mock("utils/state/useUserStore");
const mockedUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;

const appComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <App />
    </UserProvider>
  </RouterWrappedComponent>
);

describe("Test App", () => {
  test("App is visible", async () => {
    mockedUseUserStore.mockReturnValue(mockStateUserStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseUserStore.mockReturnValue(mockNoUserStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("login-container")).toBeVisible();
  });
});

describe("App login page accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(appComponent);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
