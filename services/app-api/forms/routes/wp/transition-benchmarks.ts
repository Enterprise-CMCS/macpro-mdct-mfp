import {
  PageTypes,
  ReportFormFieldType,
  StepEntityType,
  TransformationRule,
  ValidationType,
  WPTransitionBenchmarksRoute,
} from "../../../utils/types";

export const transitionBenchmarksRoute: WPTransitionBenchmarksRoute = {
  name: "Transition Benchmarks",
  path: "/wp/transition-benchmarks",
  pageType: PageTypes.MODAL_DRAWER,
  entityType: StepEntityType.TARGET_POPULATIONS,
  entityInfo: ["transitionBenchmarks_targetPopulationName"],
  verbiage: {
    accordion: {
      buttonLabel: "Considerations around target populations",
      intro: [
        {
          type: "html",
          content:
            "An approach for defining target populations should be outlined in your Operational Protocol. Those definitions should be used to report the transition benchmarks. You may need to track some populations outside of these categories to see utilization to address questions from stakeholders and those circumstances should be discussed with your CMS MFP Project Officer. <br><br> In the next section, you will be asked to describe your state or territory-specific initiatives, which may inform which target populations you include here when you think about who is being served by your different planned initiatives. <br><br>Additional information on strategies to achieve transition targets will be included in the state or territory-specific initiative on transitions and transition coordination services in the next section.",
        },
      ],
    },
    intro: {
      section: "",
      subsection: "Transition Benchmark Projections",
      info: [
        {
          type: "html",
          content:
            "Provide the projected number of transitions for each target population during each quarter. This number includes qualified institutional residents who enroll in MFP, and are anticipated to be discharged from an institution to a qualified residence during the reporting period in the quarter.",
        },
      ],
    },
    dashboardTitle:
      "Report projected number of transitions for each target population",
    pdfDashboardTitle: "Transition Benchmark Totals",
    addEntityButtonText: "Add other target population",
    editEntityButtonText: "Edit name",
    readOnlyEntityButtonText: "View name",
    addEditModalAddTitle: "Add other target population",
    addEditModalEditTitle: "Edit other target population",
    deleteEntityButtonAltText: "Delete other target population",
    deleteModalTitle: "Are you sure you want to delete this target population?",
    deleteModalConfirmButtonText: "Yes, delete population",
    deleteModalWarning:
      "Are you sure you want to proceed? You will lose all information entered for this population in the MFP Work Plan. The population will remain in previously submitted MFP Semi-Annual Progress Reports if applicable.",
    entityUnfinishedMessage:
      "Complete the remaining indicators for this access measure by entering details.",
    enterEntityDetailsButtonText: "Edit",
    readOnlyEntityDetailsButtonText: "View",
    reviewPdfHint:
      'To view Transition Benchmark Totals by target population and by quarter, click "Review PDF" and it will open a summary in a new tab.',
    drawerTitle: "Report transition benchmarks for ",
    drawerInfo: [
      {
        type: "span",
        content:
          "Provide the projected number of transitions for the target population during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid home and community-based services (HCBS).",
      },
      {
        type: "p",
        content:
          'Complete all fields and select the "Save & close" button to save this section.',
      },
    ],
  },
  modalForm: {
    id: "tb-modal",
    fields: [
      {
        id: "transitionBenchmarks_targetPopulationName",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "Target population name",
          hint: 'Specify an "other" target population applicable to your MFP Demonstration project. (e.g., HIV/AIDS, brain injury).',
        },
      },
    ],
  },
  drawerForm: {
    id: "tb-drawer",
    fields: [
      {
        id: "transitionBenchmarks_applicableToMfpDemonstration",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label:
            "Is this target population applicable to your MFP Demonstration?",
          hint: "Enter 0 for quarters with no projected transitions. Enter N/A for quarters you do not expect to report.",
          choices: [
            {
              id: "2UObIwERkSKEGVUU1g8E1v",
              label: "No",
            },
            {
              id: "2UObIuHjl15upf6tLcgcWd",
              label: "Yes",
              children: [
                {
                  id: "quarterlyProjections",
                  type: ReportFormFieldType.NUMBER,
                  validation: {
                    type: ValidationType.VALID_INTEGER,
                    parentFieldName:
                      "transitionBenchmarks_applicableToMfpDemonstration",
                    parentOptionId:
                      "transitionBenchmarks_applicableToMfpDemonstration-2UObIuHjl15upf6tLcgcWd",
                    nested: true,
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
    ],
  },
};
