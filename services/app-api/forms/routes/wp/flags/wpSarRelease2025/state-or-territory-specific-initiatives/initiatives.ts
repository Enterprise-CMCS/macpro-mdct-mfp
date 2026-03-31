import {
  PageTypes,
  ReportFormFieldType,
  ValidationType,
  WPStateOrTerritorySpecificInitiativesV2Route,
  StepEntityType,
} from "../../../../../../utils/types";

export const initiativesRoute: WPStateOrTerritorySpecificInitiativesV2Route = {
  name: "State or Territory-Specific Initiatives",
  path: "/wp/state-or-territory-specific-initiatives/initiatives",
  pageType: PageTypes.MODAL_OVERLAY,
  entityType: StepEntityType.INITIATIVE,
  entityInfo: ["initiative_name", "initiative_wpTopic"],
  overlayForm: {
    id: "stsidi",
    tables: [],
    fields: [
      {
        id: "defineInitiative_describeInitiative",
        type: ReportFormFieldType.TEXTAREA,
        validation: {
          type: ValidationType.TEXT_CUSTOM,
          options: {
            maxLength: 1800,
          },
        },
        props: {
          label:
            "Describe the initiative, including the gap, challenge, or opportunity it will address:",
          maxLength: 1800,
        },
      },
      {
        id: "defineInitiative_keyActivities",
        type: ReportFormFieldType.DYNAMIC,
        validation: ValidationType.DYNAMIC,
        props: {
          dynamicButtonText: "Add key activity",
          hint: "List the key activities to implement the initiative. This could include activities related to the target population, and activities within the timeframe for starting and completing the initiative.",
          label: "Key Activities",
        },
      },
      {
        id: "defineInitiative_targetPopulations",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Target population(s):",
          hint: [
            {
              type: "html",
              content:
                "Select all that apply. “Other” population(s) selected and defined in the ",
            },
            {
              type: "internalLink",
              content: "Transition Benchmarks",
              props: {
                to: "/wp/transition-benchmarks",
              },
            },
            {
              type: "html",
              content:
                " section automatically upload. Select “HCBS infrastructure/system-level development” for initiatives that strengthen or expand home and community-based services (HCBS).",
            },
          ],
          choices: [
            {
              id: "generatedCheckbox",
              label: "Target populations (generated)",
            },
          ],
        },
      },
      {
        id: "defineInitiative_startDate",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Enter the expected or actual state date for the initiative.",
          hint: "Aim for a 1-2 year period for implementation, testing, and evaluation. Explain in the initiative description if it will take longer than 2 years.",
          choices: [
            {
              id: "wHDw5laJkJIRG1FrHs5VS6",
              label: "Expected start date",
              children: [
                {
                  id: "defineInitiative_expectedStartDate_value",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    parentOptionId:
                      "defineInitiative_startDate-wHDw5laJkJIRG1FrHs5VS6",
                    parentFieldName: "defineInitiative_startDate",
                    nested: true,
                  },
                  props: {
                    label: "",
                  },
                },
              ],
            },
            {
              id: "lwkRrUT61kbVMe1OeZWOql",
              label: "Actual start date",
              children: [
                {
                  id: "defineInitiative_actualStartDate_value",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    parentOptionId:
                      "defineInitiative_projectedStartDate-lwkRrUT61kbVMe1OeZWOql",
                    parentFieldName: "defineInitiative_projectedStartDate",
                    nested: true,
                  },
                  props: {
                    label: "",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "defineInitiative_endDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.END_DATE,
        props: {
          label:
            "Enter the date for when the initiative was or will be completed.",
          hint: "A completed initiative means the initiative has been implemented, tested, and evaluated. ",
        },
      },
      // Initiative Evaluation
      {
        id: "defineInitiative_purposeAndGoals",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          hint: "Briefly describe the purpose of your evaluation (1-3 sentences)",
          label: "Purpose and Goals",
          subtitle: [
            {
              type: "p",
              content:
                "An evaluation plan outlines how a specific initiative will be evaluated to assess its feasibility, effectiveness, and/or efficiency. It specifies the evaluation's purpose and goals, evaluation questions, evaluation design and methods, key metrics and indicators, data collection and plans, and timeline and milestones. Ideally, the plan should be developed before the initiative begins and involves all relevant stakeholders. Once an initiative is evaluated, the state or territory should also be able to report on the findings, whether and how the initiative will be sustained, and how the findings will be used.",
            },
          ],
          title: "Initiative Evaluation",
        },
      },
      // Qualitative Methods
      {
        id: "defineInitiative_qualitativeMethods",
        type: ReportFormFieldType.TEXTAREA,
        validation: {
          type: ValidationType.TEXT_CUSTOM_OPTIONAL,
          options: {
            maxLength: 1800,
          },
        },
        props: {
          label:
            "Are you employing any qualitative methods, if so, what are they? Please describe.",
          maxLength: 1800,
          styleAsOptional: true,
          title: "Qualitative Methods",
        },
      },
      // Funding Sources
      {
        id: "defineInitiative_fundingSources",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX,
        props: {
          label: "Identify funding source(s):",
          hint: "Provide funding sources for this initiative.",
          title: "Funding Sources",
          choices: [
            {
              id: "awTB7dbwBc8x3fRjbWIRlC",
              label: "MFP administrative cooperative agreement funding",
            },
            {
              id: "z1l2sreTSR8zP1f7Z3Fu7z",
              label:
                "MFP funding for qualified HCBS and demonstration services",
            },
            {
              id: "imiTj7JUsAweLR33aYyqPO",
              label: "MFP funding for supplemental services",
            },
            {
              id: "c6GreErctvGyO839dPG3h5",
              label:
                "State or territory funds equivalent to the MFP-enhanced Federal Medical Assistance Percentage (FMAP)",
            },
            {
              id: "kmJzFT1wTnR3w5HqFbsy85",
              label: "MFP capacity building funding",
            },
          ],
        },
      },
      // Close-out
      {
        forCopyoverOnly: true,
        id: "defineInitiative_projectedEndDate_value",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          disabled: true,
          hint: "Auto-populates from “I. Define initiative”.",
          label: "Projected end date",
          styleAsOptional: true,
          title: "Close-out {{initiativeName}}",
        },
      },
      {
        forCopyoverOnly: true,
        id: "closeOutInformation_actualEndDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE_OPTIONAL,
        props: {
          label: "Actual end date",
          styleAsOptional: true,
        },
      },
      {
        forCopyoverOnly: true,
        id: "closeOutInformation_initiativeStatus",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX_OPTIONAL,
        props: {
          hint: "Select all that apply.",
          label:
            "For initiatives that will no longer be sustained with MFP funding or state or territory-equivalent funding, indicate the status below:",
          styleAsOptional: true,
          choices: [
            {
              id: "FhAF0lzeuB4wLalyXv2BeG",
              label: "Completed initiative",
            },
            {
              id: "GUcwKDPBs8K6LY4yT1hPGD",
              label: "Discontinued initiative",
              children: [
                {
                  id: "closeOutInformation_initiativeStatus-terminationReason",
                  props: {
                    label: "Indicate reason for termination",
                  },
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "closeOutInformation_initiativeStatus",
                  },
                },
              ],
            },
            {
              id: "86SG3qhFfsZ0CAu3G4SxM5",
              label: "Sustaining initiative through a Medicaid authority",
              children: [
                {
                  id: "closeOutInformation_initiativeStatus-alternateFunding",
                  props: {
                    label: "Indicate alternative funding source",
                  },
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "closeOutInformation_initiativeStatus",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  modalForm: {
    id: "add_initiative",
    fields: [
      {
        id: "initiative_name",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "Initiative name",
        },
      },
      {
        id: "initiative_wpTopic",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "MFP Work Plan topic:",
          hint: "Note: Initiative topics with <span aria-label='asterisk'>*</span> are required and must be selected at least once across all initiatives.",
          choices: [
            {
              id: "VjQ0OFqior9Dxu5RRNiZ5u",
              label: "Transitions and transition coordination services*",
            },
            {
              id: "wbUsMMqVP7q1n10szK5h5S",
              label: "Housing-related supports*",
            },
            {
              id: "SdaFlF3DJyzKcHCCu3Zylm",
              label: "Quality measurement and improvement*",
            },
            {
              id: "8CpFrev6sMfRijIhafMj7V",
              label: "Self-direction (*if applicable)",
            },
            {
              id: "tVURShWTPfVKGU94QmIwDn",
              label: "Tribal Initiative (*if applicable)",
            },
            {
              id: "1k3EnM5WrizX3hsa6Zn85G",
              label: "Recruitment and enrollment",
            },
            {
              id: "dtybJ8ZucoIn7a4LnMpWg2",
              label: "Person-centered planning and services",
            },
            {
              id: "rSTGMVEOaJ4OZ6amTQetaa",
              label: "No Wrong Door systems",
            },
            {
              id: "8In9QpCC7O3XBkDOyB36vy",
              label: "Community transition support",
            },
            {
              id: "GCBzQ9GDWMwILW0sBQ2dhN",
              label: "Direct service workforce and caregivers",
            },
            {
              id: "jZCOy2pgOiAxgnHDfizer4",
              label: "Employment support",
            },
            {
              id: "xpdOyHiM2GesrYekAT2s1U",
              label: "Convenient and accessible transportation options",
            },
            {
              id: "K8WifjAU3SymG751jAvv6j",
              label: "Data-based decision-making",
            },
            {
              id: "39oSwSqVoDpLGbD9HnfUhg",
              label: "Financing approaches",
            },
            {
              id: "I9A6C2SY0Dk3ezfvywqqwB",
              label: "Stakeholder engagement",
            },
            {
              id: "2qjBuLtpA5pDvUM1HSHMVq",
              label: "Equity and social determinants of health (SDOH)",
            },
            {
              id: "18Wb9b2zMIF13pZwWstdJF",
              label: "Other, specify",
              children: [
                {
                  id: "initiative_wp_otherTopic",
                  type: ReportFormFieldType.TEXT,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName: "initiative_wpTopic",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  verbiage: {
    // Dashboard
    addEntityButtonText: "Add initiative",
    countEntitiesInTitle: true,
    dashboardTitle: "Initiative total count:",
    intro: {
      section: "",
      subsection: "State or Territory-Specific Initiatives",
      info: [
        {
          type: "html",
          content: "See ",
        },
        {
          type: "internalLink",
          content: "previous page",
          props: {
            to: "/wp/state-or-territory-specific-initiatives/instructions",
            style: {
              textDecoration: "underline",
            },
          },
        },
        {
          type: "html",
          content: " for detailed instructions.",
        },
      ],
    },

    // Modal
    addEditModalAddTitle: "Add initiative",
    addEditModalEditTitle: "Edit initiative",
    addEditModalHint:
      "Provide the name of one initiative. You will be then be asked to complete details for this initiative including a description, evaluation plan and funding sources.",
    deleteModalConfirmButtonText: "Yes, delete initiative",
    deleteModalTitle: "Are you sure you want to delete this initiative?",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this initiative in the MFP Work Plan.",

    // Table
    editEntityButtonText: "Edit name/topic",
    editEntityHint: 'Select "Edit" to complete the details.',
    enterEntityDetailsButtonText: "Edit",
    readOnlyEntityButtonText: "View name/topic",
    readOnlyEntityDetailsButtonText: "View",
    tableHeader: "Initiative name <br/> MFP Work Plan topic",
  },
};
