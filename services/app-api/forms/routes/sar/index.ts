// types
import { ReportJsonFile, ReportType } from "../../../utils/types";
// routes
import { additionalAchievementsRoute } from "./additional-achievements";
import { generalInformationRoute } from "./general-information";
import { organizationAndAdministrationRoute } from "./organization-and-administration";
import { recruitmentEnrollmentAndTransitionsRoute } from "./recruitment-enrollment-transitions";
import { reviewAndSubmitRoute } from "./review-and-submit";
import { stateOrTerritorySpecificInitiativesRoute } from "./state-or-territory-specific-initiatives";

export const sarReportJson: ReportJsonFile = {
  type: ReportType.SAR,
  name: "MFP Semi-Annual Progress Report (SAR)",
  basePath: "/sar",
  version: "SAR_2023-08-21",
  entities: {
    "": { required: true },
  },
  routes: [
    generalInformationRoute,
    recruitmentEnrollmentAndTransitionsRoute,
    stateOrTerritorySpecificInitiativesRoute,
    organizationAndAdministrationRoute,
    additionalAchievementsRoute,
    reviewAndSubmitRoute,
  ],
};
