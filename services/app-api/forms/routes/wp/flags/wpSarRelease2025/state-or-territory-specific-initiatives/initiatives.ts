import {
  PageTypes,
  ReportFormFieldType,
  StepEntityType,
  StepType,
  TransformationRule,
  ValidationType,
  WPStateOrTerritorySpecificInitiativesRoute,
} from "../../../../../../utils/types";

export const initiativesRoute: WPStateOrTerritorySpecificInitiativesRoute = {
  name: "State or Territory-Specific Initiatives",
  path: "/wp/state-or-territory-specific-initiatives/initiatives",
  pageType: PageTypes.MODAL_OVERLAY,
  entityType: StepEntityType.INITIATIVE,
  entityInfo: ["initiative_name", "initiative_wpTopic"],
  verbiage: {
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
    addEntityButtonText: "Add initiative",
    editEntityHint: 'Select "Edit" to complete the details.',

    editEntityButtonText: "Edit name/topic",
    readOnlyEntityButtonText: "View name/topic",
    addEditModalAddTitle: "Add initiative",
    addEditModalEditTitle: "Edit initiative",
    deleteModalTitle: "Are you sure you want to delete this initiative?",
    deleteModalConfirmButtonText: "Yes, delete initiative",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this initiative in the MFP Work Plan.",
    enterEntityDetailsButtonText: "Edit",
    readOnlyEntityDetailsButtonText: "View",
    dashboardTitle: "Initiative total count:",
    countEntitiesInTitle: true,
    tableHeader: "Initiative name <br/> MFP Work Plan topic",
    addEditModalHint:
      "Provide the name of one initiative. You will be then be asked to complete details for this initiative including a description, evaluation plan and funding sources.",
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
  dashboard: {
    name: "Intitiative Details Dashboard",
    verbiage: {
      intro: {
        section: "State or Territory-Specific Initiatives",
        info: [
          {
            type: "span",
            content:
              "Complete each of the first 3 steps for this initiative. Step IV is to be completed when this initiative will no longer be sustained with MFP funding and/or state or territory equivalent funding, and will become available once your initiative information is complete and approved by your CMS MFP Project Officer.",
          },
        ],
      },
      closeDashboardButtonText: "Close Initiative",
    },
  },
  entitySteps: [
    {
      name: "State or Territory-Specific Initiatives: I. Define initiative",
      path: "/wp/state-or-territory-specific-initiatives/define-initiative",
      pageType: PageTypes.ENTITY_OVERLAY,
      entityType: StepEntityType.INITIATIVE,
      stepType: StepType.DEFINE_INITIATIVE,
      stepInfo: ["stepName", "hint"],
      stepName: "I. Define initiative",
      hint: "Provide initiative description, including target populations and timeframe",
      isRequired: true,
      verbiage: {
        intro: {
          section:
            "State or Territory-Specific Initiatives: I. Define initiative",
          info: [
            {
              type: "html",
              content:
                "Describe the initiative (approximately 300 words max or 1800 characters), including the gap, challenge, or opportunity it will address; key activities to achieve goals; target population; and timeframe for starting and completing the initiative.",
            },
          ],
          exportSectionHeader: "exportSectionHeader",
        },
        enterEntityDetailsButtonText: "Edit",
        readOnlyEntityDetailsButtonText: "View",
        editEntityHint: 'Select "Edit" to complete initiative definition.',
      },
      form: {
        id: "stsidi",
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
              label: "Key Activities",
              hint: "List the key activities to implement the initiative.",
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
              choices: [],
            },
          },
          {
            id: "defineInitiative_projectedStartDate",
            type: ReportFormFieldType.DATE,
            validation: ValidationType.DATE,
            props: {
              label: "Start date",
              hint: "Enter the expected or actual start month/year for the initiative. Aim for a 1-2 year period for implementation, testing, and evaluation. Explain in the initiative description if it will take longer than 2 years.",
            },
          },
          {
            id: "defineInitiative_startDateExpectedOrActual",
            type: ReportFormFieldType.RADIO,
            validation: ValidationType.RADIO,
            props: {
              label: "Is this date expected or actual?",
              choices: [
                {
                  id: "gEZeX7wqIBgNECJWohPPGJ",
                  label: "Expected",
                },
                {
                  id: "ROMVn1xYW2vHyTZPoHreYd",
                  label: "Actual",
                },
              ],
            },
          },
          {
            id: "defineInitiative_projectedEndDate",
            type: ReportFormFieldType.RADIO,
            validation: ValidationType.RADIO,
            props: {
              label: "Does the initiative have a projected end date?",
              hint: "Select 'No' if the initiative will be ongoing without a set end point.",
              choices: [
                {
                  id: "WNsSaAHeDvRD2Pjkz6DcOE",
                  label: "Yes",
                  children: [
                    {
                      id: "defineInitiative_projectedEndDate_value",
                      type: ReportFormFieldType.DATE,
                      validation: {
                        type: ValidationType.END_DATE,
                        parentOptionId:
                          "defineInitiative_projectedEndDate-WNsSaAHeDvRD2Pjkz6DcOE",
                        parentFieldName: "defineInitiative_projectedEndDate",
                        dependentFieldName:
                          "defineInitiative_projectedStartDate",
                        nested: true,
                      },
                      props: {
                        label: "Projected end date",
                        hint: "Enter the date for when the initiative will be or has been completed. A completed initiative means the initiative has been implemented, tested, and evaluated.",
                      },
                    },
                  ],
                },
                {
                  id: "TR6HoXF3Unf2QX0zzDg2Kp",
                  label: "No",
                },
              ],
            },
          },
        ],
      },
    },
    {
      name: "State or Territory-Specific Initiatives: II. Evaluation Plan",
      path: "/wp/state-or-territory-specific-initiatives/evaluation-plan",
      pageType: PageTypes.OVERLAY_MODAL,
      entityType: StepEntityType.INITIATIVE,
      stepType: StepType.EVALUATION_PLAN,
      stepInfo: ["stepName", "hint"],
      stepName: "II. Evaluation plan",
      hint: "Add evaluation plan, including measurable objectives",
      isRequired: true,
      verbiage: {
        intro: {
          section:
            "State or Territory-Specific Initiatives: II. Evaluation Plan",
          info: [
            {
              type: "html",
              content:
                "To complete your evaluation plan, create measurable objectives. Select “Add objective” button for each objective you need to add to the system.",
            },
          ],
          exportSectionHeader: "exportSectionHeader",
        },
        accordion: {
          buttonLabel: "Instructions",
          intro: [
            {
              type: "html",
              content:
                "The evaluation plan captures expected results for each state or territory-specific initiative. Recipients should identify one or more objectives per initiative and set associated performance measures or indicators to monitor progress toward each objective and evaluate success. In addition, recipients must articulate how they will achieve targets and meet milestones. For more information on developing objectives and identifying appropriate performance measures, see ",
            },
            {
              type: "externalLink",
              content:
                "“Using Data to Improve Money Follows the Person Program Performance.“",
              props: {
                href: "https://www.medicaid.gov/sites/default/files/2023-01/MFP-Technical-Assistance-Brief.pdf",
                target: "_blank",
                "aria-label":
                  "“Using Data to Improve Money Follows the Person Program Performance.“ (Link opens in new tab)",
              },
            },
            {
              type: "html",
              content:
                "<br><br><strong>Identify one or more objectives.</strong> Objectives should be framed as SMART goals and have associated time-bound measures of success, including targets or milestones. As a reminder, SMART stands for:",
            },
          ],
          list: [
            "<strong>Specific:</strong> Specifies the activities, actors, and beneficiaries",
            "<strong>Measurable:</strong> Defines how a change will be measured",
            "<strong>Achievable:</strong> Confirms the feasibility of implementing the intervention as planned",
            "<strong>Realistic/relevant:</strong> Ensures the intervention relates to the goal",
            "<strong>Time-bound:</strong> Specifies when the results are expected",
          ],
          text: "",
        },
        text: "To complete your evaluation plan, create measurable objectives. Select “Add objective” button for each objective you need to add to the system.",
        addEntityButtonText: "Add objective",
        editEntityHint: 'Select "Edit" to complete initiative evaluation plan.',
        editEntityButtonText: "Edit objective",
        readOnlyEntityButtonText: "View objective",
        addEditModalAddTitle: "Add objective for ",
        addEditModalHint:
          "Objectives should be framed as SMART goals and have associated time-bound measures of success, including targets or milestones.",
        addEditModalEditTitle: "Edit objective for ",
        deleteModalTitle: "Delete objective for this report?",
        deleteModalConfirmButtonText: "Yes, delete objective",
        deleteModalWarning:
          "You will lose all information entered for this objective. Objective will not be deleted from archived MFP Work Plans and Semi-Annual Progress Reports, but it will not be available in future MFP Work Plans and Semi-Annual Progress Reports. <br><br>Are you sure you want to proceed?",
        enterEntityDetailsButtonText: "Edit",
        readOnlyEntityDetailsButtonText: "View",
        dashboardTitle: "Objective total count",
        countEntitiesInTitle: true,
        deleteEntityButtonAltText: "",
        entityUnfinishedMessage:
          "Add the quantitative targets for the next 2 quarters by editing the objective.",
        drawerTitle: "",
      },
      modalForm: {
        id: "tb-modal",
        fields: [
          {
            id: "evaluationPlan_objectiveName",
            type: ReportFormFieldType.TEXTAREA,
            validation: ValidationType.TEXT,
            props: {
              label: "Objective",
            },
          },
          {
            id: "evaluationPlan_description",
            type: ReportFormFieldType.TEXTAREA,
            validation: ValidationType.TEXT,
            props: {
              label:
                "Describe the performance measures or indicators your state or territory will use to monitor progress toward achieving this objective, including details on the calculation of measures if relevant. Describe any key deliverables.",
              hint: "(e.g., data sources and limitations)",
            },
          },
          {
            id: "evaluationPlan_targets",
            type: ReportFormFieldType.TEXTAREA,
            validation: ValidationType.TEXT,
            props: {
              label:
                "Provide targets for the performance measures or indicators listed above. Include milestones and expected time frames for key deliverables.",
              hint: "If a performance measure includes quantitative targets, complete the quarterly fields below.",
            },
          },
          {
            id: "evaluationPlan_includesTargets",
            type: ReportFormFieldType.RADIO,
            validation: ValidationType.RADIO,
            props: {
              label:
                "Does the performance measure include quantitative targets?",
              hint: "Fields allow percentages or numbers. If you wish to report percentages, enter the number in the fields and the percentage sign “%”. Enter N/A for quarters you do not expect to report.",
              choices: [
                {
                  id: "UL4dAeyyvCFAXttxZioacR",
                  label: "No",
                },
                {
                  id: "7FP4jcg4jK7Ssqp3cCW5vQ",
                  label: "Yes",
                  children: [
                    {
                      id: "quarterlyProjections",
                      type: ReportFormFieldType.TEXT,
                      validation: {
                        type: ValidationType.TEXT,
                        parentFieldName: "evaluationPlan_includesTargets",
                        parentOptionId:
                          "evaluationPlan_includesTargets-7FP4jcg4jK7Ssqp3cCW5vQ",
                        nested: true,
                      },
                      props: {
                        className: "number-field",
                      },
                      transformation: {
                        rule: TransformationRule.NEXT_TWELVE_QUARTERS,
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "evaluationPlan_additionalDetails",
            type: ReportFormFieldType.TEXTAREA,
            validation: ValidationType.TEXT,
            props: {
              label:
                "Provide additional detail on strategies/approaches to the state or territory will use to achieve targets and/or milestones (building on the initiative description).",
              hint: "List the responsible state or territory agency parties and any key external partners for achieving this objective.",
            },
          },
        ],
      },
    },
    {
      name: "State or Territory-Specific Initiatives: III. Funding sources",
      path: "/wp/state-or-territory-specific-initiatives/funding-sources",
      pageType: PageTypes.OVERLAY_MODAL,
      entityType: StepEntityType.INITIATIVE,
      stepType: StepType.FUNDING_SOURCES,
      stepInfo: ["stepName", "hint"],
      stepName: "III. Funding sources",
      hint: "Add funding sources with projected quarterly expenditures",
      isRequired: true,
      verbiage: {
        intro: {
          section:
            "State or Territory-Specific Initiatives: III. Funding sources",
          info: [
            {
              type: "html",
              content:
                "<br>Provide projected quarterly expenditures, by funding source, for this initiative. Actual quarterly expenditures will be reported in the recipient’s MFP Semi-Annual Progress Report.</br>",
            },
          ],
          exportSectionHeader: "exportSectionHeader",
        },
        addEntityButtonText: "Add funding source",
        editEntityHint:
          'Select "Edit" to complete initiative funding information.',
        editEntityButtonText: "Edit funding source",
        readOnlyEntityButtonText: "View funding source",
        addEditModalAddTitle:
          "Add funding source and projected expenditures for ",
        addEditModalEditTitle:
          "Edit funding source and projected expenditures for ",
        deleteEntityButtonAltText: "Delete other target population",
        deleteModalTitle: "Delete funding source for this report? ",
        deleteModalConfirmButtonText: "Yes, delete funding source",
        deleteModalWarning:
          "You will lose all information entered for this funding source. Funding source will not be deleted from archived MFP Work Plans and Semi-Annual Progress Reports, but it will not be available in future MFP Work Plans and Semi-Annual Progress Reports. <br><br>Are you sure you want to proceed?",
        tableHeader: "Initiative name <br/> MFP Work Plan topic",
        addEditModalHint:
          "Provide projected quarterly expenditures, by funding source, for this initiative. Actual quarterly expenditures will be reported in the recipient’s MFP Semi-Annual Progress Report.",
        dashboardTitle: "Funding Sources",
        enterEntityDetailsButtonText: "Edit",
        readOnlyEntityDetailsButtonText: "View",
        entityUnfinishedMessage:
          "Add the projected quarterly expenditures for the next 2 quarters by editing funding source.",
        countEntitiesInTitle: true,
      },
      modalForm: {
        id: "tb-modal",
        fields: [
          {
            id: "fundingSources_wpTopic",
            type: ReportFormFieldType.RADIO,
            validation: ValidationType.RADIO,
            props: {
              label: "Funding source:",
              hint: "Enter a dollar amount. Enter 0 for quarters with no projected expenditures. Enter N/A for quarters you do not expect to report.",
              choices: [
                {
                  id: "2VLpZ9A92OivbZhKvY8pE4hB65c",
                  label:
                    "MFP cooperative agreement funds for qualified HCBS and demonstration services",
                },
                {
                  id: "2VLpZ9A92OivbZhKvY8pE4",
                  label:
                    "MFP cooperative agreement funds for supplemental services",
                },
                {
                  id: "2VLpZCNtbcjRPq3evd1NI6",
                  label:
                    "MFP cooperative agreement funds for administrative activities",
                },
                {
                  id: "2VLpZDJ9qaKKOk78ztBdiB",
                  label:
                    "MFP cooperative agreement funds for capacity-building initiatives",
                },
                {
                  id: "2VLpZCRWieGr1Z49QX5Aqc",
                  label:
                    "State or territory equivalent funds attributable to the MFP-enhanced match",
                },
                {
                  id: "2VLq8ASzZNfxbu520if529",
                  label: "Other, specify",
                  children: [
                    {
                      id: "initiative_wp_otherTopic",
                      type: ReportFormFieldType.TEXTAREA,
                      validation: {
                        type: ValidationType.TEXT,
                        nested: true,
                        parentFieldName: "fundingSources_wpTopic",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "fundingSources_quarters",
            type: ReportFormFieldType.NUMBER,
            validation: ValidationType.NUMBER,
            transformation: {
              rule: TransformationRule.NEXT_TWELVE_QUARTERS,
            },
            props: {
              mask: "currency",
            },
          },
        ],
      },
    },
    {
      name: "State or Territory-Specific Initiatives: IV. Initiative close-out information",
      path: "/wp/state-or-territory-specific-initiatives/close-out-information",
      pageType: PageTypes.ENTITY_OVERLAY,
      entityType: StepEntityType.INITIATIVE,
      stepType: StepType.CLOSE_OUT_INFORMATION,
      stepInfo: ["stepName", "hint"],
      stepName: "IV. Initiative close-out information (if applicable)",
      hint: "To be completed as appropriate during MFP Work Plan revisions",
      isRequired: true,
      verbiage: {
        intro: {
          section:
            "State or Territory-Specific Initiatives: IV. Initiative close-out information",
          info: [
            {
              type: "html",
              content:
                "Complete the section below for initiatives with an end date during the upcoming semi-annual reporting period.",
            },
          ],
        },
        closeOutWarning: {
          title: "Warning",
          description:
            'Once you select "Close out initiative", this initiative will be closed out and will no longer be editable. You will be able to continue to view this response. If you are not ready to close out an initiative, select "Save & return" and you’ll be able to save your draft data. You will not be able to close out an initiative until you complete the fields above. <br><br> This action cannot be undone.',
        },
        closeOutModal: {
          closeOutModalButtonText: "Close out initiative",
          closeOutModalTitle: "Close out ",
          closeOutModalBodyText:
            'This initiative will be closed out and will no longer be editable. You will be able to continue to view this response. If you are not ready to close out an initiative, select "Cancel" and you’ll be able to save your draft data.<br><br>This action cannot be undone.<br><br>Are you sure you want to proceed?',
          closeOutModalConfirmButtonText: "Yes, close out initiative",
        },
        enterEntityDetailsButtonText: "Edit",
        readOnlyEntityDetailsButtonText: "View",
      },
      form: {
        id: "sauxM9MnFZhIn5W44WY3BG",
        fields: [
          {
            id: "defineInitiative_projectedEndDate_value",
            type: ReportFormFieldType.DATE,
            validation: ValidationType.TEXT_OPTIONAL,
            props: {
              label: "Projected end date",
              hint: "Auto-populates from “I. Define initiative”.",
              disabled: true,
            },
          },
          {
            id: "closeOutInformation_actualEndDate",
            type: ReportFormFieldType.DATE,
            validation: ValidationType.DATE,
            props: {
              label: "Actual end date",
            },
          },
          {
            id: "closeOutInformation_initiativeStatus",
            type: ReportFormFieldType.CHECKBOX,
            validation: ValidationType.CHECKBOX,
            props: {
              label:
                "For initiatives that will no longer be sustained with MFP funding or state or territory-equivalent funding, indicate the status below:",
              hint: "Select all that apply.",
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
    },
  ],
};
