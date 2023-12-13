export default {
  intro: {
    header: "Money Follows the Person (MFP) Portal",
    body: {
      preLinkText:
        "Get started by completing a MFP Work Plan for your state or territory. After your MFP Work Plan is submitted and approved, you will be able to complete a Semi-Annual Progress Report. Learn more about this ",
      linkText: "new data collection tool",
      linkLocation:
        "https://www.medicaid.gov/medicaid/long-term-services-supports/money-follows-person/index.html",
      postLinkText:
        " from CMS. For additional guidance on completing this form, see the associated User Guide and Help File.",
    },
  },
  cards: {
    WP: {
      title: "MFP Work Plan (WP)",
      body: {
        available:
          "The MFP Work Plan is the state or territory's road map for accomplishing the rebalancing objective described in section ",
      },
      linkText: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      linkLocation:
        "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
      postLinkText:
        ' as "increasing the use of home and community-based, rather than institutional, long-term care services."',
      downloadText: "",
      link: {
        text: "Enter Work Plan online",
        route: "wp",
      },
      accordion: {
        buttonLabel: "When is the MFP Work Plan due?",
        text: "The MFP Work Plan will be created and submitted initially and then amended semi-annually. CMS will review and approve all MFP Work Plans and proposed changes.The MFP Work Plan deadlines are May 1st for Reporting Period 1 and November 1st for Reporting Period 2. Updates to existing state or territory-specific initiatives or the addition of new initiatives can occur during either of these periods, however, changes to transition benchmark projections should be made between July - November 1st and align with program budget requests. CMS approved changes will be integrated into the MFP recipient’s Semi-Annual Progress Report for the following reporting period.",
      },
    },
    SAR: {
      title: "MFP Semi-Annual Progress Report (SAR)",
      body: {
        available:
          "This reporting tool is to be used by MFP recipients for semi-annual reporting of MFP program data. The information provided in this report will allow CMS to monitor MFP recipient progress and identify challenges and improvement opportunities.",
      },
      linkText: "User Guide",
      linkText2: "Help File",
      midText: " and ",
      linkLocation: "https://www.google.com",
      linkLocation2: "https://www.google.com",
      postLinkText: ".",
      downloadText: "",
      link: {
        text: "Enter SAR online",
        route: "sar/",
      },
      accordion: {
        buttonLabel: "When is the SAR due?",
        text: "The Semi-Annual Progress Report (SAR) will need to be reviewed and submitted twice a year, within 60 days following the end of each second and fourth calendar year quarter. For example, the SAR Reporting Period 1 covers January-June activity and MFP recipients must submit their data within 60 days following June 30.",
      },
    },
  },
  readOnly: {
    header: "View State/Territory Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
