// components
import { DashboardTable, MobileDashboardTable } from "components";
// types
import { DashboardTableProps } from "./DashboardTable";
// utils
import { useBreakpoint } from "utils";

export const ResponsiveDashboardTable = (props: DashboardTableProps) => {
  const { isMobile, isTablet } = useBreakpoint();

  return isMobile || isTablet ? (
    <MobileDashboardTable {...props} />
  ) : (
    <DashboardTable {...props} />
  );
};
