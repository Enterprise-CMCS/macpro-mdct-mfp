import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfMfpTransitionsQualifiedResidencesRoute: FormRoute = {
  name: "Number of MFP transitions to qualified residences in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions-to-qualified-residences",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP transitions to qualified residences in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            'Of the total transitions reported in "Number of MFP transitions", provide the number of transitions to each qualified residence type during the reporting period.',
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-mtfqr",
    fields: [
      {
        id: "ret-mtfqr-header-1",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Home (owned or leased by individual or family)",
        },
      },
      {
        id: "ret-mtfqr-1-populations",
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
        id: "ret-mtfqr-header-2",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Apartment (individual lease, lockable access, etc.)",
        },
      },
      {
        id: "ret-mtfqr-2-populations",
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
        id: "ret-mtfqr-header-3",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content:
            "Group home or other residence in which four or fewer unrelated individuals live",
        },
      },
      {
        id: "ret-mtfqr-3-populations",
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
        id: "ret-mtfqr-header-4",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Apartment in qualified assisted living",
        },
      },
      {
        id: "ret-mtfqr-4-populations",
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
