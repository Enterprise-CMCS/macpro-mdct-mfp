import { ModalDrawerReportPageShape } from "types";

export const mockVerbiage = {
  intro: {
    section: "",
    subsection: "Transition Benchmark Projections",
    info: [
      {
        type: "span",
        content:
          "Provide the projected number of transitions for target populations during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and being using Medicaid home and community-based services (HCBS).",
      },
    ],
  },
  dashboardTitle:
    "Report projected number of transitions for each target population",
  addEntityButtonText: "Add other target population",
  editEntityButtonText: "Edit name",
  addEditModalAddTitle: "Add other target population",
  addEditModalEditTitle: "Edit other target population",
  deleteEntityButtonAltText: "Delete other target population",
  deleteModalTitle: "Are you sure you want to delete this target population?",
  deleteModalConfirmButtonText: "Yes, delete population",
  deleteModalWarning:
    "Are you sure you want to proceed? You will lose all information entered for this population in the Work Plan. The population will remain in previously submitted Semi-Annual Reports if applicable.",
  entityUnfinishedMessage:
    "Complete the remaining indicators for this access measure by entering details.",
  enterEntityDetailsButtonText: "Edit",
  reviewPdfHint:
    "To view Transition Benchmark Totals by target population and by quarter, click <i>Review PDF</i> and it will open a summary in a new tab.",
  drawerTitle: "Report transition benchmarks for ",
  drawerInfo: [
    {
      type: "span",
      content:
        "Please provide the projected number of transitions for <i>[entity_name]</i> during each quarter. This number includes institutional residents who are discharged from an institution to a qualified residence during the reporting period, enroll in MFP, and begin using Medicaid HCBS.",
    },
    {
      type: "p",
      content:
        "Complete all fields and select the Save & close button to save this section.",
    },
  ],
};

export const mockModalForm = {
  id: "tb-modal",
  fields: [
    {
      id: "transitionBenchmarks_targetPopulationName",
      type: "text",
      validation: "text",
      props: {
        label: "Target population name",
        hint: 'Specify an "other" target population applicable to your MFP demonstration project. Individuals reported under this population must align throughout MFP. (e.g., HIV/AIDS, brain injury)',
      },
    },
  ],
};

export const mockDrawerForm = {
  id: "tb-drawer",
  fields: [
    {
      id: "transitionBenchmarks_applicableToMfpDemonstration",
      type: "radio",
      validation: "radio",
      props: {
        label:
          "Is this target population applicable to your MFP demonstration?",
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
                id: "quarterlyProjections_1",
                type: "number",
                validation: {
                  type: "number",
                  nested: true,
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2023 Q4",
                },
              },
              {
                id: "quarterlyProjections_2",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2024 Q1",
                },
              },
              {
                id: "quarterlyProjections_3",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2024 Q2",
                },
              },
              {
                id: "quarterlyProjections_4",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2024 Q3",
                },
              },
              {
                id: "quarterlyProjections_5",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2024 Q4",
                },
              },
              {
                id: "quarterlyProjections_6",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2025 Q1",
                },
              },
              {
                id: "quarterlyProjections_7",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2025 Q2",
                },
              },
              {
                id: "quarterlyProjections_7",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2025 Q2",
                },
              },
              {
                id: "quarterlyProjections_8",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2025 Q3",
                },
              },
              {
                id: "quarterlyProjections_9",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2025 Q4",
                },
              },
              {
                id: "quarterlyProjections_10",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2026 Q1",
                },
              },
              {
                id: "quarterlyProjections_11",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2026 Q2",
                },
              },
              {
                id: "quarterlyProjections_12",
                type: "number",
                validation: {
                  type: "numberOptional",
                  nested: "true",
                  parentFieldName:
                    "transitionBenchmarks_applicableToMfpDemonstration",
                  parentOptionId: "2UObIuHjl15upf6tLcgcWd",
                },
                props: {
                  label: "2026 Q3",
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

export const mockTransitionsBenchmarkForm: ModalDrawerReportPageShape = {
  entityType: "targetPopulations",
  name: "transition-benchmarks",
  path: "/wp/transition-benchmarks",
  pageType: "modalDrawer",
  verbiage: mockVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};
