// types
import { ReportJsonFile, ReportType } from "../../../../../utils/types";
// routes
import { administrativeCostsRoute } from "./administrative-costs";
import { demonstrationServicesRoute } from "./demonstration-services";
import { fmapPercentagesRoute } from "./fmap-percentages";
import { generalInformationRoute } from "./general-information";
import { qualifiedHcbsRoute } from "./qualified-hcbs";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { supplementalServicesRoute } from "./supplemental-services";
import { totalsSummaryRoute } from "./totals-summary";

// Use with LaunchDarkly flag: abcdReport
export const financialReportJson: ReportJsonFile = {
  type: ReportType.FINANCIAL_REPORT,
  name: "MFP Financial Reporting Form",
  basePath: "/financial-report",
  version: "FINANCIAL-REPORT_2025-07-10",
  entities: {
    "": { required: true },
  },
  routes: [
    generalInformationRoute,
    fmapPercentagesRoute,
    qualifiedHcbsRoute,
    demonstrationServicesRoute,
    supplementalServicesRoute,
    administrativeCostsRoute,
    totalsSummaryRoute,
    reviewAndSubmitRoute,
  ],
};
