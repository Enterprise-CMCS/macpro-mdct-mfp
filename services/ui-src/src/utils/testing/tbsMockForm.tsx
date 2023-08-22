export const mockFormField = {
  id: "mock-text-field",
  type: "textarea",
  validation: "text",
  props: {
    label:
      "Explain how you formulated your projected numbers, which should include descriptions of the data sources used, the time period for the analysis, and the methods used to project the number of transitions.",
  },
};

export const mockFormField2 = {
  id: "mock-text-field",
  type: "textarea",
  validation: "text",
  props: {
    label:
      "Provide additional detail on strategies or approaches the state or territory will use to achieve transition targets here and through a required state or territory specific initiative.",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField, mockFormField2],
};

export const mockVerbiageIntro = {
  section: "",
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

export const mockVerbaigeIntro = {
  section: "",
  subsection: "Transition Benchmark Strategy",
  spreadsheet: "",
  info: [
    {
      type: "html",
      content: "",
    },
  ],
  editEntityButtonText: "Edit",
  enterReportText: "Enter Details",
};

export const mockStandardTBSReportPageJson = {
  name: "transition-benchmark-strategy",
  path: "/wp/transition-benchmark-strategy",
  pageType: "standard",
  verbiage: {
    intro: mockVerbaigeIntro,
  },
  form: mockForm,
};

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};
