import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfMfpParticipantsCompletingProgramRoute: FormRoute = {
  name: "Number of MFP participants completing the program in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-participants-completing-program",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP participants completing the program in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Number of MFP participants who completed the 365-day enrollment period during the reporting period.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-nmpcprp",
    fields: [
      {
        id: "ret-nmpcprp-1-populations",
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
