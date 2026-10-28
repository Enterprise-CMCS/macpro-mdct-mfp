import { APP_TITLE } from "../../constants";
import { ReportType } from "types";

export const getPageTitle = (reportType: string, routeName: string) => {
  const reportTitle =
    reportType === ReportType.FINANCIAL_REPORT ? "FRF" : reportType;
  return `${routeName} - ${reportTitle} - ${APP_TITLE}`;
};
