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
  fields: [],
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
