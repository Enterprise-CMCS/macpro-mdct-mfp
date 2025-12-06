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
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Number of people who were disenrolled from the MFP program at any point (during this reporting period or a prior period) and re-enrolled during this reporting period.",
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
