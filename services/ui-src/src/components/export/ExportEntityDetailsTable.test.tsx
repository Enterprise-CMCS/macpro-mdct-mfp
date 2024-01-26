//testing lib
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ExportEntityDetailsTable } from "./ExportEntityDetailsTable";
import { formatHeaderLabel, formatColumns } from "./ExportEntityDetailsTable";
//utils
import { mockSARFullReport } from "utils/testing/setupJest";
import { AnyObject, EntityShape } from "types";

const expenditureRows = {
  ["row 1"]: [
    { label: "Actual Spending (First quarter: Mock)", value: 2 },
    { label: "Projected Spending (First quarter: Mock)", value: 6 },
    { label: "Actual Spending (Second quarter: Mock)", value: 2 },
    { label: "Projected Spending (Second quarter: Mock)", value: 6 },
  ],
  ["row 2"]: [
    { label: "Actual Spending (First quarter: Mock)", value: 4 },
    { label: "Projected Spending (First quarter: Mock)", value: 8 },
    { label: "Actual Spending (Second quarter: Mock)", value: 8 },
    { label: "Projected Spending (Second quarter: Mock)", value: 12 },
  ],
};

const section: AnyObject = {
  form: {
    fields: [
      {
        id: "mock-section-1",
        props: { content: "row 1" },
        type: "sectionHeader",
      },
      {
        id: "mock-id-1",
        props: { label: "column 1" },
        type: "number",
      },
      {
        id: "mock-id-2",
        props: {
          label: "column 2",
        },
        type: "number",
      },
    ],
  },
  name: "mock table name",
};

const entity: EntityShape = {
  id: "mock-id",
  "mock-id-1": "4",
  "mock-id-2": "8",
  type: "targetPopulations",
};

describe("Test table functions specific for Expenditures", () => {
  test("Test formatHeaderLabel functionality", () => {
    const headerLabels: string[] = expenditureRows["row 1"].map(
      (row) => row.label
    );
    const formattedHeaderLabels = headerLabels.map((label) =>
      formatHeaderLabel("expenditures", label, mockSARFullReport)
    );
    expect(formattedHeaderLabels).toStrictEqual([
      "Actual Spending 2023 Q1",
      "Projected Spending 2023 Q1",
      "Actual Spending 2023 Q2",
      "Projected Spending 2023 Q2",
    ]);
  });
  test("Test formatColumns functionality", () => {
    formatColumns(expenditureRows, "expenditures");
    expect(expenditureRows["row 1"][2]).toStrictEqual({
      label: "Total actual spending",
      value: "$4",
    });
    expect(expenditureRows["row 1"][5]).toStrictEqual({
      label: "% of total projected spending",
      value: "33.33%",
    });
    expect(expenditureRows["row 2"][2]).toStrictEqual({
      label: "Total actual spending",
      value: "$12",
    });
    expect(expenditureRows["row 2"][5]).toStrictEqual({
      label: "% of total projected spending",
      value: "60.00%",
    });
  });
});

describe("Test ExportEntityDetailsTable component", () => {
  it("Test ExportEntityDetailsTable render", () => {
    render(
      <ExportEntityDetailsTable
        report={mockSARFullReport}
        section={section as any}
        entity={entity}
      />
    );
    //check to see if table has rendered
    const table = screen.queryByRole("table");
    expect(table).toBeVisible();
    //check to see if table caption exist
    expect(screen.getByText(`${section.name} Table`)).toBeVisible();
    //thead, row 1
    expect(screen.queryAllByRole("row")).toHaveLength(2);
  });
});

describe("Test ExportEntityDetailsTable accessibility", () => {
  it("ExportEntityDetailsTable should not have basic accessibility issues", async () => {
    const { container } = render(
      <ExportEntityDetailsTable
        report={mockSARFullReport}
        section={section as any}
        entity={entity}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
