import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  TransformationRule,
  ValidationType,
} from "../../../../utils/types";

export const numberOfPeopleSignedInformedConsentFormRoute: FormRoute = {
  name: "Number of people who signed an MFP informed consent form in the reporting period",
  path: "/sar/recruitment-enrollment-transitions/number-of-people-signed-informed-consent-form",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Recruitment, Enrollment, and Transitions",
      subsection:
        "Number of people who signed an MFP informed consent form in the reporting period",
      info: [
        {
          type: ReportFormFieldType.TEXT,
          content:
            "In this section, provide information for the specified period.",
        },
        {
          type: ReportFormFieldType.TEXT,
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
