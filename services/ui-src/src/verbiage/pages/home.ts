export default {
  intro: {
    header: "Money Follows the Person (MFP) Portal",
    body: {
      preLinkText:
        "Get started by completing a MFP Work Plan for your state or territory. After your MFP Work Plan is submitted and approved, you will be able to complete a MFP Semi-Annual Progress Report. Learn more about this ",
      linkText: "new data collection tool",
      linkLocation:
        "https://www.medicaid.gov/medicaid/long-term-services-supports/money-follows-person/index.html",
      postLinkText:
        " from CMS. For additional guidance on completing this form, see the associated User Guide and Help File.",
    },
  },
  cards: {
    WP: {
      title: "MFP Work Plan",
      body: {
        available:
          "The MFP Work Plan is the state or territory’s road map for accomplishing the rebalancing objective described in section ",
      },
      linkText: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      linkLocation:
        "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
      postLinkText:
        " as “increasing the use of home and community-based, rather than institutional, long-term care services.”",
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter Work Plan online",
        route: "wp",
      },
      accordion: {
        buttonLabel: "When is the MFP Work Plan due?",
        text: [
          {
            content:
              "The MFP Work Plan will be created and submitted initially and then amended semi-annually. CMS will review and approve all MFP Work Plans and proposed changes.",
          },
          {
            content:
              "The MFP Work Plan deadlines are May 1st for inclusion in January through June reporting (Reporting Period 1) and November 1st for inclusion in July through December reporting (Reporting Period 2). Updates to existing state or territory-specific initiatives or the addition of new initiatives can occur during either of these periods, however, changes to transition benchmark projections should be made between July - November 1st to align with program budget requests.",
          },
          {
            content:
              "CMS approved changes will be integrated into the MFP recipient’s Semi-Annual Progress Report for the following reporting period.",
          },
        ],
      },
    },
    SAR: {
      title: "MFP Semi-Annual Progress Report (SAR)",
      body: {
        available:
          "The MFP Semi-Annual Progress Report is used to present the recipient’s analysis and the status of the various operational areas in reaching the objectives of the Demonstration. Through the SARs, the recipient will further enumerate how they have, or intend to, meet or align with the recipient’s MFP operational procedures and processes; transition benchmarks; program goals for expanding and enhancing home and community-based services (HCBS); and sustainability plans.",
      },
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter SAR online",
        route: "sar",
      },
      accordion: {
        buttonLabel: "When is the MFP SAR due?",
        text: "The MFP Semi-Annual Progress Report will need to be reviewed and submitted twice a year, within 60 days following the end of each second and fourth calendar year quarter. For example, the SAR Reporting Period 1 represents January-June and MFP recipients must submit their data within 60 days following June 30. The recipient must submit the progress report through the final reporting period of the recipient’s Demonstration period of performance, even if the recipient has not operated for a complete reporting period.",
      },
    },
    EXPENDITURE: {
      title: "MFP Financial Reporting Form",
      body: {
        available: "body text",
      },
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter Expenditure online",
        route: "expenditure",
      },
      accordion: {
        buttonLabel: "When is the MFP Financial Reporting Form due?",
        text: "accordion text",
      },
    },
  },
  readOnly: {
    header: "View State/Territory Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
