// types
import { ReportJsonFile, ReportType } from "../../../utils/types";

export const financialReportJson: ReportJsonFile = {
  type: ReportType.FINANCIAL_REPORT,
  name: "MFP Financial Reporting Form",
  basePath: "/financial-report",
  version: "FINANCIAL-REPORT_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [],
};
