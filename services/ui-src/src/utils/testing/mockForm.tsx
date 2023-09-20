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

export const mockDynamicForm = {
  id: "mock-dynamic-form-id",
  type: "dynamic",
  validation: "dynamic",
  props: {
    label: "mock dynamic field",
  },
  fields: [mockPlanField],
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

export const mockSectionHeaderField = {
  type: "sectionHeader",
  id: "testfield",
  props: {
    divider: "top",
    content: "Test Content",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [
    mockFormField,
    mockDateField,
    mockDynamicForm,
    mockDropdownField,
    mockNumberField,
  ],
};

export const mockModalForm = {
  id: "mock-modal-form-id",
  fields: [mockModalFormField],
};

export const mockDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [mockDrawerFormField],
};

export const mockEmptyDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [],
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
  entityType: "plans",
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
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
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
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  drawerTitle: "Mock drawer title",
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

export const mockEntityDetailsOverlayVerbiage = {
  intro: mockVerbiageIntro,
  closeOutWarning: {
    title: "Warning",
    description: "This is a warning",
  },
  closeOutModal: {
    closeOutModalButtonText: "Close out modal",
    closeOutModalTitle: "Modal title",
    closeOutModalBodyText: "This is a modal",
    closeOutModalConfirmButtonText: "Confirm",
  },
};

export const mockEntityDetailsOverlayJson = {
  name: "mock-route-entity-overlay",
  path: "/mock/mock-route-entity-overlay",
  pageType: "entityOverlay",
  verbiage: mockEntityDetailsOverlayVerbiage,
  form: mockForm,
};

export const mockOverlayModalPageJson = {
  name: "mock-route-2d",
  path: "/mock/mock-route-2d",
  pageType: "overlayModal",
  entityType: "entityType",
  verbiage: mockOverlayModalPageVerbiage,
  modalForm: mockModalForm,
};

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

export const mockModalOverlayForm = {
  id: "mock-modal-overlay-form-id",
  fields: [mockFormField, mockNumberField, mockOptionalFormField],
};

export const mockModalOverlayReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  addEditModalHint: "Mock modal hint",
  countEntitiesInTitle: true,
  tableHeader: "Mock table header",
  addEntityButtonText: "Mock add entity button text",
  emptyDashboardText: "Mock empty dashboard text",
  editEntityButtonText: "Mock edit entity button text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  enterReportText: "Mock enter report text",
};

export const mockModalOverlayReportPageJson = {
  name: "mock-route-2c",
  path: "/mock/mock-route-2c",
  pageType: "modalOverlay",
  entityType: "program",
  verbiage: mockModalOverlayReportPageVerbiage,
  modalForm: mockModalOverlayForm,
  overlayForm: mockModalOverlayForm,
};

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};
