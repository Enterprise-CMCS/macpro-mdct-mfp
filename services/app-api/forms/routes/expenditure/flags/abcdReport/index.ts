// types
import { ReportJsonFile, ReportType } from "../../../../../utils/types";
// routes
import { generalInformationRoute } from "./general-information";
import { reviewAndSubmitRoute } from "./review-and-submit";

// Use with LaunchDarkly flag: abcdReport
export const expenditureReportJson: ReportJsonFile = {
  type: ReportType.EXPENDITURE,
  name: "MFP Expenditure Report",
  basePath: "/expenditure",
  version: "EXPENDITURE_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [generalInformationRoute, reviewAndSubmitRoute],
};
