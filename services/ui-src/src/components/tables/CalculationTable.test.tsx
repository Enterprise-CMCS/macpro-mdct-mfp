import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { useFormContext } from "react-hook-form";
import { CalculationTable, DynamicTableProvider } from "components";
// types
import { ReportFormFieldType, ReportShape, ValidationType } from "types";
// utils
import { useStore } from "utils";
import { mockStateUserStore } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockFormContextMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockFieldArrayMethods = {
  append: jest.fn(),
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockFormContextMethods),
  useFieldArray: jest.fn(() => mockFieldArrayMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockFormContextMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockProps = {
  bodyRows: [
    [
      "Mock text 1",
      {
        id: "mockTable_statePlanServices_mockId1-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 1 Total Computable",
          mask: "currency",
        },
      },
      {
        id: "mockTable_statePlanServices_mockId1-percentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 1 Percentage",
          mask: "percentage",
        },
      },
      {
        id: "mockTable_statePlanServices_mockId1-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 1 Total State / Territory Share",
          mask: "currency",
          readOnly: true,
        },
      },
      {
        id: "mockTable_statePlanServices_mockId1-totalFederalShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 1 Total Federal Share",
          mask: "currency",
          readOnly: true,
        },
      },
    ],
    [
      "Mock text 2",
      {
        id: "mockTable_statePlanServices_mockId2-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 2 Total Computable",
          mask: "currency",
        },
      },
      {
        id: "mockTable_statePlanServices_mockId2-percentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text 2 Percentage",
          mask: "percentage",
        },
      },
      {
        id: "mockTable_statePlanServices_mockId2-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 2 Total State / Territory Share",
          mask: "currency",
          readOnly: true,
        },
      },
      {
        id: "mockTable_statePlanServices_mockId2-totalFederalShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text 2 Total Federal Share",
          mask: "currency",
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
        id: "mockTable_statePlanServices-totalComputable",
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
        id: "mockTable_statePlanServices-totalStateTerritoryShare",
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
        id: "mockTable_statePlanServices-totalFederalShare",
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
  id: "mockTable_statePlanServices",
  verbiage: {
    dynamicRows: {
      buttonText: "Mock dynamic row button",
      hint: "Mock dynamic row hint",
      label: "Mock dynamic row label:",
    },
    errorMessage: "Mock error",
    percentage: "Mock Percentage: {{percentage}}",
    title: "Mock table title",
  },
};

const tableComponent = (props = mockProps) => (
  <DynamicTableProvider>
    <CalculationTable {...props} />
  </DynamicTableProvider>
);

describe("<CalculationTable />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("table is visible", () => {
    mockGetValues(undefined);
    render(tableComponent());

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("id", "mockTable_statePlanServices");

    const tableHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mock table title",
    });
    expect(tableHeading).toBeVisible();

    const pct = screen.getByText("Mock Percentage: 100%");
    expect(pct).toBeVisible();
  });

  test("in-place calculations", async () => {
    mockGetValues(undefined);
    const updatedProps = {
      ...mockProps,
      report: {
        fieldData: {
          fmap_mockTablePercentage: 78,
          "mockTable_statePlanServices_mockId1-percentage": 87,
        },
      } as unknown as ReportShape,
      options: {
        percentageField: "fmap_mockTablePercentage",
      },
    };

    render(tableComponent(updatedProps));

    const pct = screen.getByText("Mock Percentage: 78%");
    expect(pct).toBeVisible();

    const headRow = screen.getByRole("row", {
      name: "Heading 1 Heading 2 Heading 3 Heading 4 Heading 5",
    });
    expect(headRow).toBeVisible();

    const bodyRow = screen.getByRole("row", {
      name: "Mock text 1 Heading 2 $ Heading 3 % $0 $0",
    });
    expect(bodyRow).toBeVisible();

    const footRow = screen.getByRole("row", { name: "Mock footer $0 $0 $0" });
    expect(footRow).toBeVisible();

    const input = screen.getByRole("textbox", {
      name: "Heading 2 Mock text 1",
    });
    await act(async () => {
      await userEvent.type(input, "123");
    });

    const bodyRowUpdated = screen.getByRole("row", {
      name: "Mock text 1 Heading 2 $ Heading 3 % $15.99 $107.01",
    });
    expect(bodyRowUpdated).toBeVisible();

    const footRowUpdated = screen.getByRole("row", {
      name: "Mock footer $123 $15.99 $107.01",
    });
    expect(footRowUpdated).toBeVisible();
  });

  test("error message and disabled field", () => {
    mockGetValues(undefined);
    const updatedProps = {
      ...mockProps,
      options: {
        percentageField: "fmap_mockTablePercentage",
      },
    };

    render(tableComponent(updatedProps));

    const errorMessage = screen.getByText("Mock error");
    expect(errorMessage).toBeVisible();

    const pct = screen.getByText("Mock Percentage: [auto-populated]%");
    expect(pct).toBeVisible();
  });

  test("dynamic rows", async () => {
    mockGetValues(undefined);
    const updatedProps = {
      ...mockProps,
      dynamicRows: [
        [
          {
            id: "mockTable_statePlanServices_other-category",
            type: ReportFormFieldType.DYNAMIC,
            validation: ValidationType.DYNAMIC_OPTIONAL,
            forTableOnly: true,
            props: {
              label: "Mock other text Category",
            },
          },
          {
            id: "mockTable_statePlanServices_other-totalComputable",
            type: ReportFormFieldType.DYNAMIC,
            validation: ValidationType.DYNAMIC_OPTIONAL,
            forTableOnly: true,
            props: {
              label: "Mock other text Total Computable",
              mask: "currency",
              readOnly: true,
            },
          },
          {
            id: "mockTable_statePlanServices_other-percentage",
            type: ReportFormFieldType.DYNAMIC,
            validation: ValidationType.DYNAMIC_OPTIONAL,
            forTableOnly: true,
            props: {
              label: "Mock other text Percentage",
              mask: "percentage",
              readOnly: true,
            },
          },
          {
            id: "mockTable_statePlanServices_other-totalStateTerritoryShare",
            type: ReportFormFieldType.DYNAMIC,
            validation: ValidationType.DYNAMIC_OPTIONAL,
            forTableOnly: true,
            props: {
              initialValue: "0",
              label: "Mock other text Total State / Territory Share",
              mask: "currency",
              readOnly: true,
            },
          },
          {
            id: "mockTable_statePlanServices_other-totalFederalShare",
            type: ReportFormFieldType.DYNAMIC,
            validation: ValidationType.DYNAMIC_OPTIONAL,
            forTableOnly: true,
            props: {
              initialValue: "0",
              label: "Mock other text Total Federal Share",
              mask: "currency",
              readOnly: true,
            },
          },
        ],
      ],
    };

    render(tableComponent(updatedProps));

    const hint = screen.getByText("Mock dynamic row hint");
    expect(hint).toBeVisible();

    const bodyRows = screen.getAllByRole("row");
    expect(bodyRows).toHaveLength(4);

    const button = screen.getByRole("button", {
      name: "Mock dynamic row button",
    });
    await act(async () => {
      await userEvent.click(button);
    });

    const bodyRowsUpdated = screen.getAllByRole("row");
    expect(bodyRowsUpdated).toHaveLength(5);
  });

  testA11yAct(tableComponent());
});
