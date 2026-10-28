import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const instructionsRoute: FormRoute = {
  name: "State or Territory-Specific Initiatives Instructions",
  path: "/wp/state-or-territory-specific-initiatives/instructions",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "State or Territory-Specific Initiatives Instructions",
      spreadsheet: "",
      info: [
        {
          type: "p",
          content:
            "A state or territory-specific initiative is a plan or process designed to improve MFP Demonstration program performance and advance MFP statutory goals, which include increasing the use of home and community-based services (HCBS) over institutional long-term services and supports (LTSS), removing barriers that prevent individuals from receiving support in their preferred settings, improving the quality of life for MFP participants, and ensuring continued access to HCBS and quality assurance. Each initiative includes a defined set of activities designed to address gaps, challenges, or opportunities in state or territory MFP programs and is associated with an MFP grant funding source. Initiatives can be funded using one or more of these funding sources:",
        },
        {
          type: "ul",
          content: "",
          children: [
            {
              type: "li",
              content: "Qualified HCBS and demonstration services",
            },
            {
              type: "li",
              content: "Supplemental services",
            },
            {
              type: "li",
              content: "Administrative activities",
            },
            {
              type: "li",
              content: "Capacity building initiatives",
            },
            {
              type: "li",
              content:
                "State or territory equivalent funds attributable to the MFP-enhanced Federal Medical Assistance Percentage (FMAP)",
            },
          ],
          props: {
            className: "mdct-instructions-list",
          },
        },
        {
          type: "p",
          content:
            "State or territory equivalent funds attributable to the MFP-enhanced Federal Medical Assistance Percentage (FMAP) Approval to use MFP cooperative agreement funding or state or territory funds equivalent to the MFP-enhanced FMAP related to planning or implementing an initiative must be obtained through a state or territory’s Operational Protocol (OP), budget amendment request, capacity building proposal, or rebalancing funding proposal as appropriate.",
        },
        {
          type: "p",
          content:
            "Recipients must identify and describe the required initiatives below and have the option to identify additional initiatives on other topics.",
        },
        {
          type: "table",
          content: "",
          props: {
            className: "mdct-table",
          },
          children: [
            {
              type: "thead",
              content: "",
              children: [
                {
                  type: "tr",
                  content: "",
                  children: [
                    {
                      type: "th",
                      content:
                        "<span aria-label='Required by Program Terms and Conditions'>REQUIRED* INITIATIVES</span>",
                    },
                    {
                      type: "th",
                      content: "OPTIONAL INITIATIVES",
                    },
                  ],
                },
              ],
            },
            {
              type: "tbody",
              content: "",
              children: [
                {
                  type: "tr",
                  content: "",
                  children: [
                    {
                      type: "td",
                      content: "",
                      children: [
                        {
                          type: "ul",
                          content: "",
                          children: [
                            {
                              type: "li",
                              content:
                                "Transitions and transition coordination services",
                            },
                            {
                              type: "li",
                              content: "Housing-related supports",
                            },
                            {
                              type: "li",
                              content: "Quality measurement and improvement",
                            },
                            {
                              type: "li",
                              content: "Self-direction (if applicable)",
                            },
                            {
                              type: "li",
                              content: "Tribal initiative (if applicable)",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "td",
                      content: "",
                      children: [
                        {
                          type: "ul",
                          content: "",
                          children: [
                            {
                              type: "li",
                              content: "Recruitment and enrollment",
                            },
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
                              content:
                                "Direct service workforce and caregivers",
                            },
                            {
                              type: "li",
                              content: "Employment support",
                            },
                            {
                              type: "li",
                              content:
                                "Convenient and accessible transportation options",
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
                              content: "External engagement",
                            },
                            {
                              type: "li",
                              content: "Other",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "tfoot",
              content: "",
            },
          ],
        },
        {
          type: "p",
          content: "*Required by Program Terms and Conditions",
          props: {
            className: "mdct-smalltext",
          },
        },
        {
          type: "p",
          content: "For each initiative, recipients will be asked to provide:",
        },
        {
          type: "ol",
          content: "",
          props: {
            className: "mdct-instructions-list-roman",
          },
          children: [
            {
              type: "li",
              content: "Initiative description",
            },
            {
              type: "li",
              content: "An evaluation plan",
            },
            {
              type: "li",
              content: "Funding sources",
            },
            {
              type: "li",
              content:
                "Initiative close-out information, to be completed as appropriate during MFP Work Plan revisions",
            },
          ],
        },
        {
          type: "p",
          content:
            "The MFP Work Plan should establish an evaluation plan, which outlines key metrics and performance indicators. Progress towards meeting these evaluation elements indicate a state’s or territory’s increased capacity to provide HCBS, rather than institutional LTSS.",
        },
        {
          type: "p",
          content:
            "The recipient must identify the MFP funding source(s) for each initiative. Funding sources for initiatives include MFP administrative cooperative agreement funding; MFP funding for qualified HCBS, demonstration services, and supplemental services; state or territory funds equivalent to the MFP-enhanced FMAP; or MFP capacity building funding.",
        },
        {
          type: "p",
          content:
            "If the initiative will not be sustained with MFP funding or state or territory-equivalent funding, the recipient must explain whether the initiative will be terminated or sustained through another funding source.",
        },
        {
          type: "p",
          content:
            "Answer the following questions regarding required initiative topics. This is necessary in order to track completion of required data.",
          props: {
            className: "mdct-instructions-text",
          },
        },
      ],
    },
  },
  form: {
    id: "sdii",
    fields: [
      {
        id: "instructions_selfDirectedInitiatives",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Are self-directed initiatives applicable to your state or territory?",
          choices: [
            {
              id: "UG7uunqq5UCtUq1is3iyiw",
              label: "Yes",
            },
            {
              id: "3DGAqqnOBE2kwKVFMxUt3A",
              label: "No",
            },
          ],
        },
      },
      {
        id: "instructions_tribalInitiatives",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Are Tribal Initiatives applicable to your state or territory?",
          choices: [
            {
              id: "UG7uunqq5UCtUq1is3iyiw",
              label: "Yes",
            },
            {
              id: "3DGAqqnOBE2kwKVFMxUt3A",
              label: "No",
            },
          ],
        },
      },
    ],
  },
};
