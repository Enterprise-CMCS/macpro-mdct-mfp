import { ParentRoute, ReportRoute } from "../../utils/types";

const informedConsentFormRoute: ReportRoute = {
  name: "Number of people who signed an MFP informed consent form in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-signed-informed-consent-form",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of people who signed an MFP informed consent form in the reporting period",
      subsectionTitle:
        "Number of people who signed an MFP informed consent form in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
          content:
            "Number of institutional residents who have signed an informed consent form indicating their desire to transition to the community and enroll in the state or territory’s MFP program.",
        },
      ],
    },
    reviewPdfHint:
      'To view totals, click "Review PDF" and it will open a summary in a new tab.',
  },
  form: {
    id: "ret-psmicf",
    fields: [
      {
        id: "ret_psmicf_target_populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const numberOfMfpTransitionsRoute: ReportRoute = {
  name: "Number of MFP transitions in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection: "Number of MFP transitions in the reporting period",
      subsectionTitle: "Number of MFP transitions in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "sectionHeader",
        transformation: {
          rule: "firstQuarterOfThePeriod",
        },
      },
      {
        id: "ret_mtrp_quarter_1_populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret_mtrp_quarter_header_2",
        type: "sectionHeader",
        transformation: {
          rule: "secondQuarterOfThePeriod",
        },
      },
      {
        id: "ret_mtrp_quarter_2_populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const qualifiedInstitutionsRoute: ReportRoute = {
  name: "Number of MFP transitions from qualified institutions in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions-from-qualified-institutions",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP transitions from qualified institutions in the reporting period",
      subsectionTitle:
        "Number of MFP transitions from qualified institutions in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "sectionHeader",
        props: {
          content: "Nursing facility",
        },
      },
      {
        id: "ret-mtfqi-1-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqi-header-2",
        type: "sectionHeader",
        props: {
          content:
            "Intermediate care facility for individuals with intellectual disabilities (ICF/IID)",
        },
      },
      {
        id: "ret-mtfqi-2-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqi-header-3",
        type: "sectionHeader",
        props: {
          content: "Institution for mental diseases (IMD)",
        },
      },
      {
        id: "ret-mtfqi-3-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqi-header-4",
        type: "sectionHeader",
        props: {
          content: "Hospital",
        },
      },
      {
        id: "ret-mtfqi-4-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqi-header-5",
        type: "sectionHeader",
        props: {
          content: "Other",
        },
      },
      {
        id: "ret-mtfqi-5-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const qualifiedResidencesRoute: ReportRoute = {
  name: "Number of MFP transitions to qualified residences in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-transitions-to-qualified-residences",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP transitions to qualified residences in the reporting period",
      subsectionTitle:
        "Number of MFP transitions to qualified residences in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "sectionHeader",
        props: {
          content: "Home (owned or leased by individual or family)",
        },
      },
      {
        id: "ret-mtfqr-1-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqr-header-2",
        type: "sectionHeader",
        props: {
          content: "Apartment (individual lease, lockable access, etc.)",
        },
      },
      {
        id: "ret-mtfqr-2-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqr-header-3",
        type: "sectionHeader",
        props: {
          content:
            "Group home or other residence in which four or fewer unrelated individuals live",
        },
      },
      {
        id: "ret-mtfqr-3-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mtfqr-header-4",
        type: "sectionHeader",
        props: {
          content: "Apartment in qualified assisted living",
        },
      },
      {
        id: "ret-mtfqr-4-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const currentMfpParticipantsRoute: ReportRoute = {
  name: "Total number of active MFP participants in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/total-number-of-current-mfp-participants",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Total number of active MFP participants in the reporting period",
      subsectionTitle:
        "Total number of active MFP participants in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const completingProgramRoute: ReportRoute = {
  name: "Number of MFP participants completing the program in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-mfp-participants-completing-program",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP participants completing the program in the reporting period",
      subsectionTitle:
        "Number of MFP participants completing the program in the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const reenrolledInMfpRoute: ReportRoute = {
  name: "Number of people re-enrolled in MFP during the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-reenrolled-in-mfp",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of people re-enrolled in MFP during the reporting period",
      subsectionTitle:
        "Number of people re-enrolled in MFP during the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
    ],
  },
};

const disenrolledFromProgramRoute: ReportRoute = {
  name: "Number of MFP participants disenrolled from the program during the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-disenrolled-from-program",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of MFP participants disenrolled from the program during the reporting period",
      subsectionTitle:
        "Number of MFP participants disenrolled from the program during the {{reportingPeriod}}",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "sectionHeader",
        props: {
          content: "Re-institutionalization",
        },
      },
      {
        id: "ret-mpdprp-1-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mpdprp-header-2",
        type: "sectionHeader",
        props: {
          content: "Death",
        },
      },
      {
        id: "ret-mpdprp-2-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mpdprp-header-3",
        type: "sectionHeader",
        props: {
          content: "Voluntary disenrollment",
        },
      },
      {
        id: "ret-mpdprp-3-populations",
        type: "number",
        validation: "validInteger",
        props: {
          decimalPlacesToRoundTo: 0,
        },
        transformation: {
          rule: "targetPopulations",
        },
      },
      {
        id: "ret-mpdprp-header-4",
        type: "sectionHeader",
        props: {
          content: "Other",
        },
      },
      {
        id: "ret_otherReasons",
        type: "checkbox",
        validation: "checkboxOptional",
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
                  type: "number",
                  validation: {
                    type: "validInteger",
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VffASWS2XRfAlc3uLzxCVAC",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: "targetPopulations",
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
                  type: "number",
                  validation: {
                    type: "validInteger",
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VfqAGi1lgxX3uXc98cl6q4u",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: "targetPopulations",
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
                  type: "number",
                  validation: {
                    type: "validInteger",
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2VfqSwWMAr9xOE2zOhpLHtYQ",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: "targetPopulations",
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
                  type: "text",
                  validation: {
                    type: "text",
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2Vfqd9gpWs2J3Wef5CAuqGx9",
                  },
                },
                {
                  id: "ret-other-specify-populations",
                  type: "number",
                  validation: {
                    type: "validInteger",
                    nested: true,
                    parentFieldName: "ret_otherReasons",
                    parentOptionId: "2Vfqd9gpWs2J3Wef5CAuqGx9",
                  },
                  props: {
                    decimalPlacesToRoundTo: 0,
                  },
                  transformation: {
                    rule: "targetPopulations",
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

const admittedToFacilityFromCommunityRoute: ReportRoute = {
  name: "Number of HCBS participants admitted to a facility from the community, by length of stay and age group",
  path: "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community",
  pageType: "standard",
  conditionallyRender: "showOnlyInPeriod2",
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of HCBS participants (including MFP participants) admitted to a facility from the community, by length of stay and age group",
      info: [
        {
          type: "text",
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: "text",
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
        type: "sectionHeader",
        props: {
          content: "Short-term stay: 1 to 20 days",
        },
      },
      {
        id: "ret_shortTermStayAges18to64",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 18-64",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_shortTermStayAges65to74",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 65-74",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_shortTermStayAges75to84",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 75-84",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_shortTermStayAges85AndOlder",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 85 and older",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_sectionHeader_mediumTermStay",
        type: "sectionHeader",
        props: {
          content: "Medium-term stay: 21-100 days",
        },
      },
      {
        id: "ret_mediumTermStayAges18to64",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 18-64",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_mediumTermStayAges65to74",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 65-74",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_mediumTermStayAges75to84",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 75-84",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_mediumTermStayAges85AndOlder",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 85 and older",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_sectionHeader_longTermStay",
        type: "sectionHeader",
        props: {
          content: "Long-term stay: 101 days or more",
        },
      },
      {
        id: "ret_longTermStayAges18to64",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 18-64",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_longTermStayAges65to74",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 65-74",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_longTermStayAges75to84",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 75-84",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "ret_longTermStayAges85AndOlder",
        type: "number",
        validation: "validIntegerOptional",
        props: {
          label: "Ages 85 and older",
          styleAsOptional: true,
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};

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
    informedConsentFormRoute,
    numberOfMfpTransitionsRoute,
    qualifiedInstitutionsRoute,
    qualifiedResidencesRoute,
    currentMfpParticipantsRoute,
    completingProgramRoute,
    reenrolledInMfpRoute,
    disenrolledFromProgramRoute,
    admittedToFacilityFromCommunityRoute,
  ],
};
