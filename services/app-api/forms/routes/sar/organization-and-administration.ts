import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../utils/types";

export const organizationAndAdministrationRoute: FormRoute = {
  name: "Organization & Administration",
  path: "/sar/organization-and-administration",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Organization & Administration",
    },
  },
  form: {
    id: "oa",
    fields: [
      {
        id: "oa_changesOrganizationAdministration",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Were there any changes in the organization or administration of the MFP program during this reporting period? For example, did your Medicaid agency undergo a reorganization that altered the reporting relationship of the MFP Project Director?",
          choices: [
            {
              id: "2VfuG3SVaUXHaKZWzucYU6jt",
              label: "No",
            },
            {
              id: "2VfuG4GRc4ApcknSSgbMvvHg",
              label: "Yes",
              children: [
                {
                  id: "oa_describeOAChanges",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "oa_changesOrganizationAdministration",
                    parentOptionId: "2VfuG4GRc4ApcknSSgbMvvHg",
                  },
                  props: {
                    label: "Describe the changes.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "oa_projectDirectorEmployment",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Is the Project Director an employee of the recipient agency or state/territory Medicaid agency?",
          choices: [
            {
              id: "2VfuG2OUicDROyaE5RmbtqWM",
              label: "No",
              children: [
                {
                  id: "oa_provideNameOfEmployerAndReportingRelationship",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "oa_projectDirectorEmployment",
                    parentOptionId: "2VfuG2OUicDROyaE5RmbtqWM",
                  },
                  props: {
                    label:
                      "Provide the name of the employer and the reporting relationship with the recipient agency.",
                  },
                },
              ],
            },
            {
              id: "2VfuG52IEKt1Fft6cz4jgi68",
              label: "Yes",
            },
          ],
        },
      },
      {
        id: "oa_hiringRetentionChallengesMfpStaff",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Are there hiring or retention challenges for MFP staff, including the MFP Project Director and MFP Data and Quality Analyst?",
          choices: [
            {
              id: "2VfuyVPFCc95OFfbF9tEKjzn",
              label: "No",
            },
            {
              id: "2VfuyVGyPc6ePgAicM69ayDqTpX",
              label: "Yes",
              children: [
                {
                  id: "oa_describeHiringRetentionChallenges",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "oa_hiringRetentionChallengesMfpStaff",
                    parentOptionId: "2VfuyVGyPc6ePgAicM69ayDqTpX",
                  },
                  props: {
                    label: "Describe the challenges.",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "oa_describeTechnicalAssitanceActivities",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label:
            "Describe the technical assistance activities MFP staff have engaged in during the reporting period (e.g., participation in a learning collaborative or other training session).",
        },
      },
      {
        id: "oa_additionalTechnicalResourcesSupports",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Are there additional technical assistance resources or supports that your state or territory would benefit from?",
          choices: [
            {
              id: "2VfvDUpKJRmrBrqHpy77oHAi",
              label: "No",
            },
            {
              id: "2VfvDSkVxhYZwQ8AMXqR5QX8",
              label: "Yes",
              children: [
                {
                  id: "oa_describeAdditionalTechnicalResourcesSupports",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "oa_additionalTechnicalResourcesSupports",
                    parentOptionId: "2VfvDSkVxhYZwQ8AMXqR5QX8",
                  },
                  props: {
                    label:
                      "Describe additional technical resources or supports.",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
