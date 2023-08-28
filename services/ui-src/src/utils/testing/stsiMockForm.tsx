export const mockForm = {
  id: "mock-form-id",
  fields: [
    {
      id: "firstquestion",
      type: "radio",
      validation: "radio",
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
      id: "secondquestion",
      type: "radio",
      validation: "radio",
      props: {
        label: "Are Tribal initiatives applicable to your state or territory?",
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
};

export const mockVerbiageIntro = {
  section: "",
  subsection: "mock subsection",
  spreadsheet: "mock item",
  info: [
    {
      type: "html",
      content: "mock html",
    },
  ],
  editEntityButtonText: "Edit",
  enterReportText: "Enter Details",
};

export const mockSTSInitiativesInstructionsVerbaigeIntro = {
  section: "",
  subsection: "State & Territory Specific Initiatives Instructions",
  spreadsheet: "",
  info: [
    {
      type: "html",
      content:
        "State or territory-specific initiatives are a distinct set of activities designed to increase the use of HCBS rather than institutional long-term services and supports. These initiatives can be funded using one or more of these funding sources:<br>",
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
        {
          type: "li",
          content:
            "State or territory equivalent funds attributable to the MFP-enhanced match",
        },
      ],
    },
    {
      type: "table",
      content: "",
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
                  props: {
                    style: {
                      textTransform: "capitalize",
                      color: "#71767a",
                      fontFamily: "Open Sans",
                      fontSize: "14px",
                      lineHeight: "18px",
                      letterSpacing: "0px",
                      textAlign: "left",
                    },
                  },
                  content: "Required* Initiatives",
                },
                {
                  type: "th",
                  props: {
                    style: {
                      textTransform: "capitalize",
                      color: "#71767a",
                      fontFamily: "Open Sans",
                      fontSize: "14px",
                      lineHeight: "18px",
                      letterSpacing: "0px",
                      textAlign: "left",
                    },
                  },
                  content: "Optional Initiatives",
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
      type: "html",
      content: "<sup>*Required by Program Terms and Conditions</sup>",
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
            "Initiative description, including target populations and timeframe",
        },
        {
          type: "li",
          content: "An evaluation plan, including measurable objectives",
        },
        {
          type: "li",
          content: "Funding sources, with projected quarterly expenditures",
        },
        {
          type: "li",
          content:
            "Close-out information, to be completed as appropriate during WP revisions",
        },
      ],
    },
    {
      type: "html",
      content:
        "<br>The WP should establish one or more demonstrable objectives for each initiative, set associated performance measures or indicators to monitor progress, and clearly articulate the actions necessary to achieve the objectives. Progress towards meeting these objectives indicates a state’s or territory’s increased capacity to provide HCBS, rather than institutional, long-term care services.<br>",
    },
    {
      type: "html",
      content:
        "<br>The recipient must identify the MFP funding source(s) for each initiative and provide quarterly projected spending by funding source. Funding sources for initiatives include state or territory funds equivalent to the MFP-enhanced Federal Medical Assistance Percentage (FMAP); MFP capacity building funding; MFP funding for qualified HCBS, demonstration services, and supplemental services; or MFP administrative cooperative agreement funding.<br>",
    },
    {
      type: "html",
      content:
        "<br>If a recipient updates the WP to indicate that an initiative will no longer be sustained with MFP funding or state or territory-equivalent funding, the recipient must explain whether the initiative will be terminated or sustained through another funding source.<br>",
    },
    {
      type: "html",
      content:
        "<p>Answer the following questions regarding required initiative topics. This is necessary in order to track completion of required data.</p>",
    },
  ],
  editEntityButtonText: "Edit",
  enterReportText: "Enter Details",
};

export const mockStateAndTerritoryInitiativesInstructionsPageJson = {
  name: "transition-benchmark-strategy",
  path: "/wp/state-and-territory-specific-initiatives/instructions",
  pageType: "standard",
  verbiage: {
    intro: mockSTSInitiativesInstructionsVerbaigeIntro,
  },
  form: mockForm,
};

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};
