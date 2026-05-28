import {
  renderServiceTableBody,
  renderFieldTableBody,
  renderCalculationTables,
  renderEntityTables,
} from "./exportFieldTableHelpers";
import {
  ReportFormFieldType,
  PageTypes,
  FormField,
  FormLayoutElement,
} from "types";
import { useStore } from "utils/state/useStore";
import { render, screen } from "@testing-library/react";
import { ReactElement } from "react";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

// Test data
const formFields: (FormField | FormLayoutElement)[] = [
  {
    id: "field1",
    type: ReportFormFieldType.TEXT,
    props: {},
  },
  {
    id: "field2",
    type: ReportFormFieldType.CHECKBOX,
    props: {
      choices: [
        {
          id: "choice1",
          label: "Choice 1",
          children: [
            {
              id: "childField1",
              type: ReportFormFieldType.TEXT,
              props: {},
            },
          ],
        },
      ],
    },
  },
];

const section = (id: string, name: string) => ({
  name: name,
  form: {
    tables: [
      {
        id: id,
        headRows: [["Column 1", "Column 2"]],
        bodyRows: [],
        footRows: [],
        dynamicRowsTemplate: {
          id: "dynamicRows",
          props: {
            dynamicFields: [
              {
                id: "dynamicField1",
                type: ReportFormFieldType.TEXT,
                props: { dynamicLabel: "Misc Costs:" },
              },
              {
                id: "dynamicField2",
                type: ReportFormFieldType.NUMBER,
                props: { mask: "currency" },
              },
            ],
          },
        },
        verbiage: {
          title: "Calculation Table",
          percentage: "Percentage: {{percentage}}",
        },
      },
    ],
  },
});

const fieldData = (id: string, pct: number) => ({
  dynamicRows: [
    {
      dynamicField1: "Item 1",
      dynamicField2: 500,
    },
  ],
  [`fmap_${id}Percentage`]: pct,
});

describe("exportFieldTableHelpers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("renderServiceTableBody()", () => {
    const headRow = ["Field", "Value"];
    const mockReport = {
      fieldData: {
        field1: "Answer 1",
        field2: 12345,
      },
    };

    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        report: mockReport,
      } as any);
    });

    test("should render service table body correctly", () => {
      const bodyRows = [
        [
          { id: "field1", props: { initialValue: "" } },
          {
            id: "field2",
            type: ReportFormFieldType.NUMBER,
            props: { initialValue: "", mask: "currency" },
          },
        ],
        ["Static Field", "Static Value"],
      ];
      const result = renderServiceTableBody(bodyRows, headRow);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(["Answer 1", "$12,345"]);
      expect(result[1]).toEqual(["Static Field", "Static Value"]);
    });

    test("should handle 'Not answered' for fields without data", () => {
      const bodyRows = [
        [
          { id: "field3", props: { initialValue: "" } },
          { id: "field4", props: { initialValue: "" } },
        ],
      ];
      const result = renderServiceTableBody(bodyRows, headRow);
      expect(result[0]).toEqual(["Not answered", "Not answered"]);
    });

    test("should render bold values for specific headers", () => {
      const boldHeadRow = [
        "Total State / Territory Share",
        "Total Federal Share",
      ];
      const bodyRows = [
        [
          { id: "field1", props: { initialValue: "" } },
          {
            id: "field2",
            type: ReportFormFieldType.NUMBER,
            props: { initialValue: "", mask: "currency" },
          },
        ],
      ];
      const result = renderServiceTableBody(bodyRows, boldHeadRow);
      const firstRow = result[0];
      expect((firstRow[0] as ReactElement).type).toBe("span");
      expect((firstRow[1] as ReactElement).type).toBe("span");
    });
  });

  describe("renderFieldTableBody()", () => {
    test("should render field rows and their children", () => {
      const tableRows = renderFieldTableBody(
        formFields,
        PageTypes.STANDARD,
        false
      );
      expect(tableRows).toHaveLength(3);
      expect(tableRows[0].key).toBe("field1");
      expect(tableRows[1].key).toBe("field2");
      expect(tableRows[2].key).toBe("childField1");
    });

    test("should not render nested children for drawer pages", () => {
      const tableRows = renderFieldTableBody(
        formFields,
        PageTypes.DRAWER,
        false
      );
      expect(tableRows).toHaveLength(2);
      expect(tableRows[0].key).toBe("field1");
      expect(tableRows[1].key).toBe("field2");
    });
  });

  describe("renderCalculationTables()", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        report: { fieldData },
      } as any);
    });
    test("should render calculation tables", async () => {
      const tables = [
        {
          id: "qualifiedHcbs",
          name: "Qualified HCBS",
          pct: 50,
        },
        {
          id: "demonstrationServices",
          name: "Demonstration Services",
          pct: 75,
        },
        {
          id: "other",
          name: "Other",
          pct: 0,
        },
      ];

      tables.forEach(({ id, pct, name }) => {
        render(
          <>
            {renderCalculationTables(section(id, name), fieldData(id, pct), 0)}
          </>
        );
        expect(screen.getByTestId(`service-table-${id}`)).toBeVisible();
        expect(screen.getByText(`Percentage: ${pct}%`)).toBeVisible();
      });
    });
  });

  describe("renderEntityTables()", () => {
    test("should render entity tables with data", () => {
      const table = {
        id: "testTable",
        headRows: [["Name", "Value"]],
        dynamicRowsTemplate: {
          id: "testData",
          props: {
            dynamicFields: [
              {
                id: "testData-name",
                type: ReportFormFieldType.TEXT,
                props: {},
              },
              {
                id: "testData-value",
                type: ReportFormFieldType.TEXT,
                props: {},
              },
            ],
          },
        },
        verbiage: { title: "Test Table" },
      };

      const entity = {
        id: "1",
        testData: [{ name: "Item 1", value: "Value 1" }],
      };

      const result = renderEntityTables([table], entity, "h4", false);
      render(<>{result}</>);

      expect(screen.getByText("Test Table")).toBeVisible();
      expect(screen.getByText("Item 1")).toBeVisible();
      expect(screen.getByText("Value 1")).toBeVisible();
    });
  });
});
