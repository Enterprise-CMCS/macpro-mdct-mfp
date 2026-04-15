import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { useFormContext } from "react-hook-form";
import { DynamicTableProvider, EntityModalTable } from "components";
// types
import { NumberMask, ReportFormFieldType, ValidationType } from "types";
// utils
import { useStore } from "utils";
import {
  mockDynamicFieldId,
  mockDynamicRowsTemplate,
  mockDynamicRowsTemplateWithModalForm,
  mockDynamicTemplateId,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: jest.fn(),
  setValue: jest.fn(),
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    __esModule: true,
    ...actual,
    useFormContext: jest.fn(() => mockRhfMethods),
  };
});
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("react-uuid", () => jest.fn(() => mockDynamicFieldId));

jest.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: jest.fn().mockImplementation(() => {
    return [
      {
        name: `tempDynamicField_mockFormId_mockTableId_mockDynamicFieldId_123a-456b-789c-category`,
        value: "Test Category",
      },
    ];
  }),
  autosaveFieldData: jest.fn().mockImplementation(() => Promise.resolve("")),
}));

const mockProps = {
  bodyRows: [
    [
      "Mock text 1",
      {
        id: "mockTable_mockServices_mockId1-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 1 Total Computable",
          mask: NumberMask.CURRENCY,
        },
      },
      {
        id: "mockTable_mockServices_mockId1-percentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 1 Percentage",
          mask: NumberMask.PERCENTAGE,
        },
      },
      {
        id: "mockTable_mockServices_mockId1-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 1 Total State / Territory Share",
          mask: NumberMask.CURRENCY,
          readOnly: true,
        },
      },
      {
        id: "mockTable_mockServices_mockId1-totalFederalShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 1 Total Federal Share",
          mask: NumberMask.CURRENCY,
          readOnly: true,
        },
      },
    ],
    [
      "Mock text 2",
      {
        id: "mockTable_mockServices_mockId2-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 2 Total Computable",
          mask: NumberMask.CURRENCY,
        },
      },
      {
        id: "mockTable_mockServices_mockId2-percentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 2 Percentage",
          mask: NumberMask.PERCENTAGE,
        },
      },
      {
        id: "mockTable_mockServices_mockId2-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 2 Total State / Territory Share",
          mask: NumberMask.CURRENCY,
          readOnly: true,
        },
      },
      {
        id: "mockTable_mockServices_mockId2-totalFederalShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 2 Total Federal Share",
          mask: NumberMask.CURRENCY,
          readOnly: true,
        },
      },
    ],
  ],
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
          mask: NumberMask.CURRENCY,
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
          mask: NumberMask.CURRENCY,
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
          mask: NumberMask.CURRENCY,
          readOnly: true,
        },
      },
    ],
  ],
  formData: {},
  headRows: [["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"]],
  id: "mockTable_mockServices",
  verbiage: {
    subtitle: "Mock table subtitle",
    title: "Mock table title",
  },
};

const tableComponent = (props = mockProps) => (
  <RouterWrappedComponent>
    <DynamicTableProvider>
      <EntityModalTable {...props} />
    </DynamicTableProvider>
  </RouterWrappedComponent>
);

describe("<EntityModalTable />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("table is visible", () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
    mockGetValues(undefined);
    render(tableComponent());

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("id", "mockTable_mockServices");

    const tableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock table title",
    });
    expect(tableHeading).toBeVisible();

    const subtitle = screen.getByText("Mock table subtitle");
    expect(subtitle).toBeVisible();
  });

  describe("dynamic rows", () => {
    test("clicking remove button removes row", async () => {
      const report = {
        fieldData: {
          [mockDynamicTemplateId]: [
            {
              id: mockDynamicFieldId,
              name: mockDynamicFieldId,
              category: "Mock Dynamic Row Category 1",
            },
          ],
        },
      };
      mockedUseStore.mockReturnValue({ report });
      mockGetValues(undefined);
      const updatedProps = {
        ...mockProps,
        report,
        dynamicRowsTemplate: mockDynamicRowsTemplate,
      };

      const { container } = render(tableComponent(updatedProps));

      // bodyRows are added on load
      const tbody = container.querySelector("tbody");
      const rows = tbody?.querySelectorAll("tr");

      expect(rows).toHaveLength(3);

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockDynamicFieldId}`,
      });
      await userEvent.click(deleteButton);

      const updatedRows = tbody?.querySelectorAll("tr");
      expect(updatedRows).toHaveLength(2);
    });

    test("clicking add button opens modal", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
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
        dynamicRowsTemplate: mockDynamicRowsTemplateWithModalForm,
      };

      render(tableComponent(updatedProps));

      const button = screen.getByRole("button", {
        name: "Mock dynamic row button",
      });
      expect(button).toBeVisible();
    });
  });

  testA11yAct(tableComponent());
});
