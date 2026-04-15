// types
import {
  AlertsVerbiage,
  DashboardPageVerbiage,
  ExportPageVerbiage,
  ReportType,
  ReviewSubmitPageVerbiage,
} from "types";
// alerts verbiage
import wpAlertsVerbiage from "verbiage/pages/wp/wp-alerts";
import sarAlertsVerbiage from "verbiage/pages/sar/sar-alerts";
// dashboard verbiage
import wpDashboardVerbiage from "verbiage/pages/wp/wp-dashboard";
import sarDashboardVerbiage from "verbiage/pages/sar/sar-dashboard";
import financialReportDashboardVerbiage from "verbiage/pages/financial-report/financial-report-dashboard";
// export verbiage
import wpExportVerbiage from "verbiage/pages/wp/wp-export";
import sarExportVerbiage from "verbiage/pages/sar/sar-export";
import financialReportExportVerbiage from "verbiage/pages/financial-report/financial-report-export";
// review and submit verbiage
import wpReviewAndSubmitVerbiage from "verbiage/pages/wp/wp-review-and-submit";
import sarReviewAndSubmitVerbiage from "verbiage/pages/sar/sar-review-and-submit";
import financialReportReviewAndSubmitVerbiage from "verbiage/pages/financial-report/financial-report-review-and-submit";

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

const financialReportVerbiage = {
  alertsVerbiage: {} as AlertsVerbiage,
  dashboardVerbiage: financialReportDashboardVerbiage,
  exportVerbiage: financialReportExportVerbiage,
  reviewAndSubmitVerbiage: financialReportReviewAndSubmitVerbiage,
};

export const getReportVerbiage = (reportType?: string): ReportVerbiage => {
  const reportTypeSelector =
    reportType ?? localStorage.getItem("selectedReportType");
  switch (reportTypeSelector) {
    case ReportType.SAR:
      return sarVerbiage;
    case ReportType.FINANCIAL_REPORT:
      return financialReportVerbiage;
    default:
      return wpVerbiage;
  }
};

interface ReportVerbiage {
  alertsVerbiage: AlertsVerbiage;
  dashboardVerbiage: DashboardPageVerbiage;
  exportVerbiage: ExportPageVerbiage;
  reviewAndSubmitVerbiage: ReviewSubmitPageVerbiage;
}
