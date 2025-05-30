//testing lib
import { render, screen } from "@testing-library/react";
//components
import {
  ExportEntityDetailsTable,
  formatHeaderLabel,
  formatColumns,
} from "./ExportEntityDetailsTable";
//utils
import { mockSARFullReport } from "utils/testing/setupJest";
import { AnyObject, EntityShape } from "types";
import { testA11y } from "utils/testing/commonTests";

const expenditureRows = {
  ["row 1"]: [
    { label: "Actual spending (First quarter: Mock)", value: "2" },
    { label: "Projected spending (First quarter: Mock)", value: "6" },
    { label: "Actual spending (Second quarter: Mock)", value: "2" },
    { label: "Projected spending (Second quarter: Mock)", value: "6" },
  ],
  ["row 2"]: [
    { label: "Actual spending (First quarter: Mock)", value: "4000" },
    { label: "Projected spending (First quarter: Mock)", value: "8000" },
    { label: "Actual spending (Second quarter: Mock)", value: "4000" },
    { label: "Projected spending (Second quarter: Mock)", value: "12000" },
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

describe("<ExportEntityDetailsTable />", () => {
  describe("Test table functions specific for Expenditures", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Test formatHeaderLabel functionality", () => {
      const headerLabels: string[] = expenditureRows["row 1"].map(
        (row) => row.label
      );
      const formattedHeaderLabels = headerLabels.map((label) =>
        formatHeaderLabel("expenditures", label, mockSARFullReport)
      );
      expect(formattedHeaderLabels).toStrictEqual([
        "Actual spending 2024 Q1",
        "Projected spending 2024 Q1",
        "Actual spending 2024 Q2",
        "Projected spending 2024 Q2",
      ]);
    });

    describe("formatColumns()", () => {
      test("format columns for expenditures", () => {
        const newTest = structuredClone(expenditureRows);
        formatColumns(newTest, "expenditures");
        expect(newTest).toStrictEqual({
          "row 1": [
            {
              label: "Actual spending (First quarter: Mock)",
              value: "$2.00",
            },
            {
              label: "Actual spending (Second quarter: Mock)",
              value: "$2.00",
            },
            {
              label: "Total actual spending",
              value: "$4.00",
            },
            {
              label: "Projected spending (First quarter: Mock)",
              value: "$6.00",
            },
            {
              label: "Projected spending (Second quarter: Mock)",
              value: "$6.00",
            },
            {
              label: "% of total projected spending",
              value: "33.33%",
            },
          ],
          "row 2": [
            {
              label: "Actual spending (First quarter: Mock)",
              value: "$4,000.00",
            },
            {
              label: "Actual spending (Second quarter: Mock)",
              value: "$4,000.00",
            },
            {
              label: "Total actual spending",
              value: "$8,000.00",
            },
            {
              label: "Projected spending (First quarter: Mock)",
              value: "$8,000.00",
            },
            {
              label: "Projected spending (Second quarter: Mock)",
              value: "$12,000.00",
            },
            {
              label: "% of total projected spending",
              value: "40.00%",
            },
          ],
        });
      });

      test("don't format columns for other step types", () => {
        const newTest = structuredClone(expenditureRows);
        formatColumns(newTest, "other");
        expect(newTest).toStrictEqual(expenditureRows);
      });

      test("test Q1/Q2 column order", () => {
        const q1q2 = {
          row: [
            { label: "Actual spending (Second quarter: Mock)" },
            { label: "Projected spending (Second quarter: Mock)" },
            { label: "Actual spending (First quarter: Mock)" },
            { label: "Projected spending (First quarter: Mock)" },
          ],
        };
        formatColumns(q1q2, "expenditures");
        expect(q1q2["row"]).toStrictEqual([
          { label: "Actual spending (First quarter: Mock)", value: undefined },
          { label: "Actual spending (Second quarter: Mock)", value: undefined },
          { label: "Total actual spending", value: "-" },
          {
            label: "Projected spending (First quarter: Mock)",
            value: undefined,
          },
          {
            label: "Projected spending (Second quarter: Mock)",
            value: undefined,
          },
          { label: "% of total projected spending", value: "-" },
        ]);
      });

      test("test Q3/Q4 column order", () => {
        const q3q4 = {
          row: [
            { label: "Actual spending (Fourth quarter: Mock)" },
            { label: "Projected spending (Fourth quarter: Mock)" },
            { label: "Actual spending (Third quarter: Mock)" },
            { label: "Projected spending (Third quarter: Mock)" },
          ],
        };
        formatColumns(q3q4, "expenditures");
        expect(q3q4["row"]).toStrictEqual([
          { label: "Actual spending (Third quarter: Mock)", value: undefined },
          { label: "Actual spending (Fourth quarter: Mock)", value: undefined },
          { label: "Total actual spending", value: "-" },
          {
            label: "Projected spending (Third quarter: Mock)",
            value: undefined,
          },
          {
            label: "Projected spending (Fourth quarter: Mock)",
            value: undefined,
          },
          { label: "% of total projected spending", value: "-" },
        ]);
      });
    });
  });

  describe("Test ExportEntityDetailsTable component", () => {
    test("Test ExportEntityDetailsTable render", () => {
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

  testA11y(
    <ExportEntityDetailsTable
      report={mockSARFullReport}
      section={section as any}
      entity={entity}
    />
  );
});
