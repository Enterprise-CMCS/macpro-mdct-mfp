import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { useFormContext } from "react-hook-form";
import { CalculationTable } from "components";
// utils
import { useStore } from "utils";
import { mockStateUserStore } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { ReportFormFieldType, ReportShape, ValidationType } from "types";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockProps = {
  bodyRows: [
    [
      "Mock text",
      {
        id: "qualifiedHcbs_statePlanServices_mockId1-totalComputable",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_OPTIONAL,
        forTableOnly: true,
        props: {
          label: "Mock text Total Computable",
          mask: "currency",
        },
      },
      {
        id: "qualifiedHcbs_statePlanServices_mockId1-totalStateTerritoryShare",
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
        id: "qualifiedHcbs_statePlanServices_mockId1-totalFederalShare",
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
  footRows: [
    [
      "Mock footer",
      {
        id: "qualifiedHcbs_statePlanServices-totalComputable",
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
        id: "qualifiedHcbs_statePlanServices-totalStateTerritoryShare",
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
        id: "qualifiedHcbs_statePlanServices-totalFederalShare",
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
  id: "qualifiedHcbs_statePlanServices",
  report: {
    fieldData: {},
  } as unknown as ReportShape,
  verbiage: {
    errorMessage: "Mock error",
    percentage: "Mock Percentage: {{percentage}}",
    title: "Mock table title",
  },
};

const tableComponent = (props = mockProps) => <CalculationTable {...props} />;

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
    expect(table).toHaveAttribute("id", "qualifiedHcbs_statePlanServices");

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
          fmap_qualifiedHcbsPercentage: 87,
        },
      } as unknown as ReportShape,
      options: {
        percentageField: "fmap_qualifiedHcbsPercentage",
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
        percentageField: "fmap_qualifiedHcbsPercentage",
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

  testA11yAct(tableComponent());
});
