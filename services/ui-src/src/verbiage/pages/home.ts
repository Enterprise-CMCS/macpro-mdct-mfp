export default {
  intro: {
    header: "Money Follows the Person (MFP) Portal",
    body: {
      preLinkText:
        "Get started by completing a MFP Work Plan for your state or territory. After your Work Plan is submitted and approved, you will be able to complete a Semi-Annual Progress Report. Learn more about this ",
      linkText: "new data collection tool",
      linkLocation:
        "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html",
      postLinkText: " from CMS.",
    },
  },
  cards: {
    MP: {
      title: "MFP Work Plan (WP)",
      body: {
        available:
          "The MFP Work Plan online form is now available. Note: Every state must submit one report per program, through the online form.",
      },
      downloadText: "",
      link: {
        text: "Enter Work Plan online",
        route: "mp/get-started",
      },
      accordion: {
        buttonLabel: "When is the Work Plan due?",
        text: "The initial Work Plan will be submitted with the updated operational protocol for review and approval. The Work Plan will be updated annually during Period 1 of SAR reporting (July-August). Recipients may also submit update to the WP during period 2 of SAR reporting (January - February) to the new initiatives or reflect any planned changes in state or territory-specific initiatives.",
      },
    },
    SAR: {
      title: "MFP Semi-Annual Progress Report (SAR)",
      body: {
        available:
          "The reporting tool is to be used by grantees for semi-annual reporting on MFP program data. The information provided in this report will allow CMS to monitor grantee progress and identify challenges and improvement opportunities. For additional guidance on completing this form, please the associated ",
      },
      linkText: "User Guide",
      linkText2: "Help File",
      midText: " and ",
      linkLocation:
        "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html",
      linkLocation2:
        "https://www.medicaid.gov/medicaid/managed-care/guidance/medicaid-and-chip-managed-care-reporting/index.html",
      postLinkText: ".",
      downloadText: "",
      link: {
        text: "Enter SAR online",
        route: "sar/",
      },
      accordion: {
        buttonLabel: "When is the SAR due?",
        text: "The SAR will need to be reviewed and submitted twice a year, with 60 days following the end of each second and fourth calendar year quarter.",
      },
    },
  },
  readOnly: {
    header: "View State Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
