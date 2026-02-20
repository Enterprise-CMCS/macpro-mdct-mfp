import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const generalInformationRoute: FormRoute = {
  name: "General Information",
  path: "/expenditure/general-information",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "General Information",
      info: "Enter the name of the staff member who is responsible for the accuracy of this form. CMS will contact the person listed here if there are questions regarding the report. If you have any questions regarding this report, please contact your CMS Project Officer.",
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
    id: "exp-gi",
    fields: [
      {
        id: "generalInformation_contactName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "Contact name",
          hint: "First and last name of the contact person.",
        },
      },
      {
        id: "generalInformation_contactEmail",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.EMAIL,
        props: {
          label: "Contact email address",
          hint: "Enter email address. Department or program-wide email addresses are acceptable.",
        },
      },
    ],
  },
};
