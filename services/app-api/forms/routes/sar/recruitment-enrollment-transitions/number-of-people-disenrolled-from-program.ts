import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfPeopleDisenrolledFromProgramRoute: FormRoute = {
  name: "Number of MFP participants disenrolled from the program during the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-disenrolled-from-program",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP participants disenrolled from the program during the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Provide the number of MFP participants for each target population (if applicable for this reporting period), by reason for disenrollment. If more than one reason applies to an individual’s disenrollment, include the individual in the total for one reason only. Include the individual under the primary reason or, if indeterminate, the first reason listed. Enter the number of participants disenrolled for the selected “other” cause in the new fields. An additional “other” reason may be specified, if one or more participants disenrolled for reasons other than those listed.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-mpdprp",
    fields: [
      {
        id: "ret-mpdprp-header-1",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Re-institutionalization",
        },
      },
      {
        id: "ret-mpdprp-1-populations",
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
        id: "ret-mpdprp-header-2",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Death",
        },
      },
      {
        id: "ret-mpdprp-2-populations",
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
        id: "ret-mpdprp-header-3",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Voluntary disenrollment",
        },
      },
      {
        id: "ret-mpdprp-3-populations",
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
        id: "ret-mpdprp-header-4",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          content: "Other",
        },
      },
      {
        id: "ret_otherReasons",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX_OPTIONAL,
        props: {
          label: "Other reasons",
          hint: "Check all that apply.",
          choices: [
            {
              id: "2VffASWS2XRfAlc3uLzxCVAC",
              label: "Moved out of MFP jurisdiction/state/territory",
              children: [
                {
                  id: "ret-movedout-populations",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.VALID_INTEGER,
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VffASWS2XRfAlc3uLzxCVAC",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: TransformationRule.TARGET_POPULATIONS,
                  },
                },
              ],
            },
            {
              id: "2VfqAGi1lgxX3uXc98cl6q4u",
              label: "Incarceration",
              children: [
                {
                  id: "ret-incarceration-populations",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.VALID_INTEGER,
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VfqAGi1lgxX3uXc98cl6q4u",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: TransformationRule.TARGET_POPULATIONS,
                  },
                },
              ],
            },
            {
              id: "2VfqSwWMAr9xOE2zOhpLHtYQ",
              label: "Move to an unqualified setting",
              children: [
                {
                  id: "ret-moved-populations",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.VALID_INTEGER,
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VfqSwWMAr9xOE2zOhpLHtYQ",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: TransformationRule.TARGET_POPULATIONS,
                  },
                },
              ],
            },
            {
              id: "2Vfqd9gpWs2J3Wef5CAuqGx9",
              label: "Other, specify",
              children: [
                {
                  id: "otherReasons-otherText",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2Vfqd9gpWs2J3Wef5CAuqGx9",
                  },
                },
                {
                  id: "ret-other-specify-populations",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.VALID_INTEGER,
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2Vfqd9gpWs2J3Wef5CAuqGx9",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: TransformationRule.TARGET_POPULATIONS,
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
