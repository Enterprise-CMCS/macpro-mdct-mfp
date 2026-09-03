import { act, render, screen } from "@testing-library/react";
import { MockedFunction } from "vitest";
// utils
import {
  RouterWrappedComponent,
  mockNoUserStore,
  mockUseStore,
} from "utils/testing/setupTest";
import { useStore, UserProvider } from "utils";
//components
import { App } from "components";
import { testA11yAct } from "utils/testing/commonTests";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const appComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <App />
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<App />", () => {
  test("App is visible", async () => {
    // mockedUseStore.mockReturnValue(mockUseStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("app-container")).toBeVisible();
  });

  test("App renders local logins if there is no user", async () => {
    mockedUseStore.mockReturnValue(mockNoUserStore);
    await act(async () => {
      await render(appComponent);
    });
    expect(screen.getByTestId("login-container")).toBeVisible();
  });

  testA11yAct(appComponent);
});
