import { FormRoute } from "../../utils/types";

export const generalInformationRoute: FormRoute = {
  name: "General Information",
  path: "/wp/general-information",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "",
      subsection: "General Information",
      info: [
        {
          type: "html",
          content:
            "The Money Follows the Person (MFP) Demonstration Work Plan is the state or territory’s road map for accomplishing the rebalancing objective described in section ",
        },
        {
          type: "externalLink",
          content: "6071(a)(1) of the Deficit Reduction Act (DRA)",
          props: {
            href: "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
            target: "_blank",
            "aria-label":
              "6071(a)(1) of the Deficit Reduction Act (DRA) (Link opens in new tab)",
          },
        },
        {
          type: "html",
          content:
            " as “increasing the use of home and community-based, rather than institutional, long-term care services.” The MFP Work Plan presents MFP Demonstration initiatives that support the state or territory’s unique rebalancing goals and objectives. The MFP Work Plan enables states or territories and Centers for Medicare & Medicaid Services (CMS) to monitor state or territory-specific initiatives throughout the grant and make course corrections where needed. While the MFP Work Plan describes state or territory initiatives and sets performance measures, the MFP Semi-Annual Progress Report will capture progress on these initiatives and performance measures, alongside other information. CMS may amend or add new MFP Work Plan fields during the Demonstration period.",
        },
      ],
    },
    praDisclosure: [
      {
        type: "p",
        content: "<b>PRA Disclosure Statement</b>",
      },
      {
        type: "p",
        content:
          "Under the Privacy Act of 1974 any personally identifying information obtained will be kept private to the extent of the law. According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-1053. The time required to complete this information collection is estimated to average 2.5 hours per response, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850",
      },
    ],
  },
  form: { id: "wp-gi", fields: [] },
};
