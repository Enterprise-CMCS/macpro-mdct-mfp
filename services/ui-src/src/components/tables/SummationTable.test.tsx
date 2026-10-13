import { Mock, MockedFunction } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { useFormContext } from "react-hook-form";
import { DynamicTableProvider, SummationTable } from "components";
// types
import { ReportFormFieldType, ValidationType } from "types";
// utils
import { useStore } from "utils";
import {
  mockDynamicFieldId,
  mockDynamicRowsTemplate,
  mockDynamicTemplateId,
  mockStateUserStore,
} from "utils/testing/setupTest";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = vi.fn();
const mockRhfMethods = {
  register: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as Mock<
  typeof useFormContext
>;
vi.mock("react-hook-form", () => ({
  useFormContext: vi.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: vi.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;

vi.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: vi.fn().mockImplementation(() => {
    return [
      {
        name: `tempDynamicField_mockFormId_mockTableId_mockDynamicFieldId_123a-456b-789c-category`,
        value: "Test Category",
      },
    ];
  }),
  autosaveFieldData: vi.fn().mockImplementation(() => Promise.resolve("")),
  enqueueWrite: vi.fn().mockImplementation((work) => work()),
}));

const mockProps = {
  bodyRows: [[]],
  disabled: false,
  footRows: [
    [
      "Mock footer",
      {
        id: "mockTable_mockServices-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock footer Total Computable",
          mask: "currency",
          readOnly: true,
        },
      },
      "",
      {
        id: "mockTable_mockServices-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock footer Total State / Territory Share",
          mask: "currency",
          readOnly: true,
        },
      },
      {
        id: "mockTable_mockServices-totalFederalShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock footer Total Federal Share",
          mask: "currency",
          readOnly: true,
        },
      },
    ],
  ],
  formData: {},
  headRows: [["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"]],
  id: "mockTable_mockServices",
  verbiage: {
    title: "Mock table title",
  },
};

const tableComponent = (props = mockProps) => (
  <DynamicTableProvider>
    <SummationTable {...props} />
  </DynamicTableProvider>
);

describe("<SummationTable />", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        randomUUID: vi.fn(() => mockDynamicFieldId),
      },
    });
  });
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("table is visible", () => {
    mockGetValues(undefined);
    render(tableComponent());

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("id", "mockTable_mockServices");

    const tableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock table title",
    });
    expect(tableHeading).toBeVisible();
  });

  describe("dynamic rows", () => {
    test("clicking add button adds row", async () => {
      mockGetValues(undefined);
      const updatedProps = {
        ...mockProps,
        report: {
          fieldData: {
            [mockDynamicTemplateId]: [
              {
                id: mockDynamicFieldId,
                name: mockDynamicFieldId,
                category: "Mock Dynamic Row Category 1",
              },
            ],
          },
        },
        dynamicRowsTemplate: mockDynamicRowsTemplate,
      };

      const { container } = render(tableComponent(updatedProps));
      const hint = screen.getByText("Mock dynamic row hint");
      expect(hint).toBeVisible();

      // addDynamicRow is called on load
      const tbody = container.querySelector("tbody");
      const rows = tbody?.querySelectorAll("tr");

      expect(rows).toHaveLength(1);

      const button = screen.getByRole("button", {
        name: "Mock dynamic row button",
      });
      await userEvent.click(button);
      const updatedRows = tbody?.querySelectorAll("tr");

      expect(updatedRows).toHaveLength(2);

      const input = screen.getByRole("textbox", { name: "Heading 1 Other:" });
      expect(input).toBeVisible();
    });

    test("clicking remove button removes row", async () => {
      mockGetValues(undefined);
      const updatedProps = {
        ...mockProps,
        report: {
          fieldData: {
            [mockDynamicTemplateId]: [
              {
                id: mockDynamicFieldId,
                name: mockDynamicFieldId,
                category: "Mock Dynamic Row Category 1",
              },
            ],
          },
        },
        dynamicRowsTemplate: mockDynamicRowsTemplate,
      };

      const { container } = render(tableComponent(updatedProps));

      // addDynamicRow is called on load
      const tbody = container.querySelector("tbody");
      const rows = tbody?.querySelectorAll("tr");

      expect(rows).toHaveLength(1);

      const button = screen.getByRole("button", {
        name: "Mock dynamic row button",
      });
      await userEvent.click(button);

      const deleteButton = screen.getByRole("button", {
        name: `Delete Other: ${mockDynamicFieldId}`,
      });
      await userEvent.click(deleteButton);

      const updatedRows = tbody?.querySelectorAll("tr");
      expect(updatedRows).toHaveLength(1);
    });
  });

  testA11yAct(tableComponent());
});
