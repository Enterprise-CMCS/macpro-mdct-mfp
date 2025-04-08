import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// components
import { AppRoutes } from "components";
// utils
import { useStore, UserProvider } from "utils";
import {
  mockStateUserStore,
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

global.structuredClone = jest.fn((val) => {
  return val ? JSON.parse(JSON.stringify(val)) : val;
});

const appRoutesComponent = (route: string) => (
  <MemoryRouter
    initialEntries={[route]}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </MemoryRouter>
);

describe("<AppRoutes />", () => {
  test("report routes are generated", async () => {
    render(appRoutesComponent("/mock/mock-route-1"));

    expect(screen.getByText("mock-report")).toBeVisible();
  });

  test("not-found routes redirect to 404", async () => {
    render(appRoutesComponent("/obviously-fake-route"));

    expect(screen.getByTestId("404-view")).toBeVisible();
  });

  test("export SAR report page", async () => {
    render(appRoutesComponent("/sar/export"));

    expect(screen.getByTestId("exportedReportMetadataTable")).toBeVisible();
  });

  test("export WP report page", async () => {
    render(appRoutesComponent("/wp/export"));

    expect(screen.getByTestId("exportedReportMetadataTable")).toBeVisible();
  });
});
