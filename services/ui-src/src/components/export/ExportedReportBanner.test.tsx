import { render, screen } from "@testing-library/react";
import { ReportContext } from "components";
import userEvent from "@testing-library/user-event";
// components
import { ExportedReportBanner } from "./ExportedReportBanner";
import { useStore } from "../../utils";
import {
  mockBannerStore,
  mockStateUserStore,
  mockUseStore,
} from "../../utils/testing/setupJest";
import { MfpReportState, MfpUserState, ReportShape } from "../../types";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

let mockPrint: any;

const wpContext = {
  report: {
    reportType: "WP",
  },
};

const sarContext = {
  report: {
    reportType: "SAR",
  },
};

const bannerWithContext = (context: any) => {
  return (
    <ReportContext.Provider value={context}>
      <ExportedReportBanner />
    </ReportContext.Provider>
  );
};

describe("<ExportedReportBanner />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);

    mockPrint = window.print;
    jest.spyOn(window, "print").mockImplementation(() => {});
  });

  afterEach(() => {
    window.print = mockPrint;
  });

  test("Is ExportedReportBanner present", async () => {
    render(bannerWithContext(wpContext));
    const banner = screen.getByTestId("exportedReportBanner");
    expect(banner).toBeVisible();
  });

  test("Does WP export banner have WP-specific verbiage", async () => {
    render(bannerWithContext(wpContext));
    const introText = screen.getByText(/MFP/);
    expect(introText).toBeVisible();
  });

  test("Does SAR export banner have SAR-specific verbiage", async () => {
    const mockUseStore: MfpReportState & MfpUserState = {
      report: { reportType: "SAR" } as ReportShape,
      reportsByState: [],
      submittedReportsByState: [],
      lastSavedTime: "1:58 PM",
      workPlanToCopyFrom: undefined,
      autosaveState: false,
      setReport: () => {},
      setReportsByState: () => {},
      clearReportsByState: () => {},
      setSubmittedReportsByState: () => {},
      setLastSavedTime: () => {},
      setWorkPlanToCopyFrom: () => {},
      setAutosaveState: () => {},
      setEditable: () => {},
      ...mockStateUserStore,
      ...mockBannerStore,
    };
    mockedUseStore.mockReturnValue(mockUseStore);

    render(bannerWithContext(sarContext));
    const introText = screen.getByText(/SAR/);
    expect(introText).toBeVisible();
  });

  test("Download PDF button should be visible", async () => {
    render(bannerWithContext(wpContext));
    const printButton = screen.getByText("Download PDF");
    expect(printButton).toBeVisible();
    await userEvent.click(printButton);
  });

  testA11y(bannerWithContext(wpContext), () => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });
});
