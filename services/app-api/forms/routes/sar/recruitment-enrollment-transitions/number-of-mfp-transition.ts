import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfMfpTransitionsRoute: FormRoute = {
  name: "Number of MFP transitions in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection: "Number of MFP transitions in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Number of qualified institutional residents who enrolled in MFP and were discharged from an institution to a qualified residence during the reporting period in the quarter.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals and transition targets from your associated MFP Work Plan, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-mtrp",
    fields: [
      {
        id: "ret_mtrp_quarter_header_1",
        type: ReportFormFieldType.SECTION_HEADER,
        transformation: {
          rule: TransformationRule.FIRST_QUARTER_OF_THE_PERIOD,
        },
      },
      {
        id: "ret_mtrp_quarter_1_populations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.VALID_INTEGER,
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: TransformationRule.TARGET_POPULATIONS,
        },
      },
      {
        id: "ret_mtrp_quarter_header_2",
        type: ReportFormFieldType.SECTION_HEADER,
        transformation: {
          rule: TransformationRule.SECOND_QUARTER_OF_THE_PERIOD,
        },
      },
      {
        id: "ret_mtrp_quarter_2_populations",
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
