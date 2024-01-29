import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  mockDrawerReportPageJson,
  mockFormField,
  mockNestedFormField,
  mockWpReportContext,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";
import { ReportContext } from "components";
import { ExportedReportFieldTable } from "./ExportedReportFieldTable";
import { DrawerReportPageShape, FormField, FormLayoutElement } from "types";
import sarVerbiage from "verbiage/pages/sar/sar-export";

// Contexts
const reportJsonFields = [{ ...mockNestedFormField, id: "parent" }];
const fieldData = {
  parent: [{ key: "parent-option3uuid", value: "option 3" }],
  child: "testAnswer",
};

const nestedParent = mockNestedFormField;
nestedParent.props.choices[2].children = [{ ...mockFormField, id: "child" }];

const mockStandardContext = { ...mockWpReportContext };
mockStandardContext.report = { ...mockStandardContext.report };
mockStandardContext.report.fieldData = {
  ...mockStandardContext.report.fieldData,
  ...fieldData,
};

const mockDrawerContext = { ...mockWpReportContext };
mockWpReportContext.report = { ...mockWpReportContext.report };
mockDrawerContext.report.fieldData = {
  ...mockDrawerContext.report.fieldData,
};

// Report JSON
const mockStandardPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: reportJsonFields,
  },
};
const mockDrawerPageJson = {
  ...mockDrawerReportPageJson,
  drawerForm: { id: "drawer", fields: reportJsonFields },
};
const mockEmptyPageJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "standard",
    fields: [],
  },
};

const hintJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "not-apoc",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

const generalInformationJson = {
  ...mockStandardReportPageJson,
  form: {
    id: "not-apoc",
    fields: [
      {
        ...mockFormField,
        props: {
          label: "X. Mock Field label",
          hint: "Mock Hint Text",
        },
      },
    ],
  },
};

// get the range of form fields for a particular section
const mockGetSectionFormFields = (
  heading: number,
  formFields: (FormField | FormLayoutElement)[]
) => {
  let fields: (FormField | FormLayoutElement)[] = [];
  switch (heading) {
    case 0:
      fields = formFields.slice(0, 1);
      break;
    case 1:
      fields = formFields.slice(1, 6);
      break;
    case 2:
      fields = formFields.slice(6, 10);
      break;
    case 3:
      fields = formFields.slice(10, 13);
      break;
    case 4:
      fields = formFields.slice(13);
      break;
  }
  return fields;
};

const exportedStandardTableComponent = (
  <ReportContext.Provider value={mockStandardContext}>
    <ExportedReportFieldTable section={mockStandardPageJson} />
  </ReportContext.Provider>
);
const exportedDrawerTableComponent = (
  <ReportContext.Provider value={mockDrawerContext}>
    <ExportedReportFieldTable
      section={mockDrawerPageJson as DrawerReportPageShape}
    />
  </ReportContext.Provider>
);
const emptyTableComponent = (
  <ReportContext.Provider value={mockDrawerContext}>
    <ExportedReportFieldTable section={mockEmptyPageJson} />
  </ReportContext.Provider>
);

const hintComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportFieldTable section={hintJson} />
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportedStandardTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles drawer pages with children", async () => {
    render(exportedDrawerTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles a table with no form fields", async () => {
    render(emptyTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("shows the hint text in most cases", async () => {
    render(hintComponent);
    const hint = screen.queryByText(/Mock Hint Text/);
    expect(hint).toBeVisible();
  });

  test("shows the correct section form fields based on heading", async () => {
    const mockHeadings = sarVerbiage.generalInformationTable.headings;
    const getSectionFormFields = mockHeadings.map((heading) => {
      return mockGetSectionFormFields(
        mockHeadings.indexOf(heading),
        generalInformationJson.form.fields
      );
    });

    const result = [
      [
        {
          id: "mock-text-field",
          props: { hint: "Mock Hint Text", label: "X. Mock Field label" },
          type: "text",
          validation: "text",
        },
      ],
      [],
      [],
      [],
      [],
    ];

    await expect(getSectionFormFields).toEqual(result);
  });
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
