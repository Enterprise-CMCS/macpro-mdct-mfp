//testing lib
import { render, screen } from "@testing-library/react";
import { ExportRETTable } from "components";
import { axe } from "jest-axe";
//components
import {
  formatHeaderForRET,
  formatLabelForRET,
  formatFooterForRET,
} from "./ExportedRETTable";
//utils
import { useStore } from "utils";
import { notAnsweredText } from "../../constants";

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const section = {
  form: {
    id: "ret-mtrp",
    fields: [
      {
        id: "mock-section-1",
        props: { content: "Third quarter" },
        type: "sectionHeader",
      },
      {
        id: "mock-id-1",
        props: { label: "Number of Older adults" },
        type: "number",
      },
      {
        id: "mock-id-2",
        props: {
          label: "Number of Individuals with physical disabilities (PD)",
        },
        type: "number",
      },
      {
        id: "mock-section-2",
        props: { content: "Fourth quarter" },
        type: "sectionHeader",
      },
      {
        id: "mock-id-3",
        props: { label: "Number of Older adults" },
        type: "number",
      },
      {
        id: "mock-id-4",
        props: {
          label: "Number of Individuals with physical disabilities (PD)",
        },
        type: "number",
      },
      {
        id: "mock-child",
        props: {
          choices: [
            {
              id: "1234",
              children: [
                {
                  id: "mock-child-1",
                  props: { label: "Number of Older adults" },
                  type: "number",
                  validation: { parentOptionId: "1234" },
                },
                {
                  id: "mock-child-2",
                  props: {
                    label:
                      "Number of Individuals with physical disabilities (PD)",
                  },
                  type: "number",
                  validation: { parentOptionId: "1234" },
                },
              ],
            },
          ],
        },
        type: "checkbox",
      },
    ],
  },
  name: "mock table name",
};

const emptySection = {
  id: "mock-empty",
  fields: [],
};

const mockSARReport = {
  report: {
    fieldData: {
      "mock-id-1": "3",
      "mock-id-3": "4",
      "mock-id-4": "6",
      "ret-tnamprp-1": 3,
      "ret-tnamprp-2": 4,
      "mock-child": [{ key: "child-1234", value: "other" }],
      "mock-child-1": 8,
      "mock-child-2": 12,
      targetPopulations: [
        {
          id: "target-1",
          quarterlyProjections2024Q3: "2",
          quarterlyProjections2024Q4: "3",
        },
        {
          id: "target-2",
          quarterlyProjections2024Q3: "4",
          quarterlyProjections2024Q4: "5",
        },
      ],
      "otherReasons-otherText": "mock other",
    },
    reportYear: 2024,
    reportPeriod: 2,
  },
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockSARReport);

//These test are testing functions that uses hardcoded return values
describe("Test table functions specific for R,E & T", () => {
  describe("Test formatHeaderForRET functionality", () => {
    it("Returns label without change", () => {
      const sameLabel = formatHeaderForRET("Mock name");
      expect(sameLabel).toBe("Mock name");
    });
    it("Removes Other: from label", () => {
      const newLabel = formatHeaderForRET("Other: Test");
      expect(newLabel).toBe("Test");
    });
    it("Returns abbr label", () => {
      const newLabel = formatHeaderForRET("Mock Long Name (MLN)");
      expect(newLabel).toBe("MLN");
    });
    it("Returns Number of Older adults as Older Adults", () => {
      const newLabel = formatHeaderForRET("Number of Older adults");
      expect(newLabel).toBe("Older Adults");
    });
  });
  it("Test formatLabelForRET functionality", () => {
    const values = [
      { id: "ret-mtfqi", label: "Mock name", result: "Mock name" },
      { id: "ret-mtfqi", label: "mock (MLN)", result: "MLN" },
      { id: "ret-mtfqr", label: "Mock name", result: "Mock name" },
      {
        id: "ret-mtfqr",
        label:
          "Group home or other residence in which four or fewer unrelated individuals live",
        result: "Group home",
      },
      {
        id: "ret-mtfqr",
        label: "Apartment (individual lease, lockable access, etc.)",
        result: "Apartment",
      },
      {
        id: "ret-mtfqr",
        label: "Apartment in qualified assisted living",
        result: "Apt. in qualified assisted living",
      },
      { id: "ret-mpdprp", label: "Mock name", report: {}, result: "Mock name" },
      {
        id: "ret-mpdprp",
        label: "Other, specify",
        report: mockSARReport.report,
        result: "Other: mock other",
      },
    ];

    values.forEach((value) => {
      const newLabel = formatLabelForRET(value.id, value.label, value?.report!);
      expect(newLabel).toBe(value.result);
    });
  });
  it("Test formatFooterForRET functionality", () => {
    const expectedResults = [
      "Total as a % of all current MFP participate",
      "66.67%",
      "75.00%",
    ];
    const footerRow = [["label", "2", "3"]];
    formatFooterForRET("ret-mpdprp", mockSARReport.report, footerRow);
    expect(footerRow[footerRow.length - 1]).toStrictEqual(expectedResults);
  });
});
describe("Test ExportedRETTable Component", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockSARReport);
    render(<ExportRETTable section={section as any} />);
  });
  it("Test ExportRETTable render", () => {
    //check to see if table has rendered
    const table = screen.queryByRole("table");
    expect(table).toBeVisible();
    //check to see if table caption exist
    expect(screen.getByText(`${section.name} Table`)).toBeVisible();
    //there should be 1 not answered in the table
    expect(screen.queryAllByText(notAnsweredText)).toHaveLength(1);
    //thead, Q3, Q4, other, total, target Q3, target Q4, target total, % total, a total of 9 rows should exist
    expect(screen.queryAllByRole("row")).toHaveLength(9);
  });
});
describe("Test ExportedRETTable Component with empty section", () => {
  it("Test ExportRETTable render if section is empty", () => {
    //an empty section means no transition benchmark had been selected
    mockedUseStore.mockReturnValue(mockSARReport);
    render(<ExportRETTable section={emptySection as any} />);
    const table = screen.queryByRole("table");
    expect(table).toBe(null);
    expect(
      screen.getByText(
        "Your associated MFP Work Plan does not contain any target populations."
      )
    ).toBeVisible();
  });
});
describe("Test ExportedReportWrapper accessibility", () => {
  it("ExportedReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(<ExportRETTable section={section as any} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
