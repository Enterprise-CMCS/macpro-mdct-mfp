import { ParentRoute } from "../../../../utils/types";
import { numberOfHcbsParticipantsAdmittedToFacilityFromCommunityRoute } from "./number-of-hcbs-participants-admitted-to-facility-from-community";
import { numberOfMfpParticipantsCompletingProgramRoute } from "./number-of-mfp-participants-completing-program";
import { numberOfMfpTransitionsRoute } from "./number-of-mfp-transition";
import { numberOfMfpTransitionsFromQualifiedInstitutionsRoute } from "./number-of-mfp-transitions-from-qualified-institutions";
import { numberOfMfpTransitionsQualifiedResidencesRoute } from "./number-of-mfp-transitions-to-qualified-residence";
import { numberOfPeopleDisenrolledFromProgramRoute } from "./number-of-people-disenrolled-from-program";
import { numberOfPeopleReenrolledInMfpRoute } from "./number-of-people-reenrolled-in-mfp";
import { numberOfPeopleSignedInformedConsentFormRoute } from "./number-of-people-signed-informed-consent-form";
import { totalNumberOfCurrentMfpParticipantsRoute } from "./total-number-of-current-mfp-participants";

export const recruitmentEnrollmentAndTransitionsRoute: ParentRoute = {
  name: "Recruitment, Enrollment, and Transitions",
  path: "/sar/recruitment-enrollment-transitions",
  verbiage: {
    intro: {
      info: [
        {
          type: "p",
          content:
            "In this section, please provide information for the specified period. Transition targets are populated from your state’s current MFP Work Plan, where applicable. Blue-shaded cells are auto-calculated.",
        },
      ],
    },
  },
  children: [
    numberOfPeopleSignedInformedConsentFormRoute,
    numberOfMfpTransitionsRoute,
    numberOfMfpTransitionsFromQualifiedInstitutionsRoute,
    numberOfMfpTransitionsQualifiedResidencesRoute,
    totalNumberOfCurrentMfpParticipantsRoute,
    numberOfMfpParticipantsCompletingProgramRoute,
    numberOfPeopleReenrolledInMfpRoute,
    numberOfPeopleDisenrolledFromProgramRoute,
    numberOfHcbsParticipantsAdmittedToFacilityFromCommunityRoute,
  ],
};
