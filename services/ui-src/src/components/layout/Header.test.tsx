import { render, screen } from "@testing-library/react";
// utils
import {
  mockReportMethods,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
//components
import { Header, ReportContext } from "components";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const headerComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <Header />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const reportComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <Header />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<Header />", () => {
  describe("Test Header", () => {
    beforeEach(() => {
      render(headerComponent);
    });

    test("Header is visible", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
    });

    test("Logo is visible", () => {
      expect(screen.getByAltText("MFP logo")).toBeVisible();
    });

    test("Help button is visible", () => {
      expect(screen.getByAltText("Help")).toBeVisible();
    });

    test("Menu button is visible", () => {
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });
  });

  describe("Report Context", () => {
    test("Report Data is visible", () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(reportComponent);
      expect(screen.getByText("2023 - Alabama 1")).toBeVisible();
      expect(screen.getByText("Last saved 1:58 PM")).toBeVisible();
    });

    test("Subnav is visible on report screens; navigates to dashboard", async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(reportComponent);
      expect(screen.getByText("Leave form")).toBeVisible();
    });
  });

  testA11y(headerComponent);
});
