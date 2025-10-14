// types
import { ReportJsonFile } from "../../utils/types";
// routes
import { generalInformationRoute } from "./general-information";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { stateOrTerritorySpecificInitiativesRoute } from "./state-or-territory-specific-initiatives";
import { transitionBenchmarkStrategyRoute } from "./transition-benchmark-strategy";
import { transitionBenchmarksRoute } from "./transition-benchmarks";

export const ReportJson: ReportJsonFile = {
  type: "WP",
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
