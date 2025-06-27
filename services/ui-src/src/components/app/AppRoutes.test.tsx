import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// components
import { AppRoutes, ReportContext } from "components";
// utils
import { useStore, UserProvider } from "utils";
import {
  mockStateUserStore,
  mockBannerStore,
  mockReportStore,
  mockWpReportContext,
} from "utils/testing/setupJest";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockBannerStore,
  ...mockReportStore,
});

const appRoutesComponent = (route: string, isReportPage: boolean = false) => (
  <ReportContext.Provider
    value={{
      ...mockWpReportContext,
      isReportPage,
    }}
  >
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </MemoryRouter>
  </ReportContext.Provider>
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

  describe("Test AppRoutes box container", () => {
    test("container should be main element for non-report page", () => {
      render(appRoutesComponent("/wp/export"));
      expect(screen.getByTestId("main-content").tagName).toBe("MAIN");
      expect(screen.getByRole("main").id).toBe("main-content");
    });

    test("container should be div element for report page", () => {
      render(appRoutesComponent("/mock/mock-route-1", true));
      expect(screen.getByTestId("main-content").tagName).toBe("DIV");
      expect(screen.getByRole("main").id).toBe("report-content");
    });
  });
});
