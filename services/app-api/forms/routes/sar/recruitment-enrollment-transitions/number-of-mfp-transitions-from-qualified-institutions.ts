import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfMfpTransitionsFromQualifiedInstitutionsRoute: FormRoute = {
  name: "Number of MFP transitions from qualified institutions in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions-from-qualified-institutions",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP transitions from qualified institutions in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            'Of the total transitions reported in "Number of MFP transitions", provide the number of transitions from each qualified inpatient facility type during the reporting period.',
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-mtfqi",
    fields: [
      {
        id: "ret-mtfqi-header-1",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Nursing facility",
        },
      },
      {
        id: "ret-mtfqi-1-populations",
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
        id: "ret-mtfqi-header-2",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content:
            "Intermediate care facility for individuals with intellectual disabilities (ICF/IID)",
        },
      },
      {
        id: "ret-mtfqi-2-populations",
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
        id: "ret-mtfqi-header-3",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Institution for mental diseases (IMD)",
        },
      },
      {
        id: "ret-mtfqi-3-populations",
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
        id: "ret-mtfqi-header-4",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Hospital",
        },
      },
      {
        id: "ret-mtfqi-4-populations",
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
        id: "ret-mtfqi-header-5",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Other",
        },
      },
      {
        id: "ret-mtfqi-5-populations",
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
