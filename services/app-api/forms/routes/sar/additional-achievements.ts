import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const additionalAchievementsRoute: FormRoute = {
  name: "Additional Achievements",
  path: "/sar/additional-achievements",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Additional Achievements",
      info: [
        {
          type: "p",
          content:
            "Use this section to describe any additional achievements or promising practices that have contributed to the effective operation of the demonstration and successful transitions during the reporting period. Achievements or topics discussed in previous sections do not need to be reiterated here. Use the topics below as a guide, but note other important updates.",
        },
        {
          type: "ul",
          props: {
            style: {
              columns: "2",
              "column-gap": "2.5rem",
              paddingLeft: "spacer2",
              color: "#5A5A5A",
              "li::before": {
                color: "#5A5A5A",
              },
            },
          },
          children: [
            {
              type: "li",
              content: "Person-centered planning and services",
            },
            {
              type: "li",
              content: "No Wrong Door systems",
            },
            {
              type: "li",
              content: "Community transition support",
            },
            {
              type: "li",
              content: "Direct service workforce and caregivers",
            },
            {
              type: "li",
              content: "Housing to support community-based living options",
            },
            {
              type: "li",
              content: "Employment support",
            },
            {
              type: "li",
              content: "Convenient and accessible transportation options",
            },
            {
              type: "li",
              content: "Data-based decision-making",
            },
            {
              type: "li",
              content: "Financing approaches",
            },
            {
              type: "li",
              content: "Stakeholder agreement",
            },
            {
              type: "li",
              content: "Quality measurement and improvement",
            },
            {
              type: "li",
              content: "Equity and social determinants of health (SDOH)",
            },
          ],
        },
      ],
    },
  },
  form: {
    id: "aa",
    fields: [
      {
        id: "aa_notableAchievementsPromisingPractices",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "Describe any notable achievements and identify any promising practices by your MFP program that have not been captured elsewhere.",
        },
      },
      {
        id: "aa_changesMfpProgramAdministration",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Indicate whether your state or territory has made any changes to operations, objectives, or other aspects of MFP program administration that will require amendments to the Operational Protocol.",
          choices: [
            {
              id: "2Vfw3b0V0urpvwAz9Fnqafb1",
              label: "No",
            },
            {
              id: "2Vfw3X48qEyKOAxXt7HPlMMg",
              label: "Yes",
              children: [
                {
                  id: "oa_describeDevelopmentsChanges",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "aa_changesMfpProgramAdministration",
                    parentOptionId: "2Vfw3X48qEyKOAxXt7HPlMMg",
                  },
                  props: {
                    label: "Describe the developments or changes.",
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
