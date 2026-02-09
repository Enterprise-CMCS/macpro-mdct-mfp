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
      "Mock text",
      {
        id: "mockTable_statePlanServices_mockId1-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text Total Computable",
          mask: "currency",
        },
      },
      {
        id: "mockTable_statePlanServices_mockId1-totalStateTerritoryShare",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          initialValue: "0",
          label: "Mock text Total State / Territory Share",
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
          label: "Mock text Total Federal Share",
          mask: "currency",
          readOnly: true,
        },
      },
    ],
  ],
  disabled: false,
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
  headRows: [["Heading 1", "Heading 2", "Heading 3", "Heading 4"]],
  id: "mockTable_statePlanServices",
  report: {
    fieldData: {},
  } as unknown as ReportShape,
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
          fmap_mockTablePercentage: 87,
        },
      } as unknown as ReportShape,
      options: {
        percentageField: "fmap_mockTablePercentage",
      },
    };

    render(tableComponent(updatedProps));

    const pct = screen.getByText("Mock Percentage: 87%");
    expect(pct).toBeVisible();

    const headRow = screen.getByRole("row", {
      name: "Heading 1 Heading 2 Heading 3 Heading 4",
    });
    expect(headRow).toBeVisible();

    const bodyRow = screen.getByRole("row", {
      name: "Mock text Heading 2 $ $0 $0",
    });
    expect(bodyRow).toBeVisible();

    const footRow = screen.getByRole("row", { name: "Mock footer $0 $0 $0" });
    expect(footRow).toBeVisible();

    const input = screen.getByRole("textbox", { name: "Heading 2 Mock text" });
    expect(input).toBeVisible();

    await act(async () => {
      await userEvent.type(input, "123");
    });

    const bodyRowUpdated = screen.getByRole("row", {
      name: "Mock text Heading 2 $ $15.99 $107.01",
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

    const input = screen.getByRole("textbox", { name: "Heading 2 Mock text" });
    expect(input).toBeDisabled();
  });

  test("dynamic rows", async () => {
    mockGetValues(undefined);
    render(tableComponent(mockProps));

    const hint = screen.getByText("Mock dynamic row hint");
    expect(hint).toBeVisible();

    const bodyRows = screen.getAllByRole("row");
    expect(bodyRows).toHaveLength(3);

    const button = screen.getByRole("button", {
      name: "Mock dynamic row button",
    });
    await act(async () => {
      await userEvent.click(button);
    });

    const bodyRowUpdated = screen.getAllByRole("row");
    expect(bodyRowUpdated).toHaveLength(4);
  });

  testA11yAct(tableComponent());
});
