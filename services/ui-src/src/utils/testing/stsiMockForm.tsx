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
      type: "html",
      content:
        "<br><li>MFP cooperative agreement funds for:</li><br><li>Qualified HCBS and demonstration services</li><br><li>Supplemental services</li><br><li>Administrative activities</li><br><li>Capacity building initiatives</li><br><li>State or territory equivalent funds attributable to the MFP-enhanced match</li><br>",
    },
    {
      type: "html",
      content:
        "<table><tr><td><p>Required* Initiatives</p><li>Transitions and transition coordination services</li><li>Housing-related supports</li><li>Quality measurement and improvement</li><li>Self-direction (if applicable)</li><li>Tribal initiative (if applicable)</li></td><td><p>Optional initiatives</p><li>Recruitment and enrollment</li><li>Person-centered planning and services</li><li>No Wrong Door systems</li><li>Community transition support</li><li>Direct service workforce and caregivers</li><li>Employment support</li><li>Convenient and accessible transportation options</li><li>Data-based decision-making</li><li>Financing approaches</li><li>Stakeholder engagement</li><li>Equity and social determinants of health (SODH)</li><li>Other</li></td></tr></table>",
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
      type: "html",
      content:
        "<br>I. Initiative description, including target populations and timeframe<br>",
    },
    {
      type: "html",
      content:
        "<br>II. An evaluation plan, including measurable objectives<br>",
    },
    {
      type: "html",
      content:
        "<br>III. Funding sources, with projected quarterly expenditures<br>",
    },
    {
      type: "html",
      content:
        "<br>IV. Close-out information, to be completed as appropriate during WP revisions<br>",
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
