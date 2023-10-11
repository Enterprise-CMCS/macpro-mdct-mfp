import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import { mockStateUser } from "utils/testing/mockUsers";
import {
  mockDashboardReportContext,
  mockReportContextNoReports,
} from "utils/testing/mockReport";
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore, makeMediaQueryClasses } from "utils";
import { useUser } from "utils/auth/useUser";
import { ReportType } from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";
import sarVerbiage from "verbiage/pages/sar/sar-dashboard";

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

const wpDashboardWithNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
      <DashboardPage reportType={ReportType.WP} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const wpDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType={ReportType.WP} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const sarDashboardWithNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
      <DashboardPage reportType={ReportType.SAR} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const sarDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType={ReportType.SAR} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Report Dashboard with no reports", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockedUseStore.mockReturnValue({
      reportsByState: undefined,
    });
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("WP Dashboard renders table with empty text", async () => {
    await act(async () => {
      await render(wpDashboardWithNoReports);
    });
    expect(screen.getByText(wpVerbiage.body.empty)).toBeVisible();
  });

  test("SAR Dashboard renders table with empty text", async () => {
    await act(async () => {
      await render(sarDashboardWithNoReports);
    });
    expect(screen.getByText(sarVerbiage.body.empty)).toBeVisible();
  });
});

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
      await render(wpDashboardViewWithReports);
    });
    expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
    expect(
      screen.queryByText(wpVerbiage.body.table.caption)
    ).toBeInTheDocument();
    expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
    expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
  });

  /* SAR Tests */
  test("Check that the SAR Dashboard view renders", async () => {
    await act(async () => {
      await render(sarDashboardViewWithReports);
    });
    expect(screen.getByText(sarVerbiage.intro.header)).toBeVisible();
    expect(
      screen.queryByText(sarVerbiage.body.table.caption)
    ).toBeInTheDocument();
    expect(screen.queryByText(sarVerbiage.body.empty)).not.toBeInTheDocument();
    expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
  });
});

describe("Test Report Dashboard view (with reports, mobile view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockedUseStore.mockReturnValue(mockReportStore);
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("WP Dashboard view renders", async () => {
    await act(async () => {
      await render(wpDashboardViewWithReports);
    });
    expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
    expect(screen.getAllByTestId("mobile-row")[0]).toBeVisible();
    expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
  });

  test("SAR Dashboard view renders", async () => {
    await act(async () => {
      await render(sarDashboardViewWithReports);
    });
    expect(screen.getByText(sarVerbiage.intro.header)).toBeVisible();
    expect(screen.getAllByTestId("mobile-row")[0]).toBeVisible();
    expect(screen.queryByText(sarVerbiage.body.empty)).not.toBeInTheDocument();
  });
});
