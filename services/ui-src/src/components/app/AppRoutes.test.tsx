import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

// components
import { AppRoutes, PostLogoutRedirect } from "components";
// utils
import { useStore, UserProvider } from "utils";
import {
  mockStateUserStore,
  mockLDFlags,
  mockBannerStore,
  mockReportStore,
} from "utils/testing/setupJest";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockReportStore,
});

mockLDFlags.setDefault({ wpReport: true, sarReport: true });

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
      <PostLogoutRedirect />
    </UserProvider>
  </Router>
);

describe("Test AppRoutes", () => {
  test("report routes are generated", async () => {
    const history = createMemoryHistory();
    history.push("/mock/mock-route-1");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
    expect(screen.getByText("mock-report")).toBeVisible();
  });

  test("not-found routes redirect to 404", async () => {
    const history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
    expect(screen.getByTestId("404-view")).toBeVisible();
  });

  test("redirect when hitting postLogout endpoint", async () => {
    const history = createMemoryHistory();
    history.push("/postLogout");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
    expect(screen.getByTestId("404-view")).toBeVisible();
  });
});
