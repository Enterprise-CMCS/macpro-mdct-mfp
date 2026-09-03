import { MockedFunction } from "vitest";
import { ResponsiveDashboardTable } from "./ResponsiveDashboardTable";
import { useBreakpoint } from "utils";
import { render } from "@testing-library/react";
import { DashboardTable } from "./DashboardTable";
import { mockReportsByState } from "utils/testing/mockReport";
import { MobileDashboardTable } from "./MobileDashboardTable";
import { ReportType } from "types";

vi.mock("./DashboardTable", () => ({
  DashboardTable: vi.fn(() => <></>),
}));

vi.mock("./MobileDashboardTable", () => ({
  MobileDashboardTable: vi.fn(() => <></>),
}));

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(),
}));

const mockUseBreakpoint = useBreakpoint as MockedFunction<typeof useBreakpoint>;

const defaultProps = {
  reportsByState: mockReportsByState,
  reportType: ReportType.WP,
  reportId: "r1",
  body: { table: {} },
  openCreateReportModal: vi.fn(),
  enterSelectedReport: vi.fn(),
  archive: vi.fn(),
  entering: false,
  releaseReport: vi.fn(),
  releasing: false,
  isStateLevelUser: true,
  isAdmin: false,
  sxOverride: {},
};

describe("<ResponsiveDashboardTable />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders DashboardTable for desktop", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: false });

    render(<ResponsiveDashboardTable {...defaultProps} />);

    expect(DashboardTable).toHaveBeenCalledTimes(1);
  });

  test("renders MobileDashboardTable for tablet", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: true });

    render(<ResponsiveDashboardTable {...defaultProps} />);

    expect(MobileDashboardTable).toHaveBeenCalledTimes(1);
  });

  test("renders MobileDashboardTable for mobile", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: true, isTablet: false });

    render(<ResponsiveDashboardTable {...defaultProps} />);

    expect(MobileDashboardTable).toHaveBeenCalledTimes(1);
  });
});
