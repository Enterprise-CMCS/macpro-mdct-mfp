import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import { mockStateUser } from "utils/testing/mockUsers";
import { mockDashboardReportContext } from "utils/testing/mockReport";
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore, makeMediaQueryClasses } from "utils";
import { useUser } from "utils/auth/useUser";
import { ReportType } from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/wp",
  })),
}));

const dashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType={ReportType.WP} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Report Dashboard view (with reports, desktop view)", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockReportStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Check that WP Dashboard view renders", async () => {
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
    expect(
      screen.queryByText(wpVerbiage.body.table.caption)
    ).toBeInTheDocument();
    expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
    expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
  });
});
