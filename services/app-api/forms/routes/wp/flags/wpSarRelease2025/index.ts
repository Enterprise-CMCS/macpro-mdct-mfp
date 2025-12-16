// types
import { ReportJsonFile, ReportType } from "../../../../../utils/types";
// routes
import { generalInformationRoute } from "../../general-information";
import { reviewAndSubmitRoute } from "../../review-and-submit";
import { stateOrTerritorySpecificInitiativesRoute } from "./state-or-territory-specific-initiatives";
import { transitionBenchmarkStrategyRoute } from "./transition-benchmark-strategy";
import { transitionBenchmarksRoute } from "../../transition-benchmarks";

// Use with LaunchDarkly flag: wpSarRelease2025
export const wpReportJson: ReportJsonFile = {
  type: ReportType.WP,
  name: "MFP Work Plan",
  basePath: "/wp",
  version: "WP_2023-08-21",
  entities: {
    targetPopulation: { required: true },
    initiative: { required: true },
  },
  routes: [
    generalInformationRoute,
    transitionBenchmarksRoute,
    transitionBenchmarkStrategyRoute,
    stateOrTerritorySpecificInitiativesRoute,
    reviewAndSubmitRoute,
  ],
};
