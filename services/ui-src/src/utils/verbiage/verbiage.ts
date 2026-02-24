// types
import { AnyObject, ReportType } from "types";
// alerts verbiage
import wpAlertsVerbiage from "verbiage/pages/wp/wp-alerts";
import sarAlertsVerbiage from "verbiage/pages/sar/sar-alerts";
// dashboard verbiage
import wpDashboardVerbiage from "verbiage/pages/wp/wp-dashboard";
import sarDashboardVerbiage from "verbiage/pages/sar/sar-dashboard";
import expenditureDashboardVerbiage from "verbiage/pages/expenditure/expenditure-dashboard";
// export verbiage
import wpExportVerbiage from "verbiage/pages/wp/wp-export";
import sarExportVerbiage from "verbiage/pages/sar/sar-export";
import expenditureExportVerbiage from "verbiage/pages/expenditure/expenditure-export";
// review and submit verbiage
import wpReviewAndSubmitVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import sarReviewAndSubmitVerbiage from "verbiage/pages/sar/sar-review-and-submit";
import expenditureReviewAndSubmitVerbiage from "verbiage/pages/expenditure/expenditure-review-and-submit";

const wpVerbiage = {
  alertsVerbiage: wpAlertsVerbiage,
  dashboardVerbiage: wpDashboardVerbiage,
  exportVerbiage: wpExportVerbiage,
  reviewAndSubmitVerbiage: wpReviewAndSubmitVerbiage,
};

const sarVerbiage = {
  alertsVerbiage: sarAlertsVerbiage,
  dashboardVerbiage: sarDashboardVerbiage,
  exportVerbiage: sarExportVerbiage,
  reviewAndSubmitVerbiage: sarReviewAndSubmitVerbiage,
};

const expenditureVerbiage = {
  dashboardVerbiage: expenditureDashboardVerbiage,
  exportVerbiage: expenditureExportVerbiage,
  reviewAndSubmitVerbiage: expenditureReviewAndSubmitVerbiage,
};

export const getReportVerbiage = (reportType?: string): AnyObject => {
  const reportTypeSelector =
    reportType ?? localStorage.getItem("selectedReportType");
  switch (reportTypeSelector) {
    case ReportType.SAR:
      return sarVerbiage;
    case ReportType.EXPENDITURE:
      return expenditureVerbiage;
    case ReportType.WP:
    default:
      return wpVerbiage;
  }
};
