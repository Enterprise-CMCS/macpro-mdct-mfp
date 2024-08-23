import { render, screen } from "@testing-library/react";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import { mockStateUser } from "utils/testing/mockUsers";
import {
  mockDashboardReportContext,
  mockReportContextNoReports,
  mockWpReportContext,
  mockWPFullReport,
  mockWPCopiedReport,
  mockWPApprovedFullReport,
} from "utils/testing/mockReport";
import {
  mockReportStore,
  mockUseAdminStore,
  mockUseEmptyReportStore,
  mockUseEntityStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

import { useBreakpoint, useStore, makeMediaQueryClasses } from "utils";
import { useUser } from "utils/auth/useUser";
import { MfpReportState, ReportShape, ReportType } from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";
import sarVerbiage from "verbiage/pages/sar/sar-dashboard";
import userEvent from "@testing-library/user-event";
import { testA11y } from "utils/testing/commonTests";

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
    pathname: "/mock-dashboard",
  })),
}));

const wpDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType={ReportType.WP} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const wpDashboardWithNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
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

describe("<DashboardPage />", () => {
  describe("Test Report Dashboard view (Desktop)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseUser.mockReturnValue(mockStateUser);
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    test("Check that WP Dashboard view renders", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(wpDashboardViewWithReports);
      expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
      expect(
        screen.queryByText(wpVerbiage.body.table.caption)
      ).toBeInTheDocument();
      expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
      expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
    });

    test("Check that WP Dashboard continue button is disabled if latest WP is not approved", () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(wpDashboardViewWithReports);
      const reportByRows = screen.getAllByRole("row");
      expect(reportByRows[1].querySelectorAll("td")[5]).not.toHaveTextContent(
        "Approved"
      );
      const callToActionButton = screen.getByText(
        wpVerbiage.body.callToActionAdditions
      );
      expect(callToActionButton).toBeDisabled();
    });

    test("Show copied from verbiage on report versions 2 or higher", () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(wpDashboardViewWithReports);
      const subText = screen.getByText("copied from 2023 - Period 1");
      expect(subText).toBeInTheDocument();
    });

    test("Check that you can enter a WP", async () => {
      mockedUseStore.mockReturnValue(mockUseEntityStore);
      render(wpDashboardViewWithReports);
      const editButtons = screen.getAllByText("Edit");
      await userEvent.click(editButtons[0]);
    });

    test("Clicking Call To Action text open add/edit modal", async () => {
      mockedUseStore.mockReturnValue(mockUseEmptyReportStore);
      render(wpDashboardWithNoReports);
      const callToActionButton = screen.getByText(wpVerbiage.body.callToAction);
      expect(callToActionButton).toBeVisible();
      await userEvent.click(callToActionButton);
      expect(screen.queryByText("Start new")).toBeVisible();
    });

    test("Check that the SAR Dashboard view renders", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(sarDashboardViewWithReports);
      expect(screen.getByText(sarVerbiage.intro.header)).toBeVisible();
      expect(
        screen.queryByText(sarVerbiage.body.table.caption)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(sarVerbiage.body.empty)
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
    });
  });

  describe("Test Report Dashboard with no reports", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseUser.mockReturnValue(mockStateUser);
      mockedUseStore.mockReturnValue({
        reportsByState: undefined,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    test("WP Dashboard renders table with empty text", () => {
      mockedUseStore.mockReturnValue(mockStateUser);
      render(wpDashboardWithNoReports);
      expect(screen.getByText(wpVerbiage.body.empty)).toBeVisible();
    });

    test("SAR Dashboard renders table with empty text", () => {
      mockedUseStore.mockReturnValue(mockStateUser);
      render(sarDashboardWithNoReports);
      expect(screen.getByText(sarVerbiage.body.empty)).toBeVisible();
    });
  });

  describe("Test Report Dashboard (Mobile)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockedUseStore.mockReturnValue(mockUseEmptyReportStore);
      render(wpDashboardWithNoReports);
    });

    test("Clicking Call To Action text open add/edit modal", async () => {
      const callToActionButton = screen.getByText(wpVerbiage.body.callToAction);
      expect(callToActionButton).toBeVisible();
      await userEvent.click(callToActionButton);
      expect(screen.queryByText("Start new")).toBeVisible();
    });
  });

  describe("Test WP Admin Report Dashboard - desktop", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      mockedUseStore.mockReturnValue(mockUseAdminStore);
      render(wpDashboardViewWithReports);
    });

    test("Check that Admin WP Dashboard view renders", () => {
      expect(screen.getByText(wpVerbiage.intro.header)).toBeVisible();
      expect(
        screen.queryByText(wpVerbiage.body.table.caption)
      ).toBeInTheDocument();
      expect(screen.queryByText(wpVerbiage.body.empty)).not.toBeInTheDocument();
    });

    test("Clicking 'Unlock' button opens the unlock modal", async () => {
      const unlockButton = screen.getAllByText("Unlock")[3];
      expect(unlockButton).toBeEnabled();
      await userEvent.click(unlockButton);
      await expect(mockWpReportContext.releaseReport).toHaveBeenCalledTimes(1);
      // once for render, once for release
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });

    test("Clicking a disabled 'Unlock' button no modal opens", async () => {
      const unlockButton = screen.getAllByText("Unlock")[0];
      expect(unlockButton).toBeVisible();
      await userEvent.click(unlockButton);

      expect(
        screen.queryByText(wpVerbiage.modalUnlock.actionButtonText)
      ).not.toBeInTheDocument();
    });

    test("Clicking 'Archive' button will open the archive modal", async () => {
      const archiveButton = screen.getAllByText("Archive")[0];
      expect(archiveButton).toBeVisible();
      await userEvent.click(archiveButton);
      await expect(
        screen.getByText(wpVerbiage.modalArchive.heading)
      ).toBeVisible();
    });

    test("Cannot unarchive a WP", async () => {
      const archivedText = screen.getAllByText("Archived")[1];
      expect(archivedText).toBeInTheDocument();
    });

    testA11y(wpDashboardViewWithReports, () => {
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });
  });

  describe("Test WP Admin Report Dashboard - mobile view", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockedUseStore.mockReturnValue(mockUseAdminStore);
      render(wpDashboardViewWithReports);
    });
    test("Clicking 'Unlock' button opens the unlock modal", async () => {
      const unlockButton = screen.getAllByText("Unlock")[3];
      expect(unlockButton).toBeVisible();
      await userEvent.click(unlockButton);
      await expect(mockWpReportContext.releaseReport).toHaveBeenCalledTimes(1);
      // once for render, once for release
      await expect(
        mockWpReportContext.fetchReportsByState
      ).toHaveBeenCalledTimes(2);
    });

    test("Clicking 'Archive' button will open the archive modal", async () => {
      const archiveButton = screen.getAllByText("Archive")[1];
      expect(archiveButton).toBeVisible();
      await userEvent.click(archiveButton);
      expect(screen.getByText(wpVerbiage.modalArchive.heading)).toBeVisible();
    });

    test("Cannot unarchive a WP", async () => {
      const archivedText = screen.getAllByText("Archived")[1];
      expect(archivedText).toBeInTheDocument();
    });

    testA11y(wpDashboardViewWithReports, () => {
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
    });
  });

  describe("Test error banner on SAR dashboard", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseUser.mockReturnValue(mockStateUser);
      mockedUseStore.mockReturnValue({
        reportsByState: undefined,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });
    test("Check that error banner is enabled in SAR when latest WP IS NOT approved", () => {
      mockedUseStore.mockReturnValue(mockReportStore);
      render(sarDashboardWithNoReports);
      const errorBannerText = screen.queryByText(
        "You must have an approved MFP Work Plan not previously used in a MFP Semi-Annual Progress Report (SAR) in order to add a new MFP SAR"
      );
      expect(errorBannerText).toBeInTheDocument();
    });

    test("Check that error banner is disabled in SAR when latest WP IS approved", () => {
      const wpToCopyFromMockStore: MfpReportState = {
        report: mockWPFullReport as ReportShape,
        reportsByState: [mockWPCopiedReport, mockWPApprovedFullReport],
        submittedReportsByState: [mockWPFullReport],
        lastSavedTime: "1:58 PM",
        workPlanToCopyFrom: mockWPFullReport,
        autosaveState: false,
        editable: true,
        setReport: () => {},
        setReportsByState: () => {},
        clearReportsByState: () => {},
        setSubmittedReportsByState: () => {},
        setLastSavedTime: () => {},
        setWorkPlanToCopyFrom: () => {},
        setAutosaveState: () => {},
        setEditable: () => {},
      };

      mockedUseStore.mockReturnValue(wpToCopyFromMockStore);
      render(sarDashboardViewWithReports);
      const errorBannerText = screen.queryByText(
        "You must have an approved MFP Work Plan not previously used in a MFP Semi-Annual Progress Report (SAR) in order to add a new MFP SAR"
      );
      expect(errorBannerText).not.toBeInTheDocument();
    });
  });
});
