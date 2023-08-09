export const mockFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField],
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

export const mockStandardReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockForm,
};
