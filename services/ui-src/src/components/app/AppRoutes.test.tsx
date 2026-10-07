import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useFlags } from "launchdarkly-react-client-sdk";
import { MockedFunction } from "vitest";
// components
import { AppRoutes, ReportContext } from "components";
// utils
import { useStore, UserProvider } from "utils";
import {
  mockStateUserStore,
  mockBannerStore,
  mockReportStore,
  mockWpReportContext,
} from "utils/testing/setupTest";

vi.mock("launchdarkly-react-client-sdk");
const mockFlags = vi.mocked(useFlags);
mockFlags.mockReturnValue({
  abcdReport: true,
});

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
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
    <MemoryRouter initialEntries={[route]}>
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

  describe("Test Financial Report route behind flag", () => {
    test("renders /financial-report route when abcdReport flag is true", () => {
      mockFlags.mockReturnValue({
        abcdReport: true,
      });

      render(appRoutesComponent("/financial-report"));

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toContain("MFP Financial Reporting Form");
    });

    test("does not render /financial-report route when abcdReport flag is false", () => {
      mockFlags.mockReturnValue({
        abcdReport: false,
      });

      render(appRoutesComponent("/financial-report"));

      // Should not find the dashboard for Financial report
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toContain("Page not found");
    });
  });
});
