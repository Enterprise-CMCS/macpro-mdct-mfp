// types
import { ReportJsonFile, ReportType } from "../../../utils/types";

export const expenditureReportJson: ReportJsonFile = {
  type: ReportType.EXPENDITURE,
  name: "MFP Financial Reporting Form",
  basePath: "/expenditure",
  version: "EXPENDITURE_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [],
};
