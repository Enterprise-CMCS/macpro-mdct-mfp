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
          type: "html",
          content:
            "A state or territory-specific initiative is a plan or process designed to improve MFP Demonstration program performance and advance MFP statutory goals, which include increasing the use of home and community-based services (HCBS) over institutional long-term services and supports (LTSS), removing barriers that prevent individuals from receiving support in their preferred settings, improving the quality of life for MFP participants, and ensuring continued access to HCBS and quality assurance. Each initiative includes a defined set of activities designed to address gaps, challenges, or opportunities in state or territory MFP programs and is associated with an MFP grant funding source. Initiatives can be funded using one or more of these funding sources:<br>",
        },
        {
          type: "ul",
          content: "",
          props: {
            style: {
              marginLeft: "1.5rem",
              padding: "1rem",
            },
          },
          children: [
            {
              type: "li",
              content: "MFP cooperative agreement funds for:",
            },
            {
              type: "li",
              content: "",
              props: {
                style: {
                  listStyle: "none",
                },
              },
              children: [
                {
                  content: "",
                  type: "ul",
                  props: {
                    style: {
                      marginLeft: "1rem",
                      paddingTop: "1rem",
                    },
                  },
                  children: [
                    {
                      type: "li",
                      props: {
                        style: {
                          paddingBottom: "1rem",
                        },
                      },
                      content: "Qualified HCBS and demonstration services",
                    },
                    {
                      type: "li",
                      props: {
                        style: {
                          paddingBottom: "1rem",
                        },
                      },
                      content: "Supplemental services",
                    },
                    {
                      type: "li",
                      props: {
                        style: {
                          paddingBottom: "1rem",
                        },
                      },
                      content: "Administrative activities",
                    },
                    {
                      type: "li",
                      props: {
                        style: {
                          paddingBottom: "1rem",
                        },
                      },
                      content: "Capacity building initiatives",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "p",
          content:
            "State or territory equivalent funds attributable to the MFP-enhanced Federal Medical Assistance Percentage (FMAP) Approval to use MFP cooperative agreement funding or state or territory funds equivalent to the MFP-enhanced FMAP related to planning or implementing an initiative must be obtained through a state or territory’s Operational Protocol (OP), budget amendment request, capacity building proposal, or rebalancing funding proposal as appropriate.",
          paddingBottom: "1rem",
        },
        {
          type: "p",
          content:
            "Recipients must identify and describe the required initiatives below and have the option to identify additional initiatives on other topics.",
          paddingBottom: "1rem",
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
                      props: {
                        style: {
                          verticalAlign: "top",
                          borderBottom: "1px solid #D9D9D9",
                        },
                      },
                      children: [
                        {
                          type: "ul",
                          content: "",
                          children: [
                            {
                              type: "li",
                              content:
                                "Transitions and transition coordination services",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Housing-related supports",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Quality measurement and improvement",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Self-direction (if applicable)",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Tribal initiative (if applicable)",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "td",
                      content: "",
                      props: {
                        style: {
                          borderBottom: "1px solid #D9D9D9",
                        },
                      },
                      children: [
                        {
                          type: "ul",
                          content: "",
                          children: [
                            {
                              type: "li",
                              content: "Recruitment and enrollment",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Person-centered planning and services",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "No Wrong Door systems",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Community transition support",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content:
                                "Direct service workforce and caregivers",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Employment support",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content:
                                "Convenient and accessible transportation options",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Data-based decision-making",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "Financing approaches",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
                            },
                            {
                              type: "li",
                              content: "External engagement",
                              props: {
                                style: {
                                  paddingBottom: "0.5rem",
                                },
                              },
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
          type: ReportFormFieldType.TEXT,
          content: "*Required by Program Terms and Conditions",
          props: {
            className: "mdct-smalltext",
          },
        },
        {
          type: "html",
          content:
            "<br>For each initiative, recipients will be asked to provide:<br>",
        },
        {
          type: "ol",
          content: "",
          props: {
            styleType: "upper-roman",
            style: {
              marginLeft: "1.5rem",
              padding: "1rem",
            },
          },
          children: [
            {
              type: "li",
              content:
                "Initiative description (approximately 300 word max or 1800 characters)",
              props: {
                style: {
                  padding: "0.5rem",
                },
              },
            },
            {
              type: "li",
              content: "An evaluation plan, including measurable objectives",
              props: {
                style: {
                  padding: "0.5rem",
                },
              },
            },
            {
              type: "li",
              content: "Funding sources",
              props: {
                style: {
                  padding: "0.5rem",
                },
              },
            },
            {
              type: "li",
              content:
                "Initiative close-out information, to be completed as appropriate during MFP Work Plan revisions",
              props: {
                style: {
                  padding: "0.5rem",
                },
              },
            },
          ],
        },
        {
          type: "html",
          content:
            "<br>The MFP Work Plan should establish one or more demonstrable objectives for each initiative, set associated performance measures or indicators to monitor progress, and clearly articulate the actions necessary to achieve the objectives. Progress towards meeting these objectives indicates a state’s or territory’s increased capacity to provide HCBS, rather than institutional LTSS.<br>",
        },
        {
          type: "html",
          content:
            "<br>The recipient must identify the MFP funding source(s) for each initiative. Funding sources for initiatives include MFP administrative cooperative agreement funding; MFP funding for qualified HCBS, demonstration services, and supplemental services; state or territory funds equivalent to the MFP-enhanced FMAP; or MFP capacity building funding.<br>",
        },
        {
          type: "html",
          content:
            "<br>If the initiative will not be sustained with MFP funding or state or territory-equivalent funding, the recipient must explain whether the initiative will be terminated or sustained through another funding source.<br><br>",
        },
        {
          type: ReportFormFieldType.TEXT,
          content:
            "Answer the following questions regarding required initiative topics. This is necessary in order to track completion of required data.",
          props: {
            style: {
              color: "#5B616B",
              borderTop: "1px solid #D9D9D9",
              paddingTop: "2rem",
            },
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
