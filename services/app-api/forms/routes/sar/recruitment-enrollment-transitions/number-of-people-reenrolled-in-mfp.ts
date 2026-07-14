import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfPeopleReenrolledInMfpRoute: FormRoute = {
  name: "Number of people re-enrolled in MFP during the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-reenrolled-in-mfp",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of people re-enrolled in MFP during the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content: "Reenrolled MFP participants may include:",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "1. Individuals who were previously enrolled in the MFP program, had an institutional stay of 30 days or more, complete the step of re-enrollment, and continue to be eligible for 365 days of MFP-covered HCBS during the current reporting period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "2. Former MFP participants who disenrolled prior to the completion of 365 days in the demonstration for any reason. These individuals may re-enroll in MFP without meeting the requirement of 60 consecutive days in an institutional residency, provided they meet any applicable state-or territory-specific requirements for re-enrollment.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "These individuals are eligible to continue to receive MFP services for any remaining days up to the maximum 365 days of demonstration participation. Note that the period for which the individual was institutionalized should not be included in the 365 days of MFP-covered HCBS.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-npremrp",
    fields: [
      {
        id: "ret-npremrp-1-populations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.VALID_INTEGER,
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: TransformationRule.TARGET_POPULATIONS,
        },
      },
    ],
  },
};
