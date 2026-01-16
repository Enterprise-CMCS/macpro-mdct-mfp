import { ResponsiveDashboardTable } from "./ResponsiveDashboardTable";
import { useBreakpoint } from "utils";
import { render } from "@testing-library/react";
import { DashboardTable } from "./DashboardTable";
import { mockReportsByState } from "utils/testing/mockReport";
import { MobileDashboardTable } from "./MobileDashboardTable";
import { ReportType } from "types";

jest.mock("./DashboardTable", () => ({
  DashboardTable: jest.fn(() => <></>),
}));

jest.mock("./MobileDashboardTable", () => ({
  MobileDashboardTable: jest.fn(() => <></>),
}));

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(),
}));

const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

const defaultProps = {
  reportsByState: mockReportsByState,
  reportType: ReportType.WP,
  reportId: "r1",
  body: { table: {} },
  openCreateReportModal: jest.fn(),
  enterSelectedReport: jest.fn(),
  archive: jest.fn(),
  entering: false,
  releaseReport: jest.fn(),
  releasing: false,
  isStateLevelUser: true,
  isAdmin: false,
  sxOverride: {},
};

describe("<ResponsiveDashboardTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
