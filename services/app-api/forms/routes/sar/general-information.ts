import { FormRoute } from "../../utils/types";

export const generalInformationRoute: FormRoute = {
  name: "General Information",
  path: "/sar/general-information",
  pageType: "standard",
  verbiage: {
    intro: {
      section: "",
      subsection: "General Information",
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
  form: {
    id: "ga",
    fields: [
      {
        id: "generalInformation_resubmissionInformation",
        type: "textarea",
        validation: "text",
        props: {
          label:
            "Briefly describe the questions you plan to revise and the reason(s) for the revision(s):",
          heading: "Resubmission Information",
        },
      },
      {
        id: "generalInformation_MfpOperatingOrganizationName",
        type: "text",
        validation: "text",
        props: {
          label: "Name of MFP operating organization",
          heading: "Organization Information",
        },
      },
      {
        id: "generalInformation_stateTerritoryMedicaidAgency",
        type: "text",
        validation: "text",
        props: {
          label: "State or territory Medicaid agency",
        },
      },
      {
        id: "generalInformation_stateTerritoryMedicaidDirector",
        type: "text",
        validation: "text",
        props: {
          label: "State or territory Medicaid director",
        },
      },
      {
        id: "generalInformation_mfpProgramPublicName",
        type: "text",
        validation: "text",
        props: {
          label: "MFP program's public name",
        },
      },
      {
        id: "generalInformation_mfpProgramWebsite",
        type: "text",
        validation: "url",
        props: {
          label: "MFP program's website",
        },
      },
      {
        id: "generalInformation_aorName",
        type: "text",
        validation: "text",
        props: {
          label: "AOR name",
          heading: "Authorized Organizational Representative (AOR)",
        },
      },
      {
        id: "generalInformation_aorTitleAgency",
        type: "text",
        validation: "text",
        props: {
          label: "AOR title/agency",
        },
      },
      {
        id: "generalInformation_aorEmail",
        type: "text",
        validation: "email",
        props: {
          label: "AOR email",
        },
      },
      {
        id: "generalInformation_hasAorChangedSinceLastReport",
        type: "radio",
        validation: "radio",
        props: {
          label: "Has the AOR changed since last report?",
          choices: [
            {
              id: "2Vff8CQXa1Z82GAXK85KI1nG",
              label: "Yes",
            },
            {
              id: "2VffASWS2XRfAlc3uLzxCVAC",
              label: "No",
            },
          ],
        },
      },
      {
        id: "generalInformation_projectDirectorName",
        type: "text",
        validation: "text",
        props: {
          label: "Project director name",
          heading: "Project Director",
        },
      },
      {
        id: "generalInformation_projectDirectorTitle",
        type: "text",
        validation: "text",
        props: {
          label: "Project director title",
        },
      },
      {
        id: "generalInformation_projectDirectorEmail",
        type: "text",
        validation: "email",
        props: {
          label: "Project director email",
        },
      },
      {
        id: "generalInformation_cmsProjectOfficerName",
        type: "text",
        validation: "text",
        props: {
          label: "CMS project officer name",
          heading: "CMS Project Officer",
        },
      },
    ],
  },
};
