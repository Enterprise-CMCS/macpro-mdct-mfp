export const mockFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
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
  fields: [mockFormField],
};

export const mockModalForm = {
  id: "mock-modal-form-id",
  fields: [mockModalFormField],
};

export const mockDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [mockDrawerFormField],
};

export const mockNonFieldForm = {
  id: "mock-non-form-id",
  fields: [mockSectionHeaderField],
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

export const mockModalDrawerReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  addEntityButtonText: "Mock add entity button text",
  editEntityButtonText: "Mock edit entity button text",
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  addEditModalMessage: "Mock add/edit entity modal message",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  editEntityDetailsButtonText: "Mock edit entity details button text",
  drawerTitle: "Mock drawer title",
  drawerNoFormMessage: "Mock no form fields here",
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

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: "accessMeasures",
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};
