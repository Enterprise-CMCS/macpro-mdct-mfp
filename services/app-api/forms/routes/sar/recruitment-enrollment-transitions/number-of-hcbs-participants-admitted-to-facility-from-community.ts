import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const numberOfHcbsParticipantsAdmittedToFacilityFromCommunityRoute: FormRoute =
  {
    name: "Number of HCBS participants admitted to a facility from the community, by length of stay and age group",
    path: "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community",
    pageType: PageTypes.STANDARD,
    conditionallyRender: "showOnlyInPeriod2",
    verbiage: {
      intro: {
        section: "Recruitment, Enrollment, and Transitions",
        subsection:
          "Number of HCBS participants (including MFP participants) admitted to a facility from the community, by length of stay and age group",
        info: [
          {
            type: ReportFormFieldType.TEXT,
            content:
              "In this section, provide information for the specified period.",
          },
          {
            type: ReportFormFieldType.TEXT,
            content:
              "Inpatient facilities include hospitals, nursing homes, ICF/IID, or IMD. Provide data for readmissions occurring between July 31 of the current reporting period and August 1 of the prior year.",
          },
        ],
      },
      reviewPdfHint:
        'To view totals, click "Review PDF" and it will open a summary in a new tab.',
    },
    form: {
      id: "ret-hcbs",
      optional: true,
      fields: [
        {
          id: "ret_sectionHeader_shortTermStay",
          type: ReportFormFieldType.SECTION_HEADER,
          props: {
            content: "Short-term stay: 1 to 20 days",
          },
        },
        {
          id: "ret_shortTermStayAges18to64",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 18-64",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_shortTermStayAges65to74",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 65-74",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_shortTermStayAges75to84",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 75-84",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_shortTermStayAges85AndOlder",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 85 and older",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_sectionHeader_mediumTermStay",
          type: ReportFormFieldType.SECTION_HEADER,
          props: {
            content: "Medium-term stay: 21-100 days",
          },
        },
        {
          id: "ret_mediumTermStayAges18to64",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 18-64",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_mediumTermStayAges65to74",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 65-74",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_mediumTermStayAges75to84",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 75-84",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_mediumTermStayAges85AndOlder",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 85 and older",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_sectionHeader_longTermStay",
          type: ReportFormFieldType.SECTION_HEADER,
          props: {
            content: "Long-term stay: 101 days or more",
          },
        },
        {
          id: "ret_longTermStayAges18to64",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 18-64",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_longTermStayAges65to74",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 65-74",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_longTermStayAges75to84",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 75-84",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
        {
          id: "ret_longTermStayAges85AndOlder",
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.VALID_INTEGER_OPTIONAL,
          props: {
            label: "Ages 85 and older",
            styleAsOptional: true,
            decimalPlacesToRoundTo: 0,
          },
        },
      ],
    },
  };
