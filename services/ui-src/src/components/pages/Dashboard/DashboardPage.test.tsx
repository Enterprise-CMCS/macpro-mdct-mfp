import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import { mockStateUser } from "utils/testing/mockUsers";
import {
  mockDashboardReportContext,
  mockWpReportContext,
} from "utils/testing/mockReport";
import {
  mockReportStore,
  mockUseAdminStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore, makeMediaQueryClasses } from "utils";
import { useUser } from "utils/auth/useUser";
import { ReportType } from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";

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

describe("Test Report Dashboard view (Desktop)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Desktop view (basic)", () => {
    test("Check that WP Dashboard view renders", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(dashboardViewWithReports);

      expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
      expect(
        screen.queryByText(wpVerbiage.body.table.caption)
      ).toBeInTheDocument();
      expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
      expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
    });
  });

  describe("Desktop view with report, state & banner ", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(dashboardViewWithReports);
    });

    test("Clicking Call To Action text open add/edit modal", async () => {
      const callToActionButton = screen.getByText(wpVerbiage.body.callToAction);
      expect(callToActionButton).toBeVisible();
      await userEvent.click(callToActionButton);
      expect(screen.queryByText("Start new")).toBeVisible();
    });
  });
});

describe("Test Report Dashboard (Mobile)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });

    mockedUseStore.mockReturnValue(mockUseStore);
    render(dashboardViewWithReports);
  });

  test("Clicking Call To Action text open add/edit modal", async () => {
    const callToActionButton = screen.getByText(wpVerbiage.body.callToAction);
    expect(callToActionButton).toBeVisible();
    await userEvent.click(callToActionButton);
    expect(screen.queryByText("Start new")).toBeVisible();
  });
});

describe("Test WP Admin Report Dashboard View (with reports, desktop view, mobile view)", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseAdminStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Desktop view", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(dashboardViewWithReports);
    });

    test("Check that Admin WP Dashboard view renders", () => {
      expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
      expect(
        screen.queryByText(wpVerbiage.body.table.caption)
      ).toBeInTheDocument();
      expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
    });

    test("Clicking a disabled 'Unlock' button no modal opens", async () => {
      const unlockButton = screen.getAllByText("Unlock")[0];
      expect(unlockButton).toBeVisible();
      await userEvent.click(unlockButton);

      expect(
        screen.queryByText(wpVerbiage.modalUnlock.actionButtonText)
      ).not.toBeInTheDocument();
    });

    test("Clicking 'Unlock' button opens the unlock modal", async () => {
      const unlockButton = screen.getAllByText("Unlock")[1];
      expect(unlockButton).toBeVisible();
      await userEvent.click(unlockButton);
      await expect(mockWpReportContext.releaseReport).toHaveBeenCalledTimes(1);
      // once for render, once for release
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });

    test("Clicking 'Archive' button will archive the form", async () => {
      const archiveButton = screen.getAllByText("Archive")[1];
      expect(archiveButton).toBeVisible();
      await userEvent.click(archiveButton);
      await expect(mockWpReportContext.archiveReport).toHaveBeenCalledTimes(1);
      // once for render, once for archive
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });
  });

  describe("Mobile view", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      render(dashboardViewWithReports);
    });
    it("Should not have basic accessibility issues (mobile)", async () => {
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
      await act(async () => {
        const { container } = render(dashboardViewWithReports);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    test("Clicking 'Unlock' button opens the unlock modal", async () => {
      const unlockButton = screen.getAllByText("Unlock")[1];
      expect(unlockButton).toBeVisible();
      await userEvent.click(unlockButton);
      await expect(mockWpReportContext.releaseReport).toHaveBeenCalledTimes(1);
      // once for render, once for release
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });

    test("Clicking 'Archive' button will archive the form", async () => {
      const archiveButton = screen.getAllByText("Archive")[1];
      expect(archiveButton).toBeVisible();
      await userEvent.click(archiveButton);
      await expect(mockWpReportContext.archiveReport).toHaveBeenCalledTimes(1);
      // once for render, once for archive
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });
  });
});
