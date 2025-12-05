import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const totalNumberOfCurrentMfpParticipantsRoute: FormRoute = {
  name: "Total number of active MFP participants in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/total-number-of-current-mfp-participants",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Total number of active MFP participants in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Active MFP participants excludes individuals whose enrollment in the MFP Demonstration ended because they completed their 365 days of MFP eligibility, died before they exhausted their 365-day enrollment period, were institutionalized for 30 days or more and did not subsequently re-enroll in the MFP program, or otherwise disenrolled from the program.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-tnamprp",
    fields: [
      {
        id: "ret-tnamprp-1-populations",
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
