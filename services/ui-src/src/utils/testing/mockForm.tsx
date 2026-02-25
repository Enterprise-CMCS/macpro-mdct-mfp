import {
  DynamicModalOverlayReportPageShape,
  DynamicValidationType,
  FormJson,
  FormTableType,
  OverlayModalPageShape,
  ReportFormFieldType,
  ReportPageProgress,
  ValidationType,
} from "types";

export const mockFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockNumberField = {
  id: "mock-number-field",
  type: "number",
  validation: "number",
  props: {
    label: "mock number field",
  },
};

export const mockPlanField = {
  id: "plans",
  type: "dynamic",
  validation: "dynamic",
  props: {
    label: "Plan name",
  },
};

export const mockDateField = {
  id: "mock-date-field",
  type: "date",
  validation: "date",
  props: {
    label: "mock date field",
  },
};

export const mockDropdownField = {
  id: "mock-dropdown-field",
  type: "dropdown",
  validation: "dropdown",
  props: {
    label: "mock dropdown field",
    options: "mock plans",
    ariaLabel: "mock dropdown field",
  },
};

export const mockModalFormField = {
  id: "mock-modal-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock modal text field",
  },
};

export const mockDrawerFormField = {
  id: "mock-drawer-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock drawer text field",
  },
};

export const mockNestedFormField = {
  id: "mock-nested-field",
  type: "radio",
  validation: "radio",
  props: {
    label: "mock radio field",
    choices: [
      { id: "option1uuid", label: "option 1" },
      { id: "option2uuid", label: "option 2" },
      {
        id: "option3uuid",
        label: "option 3",
        children: [mockFormField],
      },
    ],
  },
};

export const mockTransitionBenchmarkFormField = {
  id: "transitionBenchmarks_targetPopulationName",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockFundingSourceFormField = {
  id: "fundingSources_wpTopic",
  type: "radio",
  validation: "radio",
  props: {
    label: "mock radio field",
    choices: [
      { id: "option1uuid", label: "option 1" },
      { id: "option2uuid", label: "option 2" },
      {
        id: "option3uuid",
        label: "option 3",
        children: [mockFormField],
      },
    ],
  },
};

export const mockSectionHeaderField = {
  type: "sectionHeader",
  id: "testfield",
  props: {
    divider: "top",
    content: "Test Content",
  },
};

export const mockTablesField = {
  id: "mock-number-field",
  type: "number",
  validation: "number",
  forTableOnly: true,
  props: {
    label: "mock number field",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField, mockDateField, mockNumberField],
};

export const mockModalForm = {
  id: "mock-modal-form-id",
  fields: [mockModalFormField],
};

export const mockTransitionBenchmarkModalForm = {
  id: "mock-transition-benchmark-modal-form-id",
  fields: [mockTransitionBenchmarkFormField],
};

export const mockDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [mockDrawerFormField],
};

export const mockEmptyDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [],
};

export const mockTablesForm = {
  id: "mock-tables-form-id",
  tables: [
    {
      id: "mock-table-id",
      bodyRows: [["Mock text", mockTablesField]],
      footRows: [["Footer 1", "Footer 2"]],
      headRows: [["Heading 1", "Heading 2"]],
      tableType: FormTableType.CALCULATION,
      verbiage: {
        errorMessage: "Mock error",
        percentage: "Mock Percentage: {{percentage}}",
        title: "Mock table title",
      },
    },
  ],
  fields: [mockTablesField, mockFormField],
  verbiage: {
    title: "Mock verbiage title",
  },
};

export const mockBadTablesForm = {
  ...mockTablesForm,
  tables: [
    {
      tableType: "badType",
    },
  ],
};

export const mockAccordion = {
  buttonLabel: "Instructions",
  intro: [
    {
      type: "text",
      as: "span",
      content: "<b>Bold Instructions</b>",
    },
    {
      type: "text",
      as: "span",
      content: "More instructions",
    },
  ],
  list: [`List Item 1`, "List Item 2", `List Item 3`],
  text: "Additional Text",
};

export const mockVerbiageIntro = {
  section: "mock section",
  subsection: "mock subsection",
  spreadsheet: "mock item",
  info: [
    {
      type: "html",
      content: "mock html",
    },
  ],
  editEntityButtonText: "Edit",
  readOnlyEntityButtonText: "View",
  enterReportText: "Enter Details",
};

export const mockOverlayModalVerbiageIntro = {
  section: "mock section",
  subsection: "mock subsection",
  info: [
    {
      type: "html",
      content: "mock html",
    },
  ],
  exportSectionHeader: "exportSectionHeader",
};

export const mockStandardReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockForm,
};

export const mockDrawerReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "entityType",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockDrawerForm,
};

export const mockModalDrawerReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  addEntityButtonText: "Mock add entity button text",
  editEntityButtonText: "Mock edit entity button text",
  readOnlyEntityButtonText: "Mock read-only entity button text",
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  readOnlyEntityDetailsButtonText: "Mock read-only entity details button text",
  drawerTitle: "Mock drawer title",
  reviewPdfHint: "Mock review PDF hint",
  drawerNoFormMessage: "Mock no form fields here",
};

export const mockOverlayModalPageVerbiage = {
  intro: mockOverlayModalVerbiageIntro,
  accordion: mockAccordion,
  text: "Mock instructions text",
  dashboardTitle: "Mock dashboard title",
  addEntityButtonText: "Mock add entity button text",
  editEntityButtonText: "Mock edit entity button text",
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  addEditModalHint: "Mock hint",
  addEditModalMessage: "Mock add/edit entity modal message",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityUnfinishedMessage: "Mock entity unfinished message",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  readOnlyEntityDetailsButtonText: "Mock read-only entity details button text",
  drawerTitle: "Mock drawer title",
  countEntitiesInTitle: true,
};

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: "entityType",
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};

export const mockTargetPopulationsModalFormField = {
  id: "mock-modal",
  fields: [
    {
      id: "transitionBenchmarks_targetPopulationName",
      type: "text",
      validation: "text",
      props: {
        label: "mock modal text field",
      },
    },
  ],
};

export const mockTargetPopulationsDrawerFormField = {
  id: "mock-drawer",
  fields: [
    {
      id: "transitionBenchmarks_applicableToMfpDemonstration",
      props: {
        choices: [
          { id: "mock-choice-1", label: "No" },
          {
            id: "mock-choice-2",
            label: "Yes",
            children: [
              { id: "mock-child-1", props: { label: "child", type: "number" } },
            ],
          },
        ],
        label: "mock drawer text field",
      },
      type: "radio",
      validation: "radio",
    },
  ],
};

export const mockTargetPopulationsReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: "targetPopulations",
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockTargetPopulationsModalFormField,
  drawerForm: mockTargetPopulationsDrawerFormField,
};

export const mockEntityDetailsOverlayVerbiage = {
  intro: mockVerbiageIntro,
  closeOutWarning: {
    title: "Warning",
    description: "This is a warning",
  },
  closeOutModal: {
    closeOutModalButtonText: "Close out modal",
    closeOutModalTitle: "Modal title ",
    closeOutModalBodyText: "This is a modal",
    closeOutModalConfirmButtonText: "Confirm",
  },
};

export const mockEntityDetailsOverlayJson = {
  name: "mock-route-entity-overlay",
  path: "/mock/mock-route-entity-overlay",
  pageType: "entityOverlay",
  verbiage: mockEntityDetailsOverlayVerbiage,
  entities: [],
  form: mockForm,
  stepType: "mock-step",
  stepName: "Mock step name",
  stepInfo: ["name", "hint"],
  hint: "Mock hint",
  entityType: "mock-entity-type",
};

export const mockEntityDetailsDashboardOverlayJson = {
  verbiage: mockEntityDetailsOverlayVerbiage,
  name: "mock name",
  path: "/mock/mock-route-entity-dashboard-overlay",
  entitySteps: [
    {
      name: "mock-route-entity-dashboard-overlay",
      path: "/mock/mock-route-entity-dasboard-overlay",
      pageType: "entityOverlay",
      entityType: "mock entity type",
      stepType: "mock step type",
      stepName: "mock step name",
      stepInfo: ["mock step info"],
      hint: "Mock hint",
      isRequired: "false",
      verbiage: mockEntityDetailsOverlayVerbiage,
      form: mockForm,
      entities: [],
    },
  ],
};

export const mockObjectiveCards = [
  {
    modalForm: {
      id: "mock-obj-card-1",
      fields: [
        {
          id: "objectivesProgress_performanceMeasuresIndicators",
          type: "textarea",
          validation: "text",
          props: {
            label: "mock-performance-indicators",
          },
        },
        {
          id: "objectiveTargets_actual_2024Q1",
          type: "number",
          validation: "number",
          props: {
            label: "mock-actual-2024-1",
          },
        },
        {
          id: "objectiveTargets_projections_2024Q1",
          type: "number",
          validation: "number",
          props: {
            label: "mock-projected-2024-1",
            hint: "Auto-populates from Work Plan.",
            disabled: true,
          },
        },
      ],
      initiativeId: "mock-initative-id",
      objectiveId: "mock-objective-1",
    },
  },
  {
    modalForm: {
      id: "stsiop-modal",
      fields: [
        {
          id: "objectivesProgress_performanceMeasuresIndicators",
          type: "textarea",
          validation: "text",
          props: {
            label: "mock-performance-indicators",
          },
        },
        {
          id: "objectiveTargets_actual_2024Q1",
          type: "number",
          validation: "number",
          props: {
            label: "mock-actual-2024-1",
          },
        },
        {
          id: "objectiveTargets_projections_2024Q1",
          type: "number",
          validation: "number",
          props: {
            label: "mock-projected-2024-1",
            hint: "Auto-populates from Work Plan.",
            disabled: true,
          },
        },
      ],
      initiativeId: "mock-initiative-id",
      objectiveId: "mock-objective-2",
    },
  },
];

export const mockOptionalFormField = {
  id: "mock-optional-text-field",
  type: "text",
  validation: "textOptional",
  props: {
    label: "mock optional field",
    hint: "optional Details",
    styleAsOptional: true,
  },
};

export const mockModalOverlayReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  dashboardSubtitle: "Mock dashboard subtitle",
  addEditModalHint: "Mock modal hint",
  countEntitiesInTitle: true,
  tableHeader: "Mock table header",
  addEntityButtonText: "Mock add entity button text",
  emptyDashboardText: "Mock empty dashboard text",
  editEntityButtonText: "Mock edit entity button text",
  readOnlyEntityButtonText: "Mock read-only entity button text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  enterReportText: "Mock enter report text",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  addEditModalEditTitle: "Mock AddEdit Modal Text",
  reportProgressButtonText: "Mock report progress button text",
};

export const mockModalOverlayForm = {
  id: "mock-modal-overlay-form-id",
  fields: [mockFormField, mockNumberField, mockOptionalFormField],
};

export const mockOverlayModalPageJson2 = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "overlayModal",
  entityType: "entityType",
  entitySteps: [
    {
      entityType: "initiative",
      hint: "Provide initiative description, including target populations and timeframe",
      isRequired: true,
      name: "State or Territory-Specific Initiatives: I. Define initiative",
      pageType: "entityOverlay",
      path: "/wp/state-or-territory-specific-initiatives/define-initiative",
      stepInfo: ["stepName", "hint"],
      stepName: "I. Define initiative",
      stepType: "defineInitiative",
      verbiage: mockModalOverlayReportPageVerbiage,
      modalForm: mockModalForm,
    },
    {
      entityType: "initiative",
      hint: "Provide initiative description, including target populations and timeframe",
      isRequired: true,
      name: "State or Territory-Specific Initiatives: I. Define initiative",
      pageType: "entityOverlay",
      path: "/wp/state-or-territory-specific-initiatives/define-initiative",
      stepInfo: ["stepName", "hint"],
      stepName: "I. Define initiative",
      stepType: "defineInitiative",
      verbiage: mockModalOverlayReportPageVerbiage,
      modalForm: mockModalForm,
    },
  ],
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalForm,
  entityInfo: ["initiative_name", "initiative_wpTopic"],
  overlayForm: mockModalOverlayForm,
};

export const mockOverlayModalPageJson = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "overlayModal",
  entityType: "entityType",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalForm,
  stepType: "evaluationPlan",
  stepName: "Mock step name",
  stepInfo: ["name", "hint"],
  hint: "Mock hint",
};

export const mockOverlayModalWithCardsPageJson = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "overlayModal",
  entityType: "entityType",
  verbiage: mockModalOverlayReportPageVerbiage,
  objectiveCards: mockObjectiveCards,
  modalForm: mockModalForm,
  stepType: "objectiveProgress",
  stepName: "Mock step name",
  stepInfo: ["name", "hint"],
  hint: "Mock hint",
};

export const mockUnknownPageJson = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "UNKNOWN_PAGE_TYPE",
  entityType: "entityType",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalForm,
  stepType: "mock-step",
  stepName: "Mock step name",
  stepInfo: ["name, hint"],
  hint: "Mock hint",
};

export const mockModalOverlayReportPageJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: "entityType",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
  entity: {},
};

export const mockOverlayModalReportPageJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "overlayModal",
  entityType: "entityType",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
  entity: {},
};

export const mockDynamicModalOverlayReportPageJson = {
  name: "mock-route-2e",
  path: "/mock/mock-route-2e",
  pageType: "dynamicModalOverlay",
  entityType: "entityType",
  entityInfo: [""],
  verbiage: mockModalOverlayReportPageVerbiage,
  initiatives: [
    {
      initiativeId: "mock-entity-id", // which matches the mock entity
      name: "",
      topic: "",
      dashboard: {
        verbiage: {
          intro: {
            section: "State or Territory-Specific Initiatives",
            info: [
              {
                type: "html",
                content:
                  "Report progress for each objective by selecting the button for each.",
              },
            ],
            dashboardTitle: "Objectives progress",
          },
        },
      } as unknown as FormJson,
      entitySteps: [
        {
          modalForm: mockModalOverlayForm as FormJson,
        } as OverlayModalPageShape,
      ],
    },
  ],
} as DynamicModalOverlayReportPageShape;

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};

export const mockTableRowPage = {
  name: "Transition Benchmarks",
  path: "/wp/transition-benchmarks",
  children: [] as ReportPageProgress[],
  status: true,
};

export const mockRETTableRowPage = {
  name: "Number of HCBS participants admitted to a facility from the community, by length of stay and age group",
  path: "/sar/recruitment-enrollment-transitions/number-of-hcbs-participants-admitted-to-facility-from-community",
};

export const mockChildRowPage = {
  name: "State or Territory-Specific Initiatives",
  path: "/wp/state-or-territory-specific-initiatives/initiatives",
  children: [] as ReportPageProgress[],
  status: true,
};

export const mockInitiativesSpecificDynamicModalOverlayReportPageJson = {
  name: "mock-initiatives-route",
  path: "/wp/state-or-territory-specific-initiatives/initiatives",
  pageType: "dynamicModalOverlay",
  entityType: "entityType",
  entityInfo: [""],
  verbiage: mockModalOverlayReportPageVerbiage,
  initiatives: [
    {
      initiativeId: "mock-entity-id", // which matches the mock entity
      name: "",
      topic: "",
      dashboard: {
        verbiage: {
          intro: {
            section: "State or Territory-Specific Initiatives",
            info: [
              {
                type: "html",
                content:
                  "Report progress for each objective by selecting the button for each.",
              },
            ],
            dashboardTitle: "Objectives progress",
          },
        },
      } as unknown as FormJson,
      entitySteps: [
        {
          modalForm: mockModalOverlayForm as FormJson,
        } as OverlayModalPageShape,
      ],
    },
  ],
} as DynamicModalOverlayReportPageShape;

export const mockFormId = "mockFormId";
export const mockTableId = `${mockFormId}_mockTableId`;
export const mockFieldId = `${mockTableId}_mockFieldId`;
export const mockDynamicFieldId = "123a-456b-789c";
export const mockDynamicTemplateId = `${mockTableId}_mockDynamicFieldId`;
export const mockTempDynamicFieldId = `tempDynamicField_${mockDynamicTemplateId}_${mockDynamicFieldId}`;

export const mockDynamicRowsTemplate = {
  id: mockDynamicTemplateId,
  type: ReportFormFieldType.DYNAMIC_OBJECT,
  validation: {
    type: ValidationType.DYNAMIC_OPTIONAL,
    options: {
      dynamicFields: {
        category: DynamicValidationType.TEXT_OPTIONAL,
        number: DynamicValidationType.NUMBER_OPTIONAL,
      },
    },
  },
  props: {
    dynamicFields: [
      {
        id: `${mockDynamicTemplateId}-totalComputable`,
        type: ReportFormFieldType.NUMBER,
        validation: DynamicValidationType.NUMBER_OPTIONAL,
        props: {
          mask: "currency",
          dynamicLabel: "Other:",
        },
      },
    ],
  },
  verbiage: {
    buttonText: "Mock dynamic row button",
    hint: "Mock dynamic row hint",
  },
};
