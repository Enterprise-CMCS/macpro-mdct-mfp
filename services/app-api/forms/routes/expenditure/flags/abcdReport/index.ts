// types
import { ReportJsonFile, ReportType } from "../../../../../utils/types";
// routes
import { demonstrationServicesRoute } from "./demonstration-services";
import { fmapPercentagesRoute } from "./fmap-percentages";
import { generalInformationRoute } from "./general-information";
import { qualifiedHcbsRoute } from "./qualified-hcbs";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { supplementalServicesRoute } from "./supplemental-services";

// Use with LaunchDarkly flag: abcdReport
export const expenditureReportJson: ReportJsonFile = {
  type: ReportType.EXPENDITURE,
  name: "MFP Expenditure Report",
  basePath: "/expenditure",
  version: "EXPENDITURE_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [
    generalInformationRoute,
    fmapPercentagesRoute,
    qualifiedHcbsRoute,
    demonstrationServicesRoute,
    supplementalServicesRoute,
    reviewAndSubmitRoute,
  ],
};
