export const mockGeneralInfoForm = {
  id: "mock-general-info-id",
  fields: [],
};

export const mockGeneralInfoReportPageVerbiage = {
  section: "",
  subsection: "General Information",
  hint: "",
  exportSection: "",
  info: [
    {
      type: "html",
      content:
        "The Money Follows the Person (MFP) Demonstration Work Plan (WP) is the state or territory’s road map for accomplishing the rebalancing objective described in section ",
    },
    {
      type: "externalLink",
      content: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      props: {
        href: "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
        target: "_blank",
        ariaLabel: "Link opens in new tab",
      },
    },
    {
      type: "html",
      content:
        " as “increasing the use of home and community-based, rather than institutional, long-term care services.” The WP presents MFP Demonstration initiatives that support the state or territory’s unique rebalancing goals and objectives. The WP enables states or territories and Centers for Medicare & Medicaid Services (CMS) to monitor state or territory-specific initiatives throughout the grant and make course corrections where needed. While the WP describes state or territory initiatives and sets performance measures, the Semi-Annual Progress Report (SAR) will capture progress on these initiatives and performance measures, alongside other information. <br><br> A recipient submits an initial WP with the updated operational protocol for review and approval. The WP will be updated annually during Period 1 of SAR reporting (July–August). Recipients may also submit updates to the WP during Period 2 of SAR reporting (January–February) to reflect any planned changes in state or territory-specific initiatives or add new initiatives. Changes to the WP must be submitted to CMS for approval no later than 30 days prior to the planned date of implementation of the change and the proposed change(s) may not be implemented until approved. Approved changes will be integrated into the recipient’s SAR reporting for the following reporting period. Note that requests to change Transition Benchmark projections can be made once annually, during the July–August period. <br><br> CMS may amend or add new WP fields during the demonstration period. For additional guidance on completing this form, please see the associated User Guide and Help File. ",
    },
  ],
};

export const mockGeneralInfoReportPageJson = {
  name: "mock-general-information",
  path: "/wp/general-information",
  pageType: "generalInfo",
  verbiage: {
    intro: mockGeneralInfoReportPageVerbiage,
  },
  form: mockGeneralInfoForm,
};
