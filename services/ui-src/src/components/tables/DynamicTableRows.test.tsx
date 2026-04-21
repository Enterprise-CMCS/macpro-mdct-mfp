import { act, render, screen } from "@testing-library/react";
// components
import { useFormContext } from "react-hook-form";
import { Table, Tbody } from "@chakra-ui/react";
import { DynamicTableRows, DynamicTableProvider } from "components";
// utils
import { useStore } from "utils";
import { ReportType } from "types";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockDynamicRowsTemplate,
  mockReportStore,
  mockStateUserStore,
  mockTableId,
  mockDynamicRowsTemplateWithModalForm,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";

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

jest.mock("utils/autosave/autosave", () => ({
  getAutosaveFields: jest.fn().mockImplementation(() => {
    return [
      {
        name: `tempDynamicField_mockFormId_mockTableId_mockDynamicFieldId_123a-456b-789c-totalComputable`,
        value: "123",
      },
    ];
  }),
  autosaveFieldData: jest.fn().mockImplementation(() => Promise.resolve("")),
}));

const mockProps = {
  disabled: false,
  dynamicRowsTemplate: mockDynamicRowsTemplate,
  formData: {
    [mockDynamicTemplateId]: [
      {
        id: mockDynamicFieldId,
        totalComputable: "12.34",
      },
      {
        id: `${mockDynamicFieldId}2`,
        totalComputable: "12.34",
      },
    ],
  },
  formPercentage: 100,
  hasDynamicModalForm: false,
  hasStaticRows: true,
  tableId: mockTableId,
};

const dynamicTableRowsComponent = (props = mockProps) => (
  <DynamicTableProvider>
    <Table>
      <Tbody>
        <DynamicTableRows {...props} />
      </Tbody>
    </Table>
  </DynamicTableProvider>
);

describe("<DynamicTableRows />", () => {
  test("delete row", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockReportStore,
      report: {
        fieldData: mockProps.formData,
      },
    });
    mockGetValues(undefined);
    render(dynamicTableRowsComponent());

    const row = screen.getByRole("row", {
      name: `Other: $ % Delete ${mockDynamicFieldId}`,
    });
    expect(row).toBeVisible();

    const inputs = screen.getAllByRole("textbox", { name: "Other:" });
    expect(inputs).toHaveLength(2);

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${mockDynamicFieldId}`,
    });
    expect(deleteButton).toBeVisible();

    await act(async () => {
      await userEvent.click(deleteButton);
    });

    const updatedRow = screen.queryByRole("row", {
      name: `Other: $ Delete ${mockDynamicFieldId}`,
    });
    expect(updatedRow).not.toBeInTheDocument();
  });

  test("edit row", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockReportStore,
      report: {
        fieldData: mockProps.formData,
      },
    });
    mockGetValues(undefined);
    render(dynamicTableRowsComponent());

    const inputs = screen.getAllByRole("textbox", { name: "Other:" });
    const pctInputs = screen.getAllByRole("textbox", { name: "Other: $" });

    await act(async () => {
      await userEvent.clear(inputs[0]);
      await userEvent.clear(pctInputs[0]);
      await userEvent.tab();
    });
    expect(inputs[0]).toHaveValue("");
    expect(pctInputs[0]).toHaveValue("");

    await act(async () => {
      await userEvent.type(inputs[0], "123");
      await userEvent.type(pctInputs[0], "10.00");
      await userEvent.tab();
    });
    expect(inputs[0]).toHaveValue("123.00");
    expect(pctInputs[0]).toHaveValue("10");
  });

  test("no dynamic rows", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockReportStore,
      report: {
        fieldData: {
          [mockDynamicTemplateId]: [],
        },
      },
    });
    mockGetValues(undefined);
    render(dynamicTableRowsComponent());

    const rows = screen.queryAllByRole("row");
    expect(rows).toHaveLength(0);
  });

  //dynamic row aria labels"
  const renderFinancialDeleteLabel = ({
    formData,
    dynamicRowsTemplate = mockDynamicRowsTemplate,
  }: {
    formData: typeof mockProps.formData;
    dynamicRowsTemplate?: typeof mockDynamicRowsTemplate;
  }) => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockReportStore,
      report: {
        ...mockReportStore.report,
        reportType: ReportType.FINANCIAL_REPORT,
        fieldData: formData,
      },
    });
    mockGetValues(undefined);

    return render(
      dynamicTableRowsComponent({
        ...mockProps,
        dynamicRowsTemplate,
        formData,
      })
    );
  };

  const miscCostsTemplate = {
    ...mockDynamicRowsTemplate,
    props: {
      ...mockDynamicRowsTemplate.props,
      dynamicFields: mockDynamicRowsTemplate.props.dynamicFields.map(
        (field, index) =>
          index === 0
            ? {
                ...field,
                props: {
                  ...field.props,
                  dynamicLabel: "Misc. Costs:",
                },
              }
            : field
      ),
    },
  };

  test.each([
    {
      caseName: "supplemental services other label",
      expectedLabels: ["Delete Other: Mock Category"],
      formData: {
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            category: "Mock Category",
            totalComputable: "12.34",
          },
        ],
      },
    },
    {
      caseName: "misc costs label",
      dynamicRowsTemplate: miscCostsTemplate,
      expectedLabels: ["Delete Misc. Costs: Printing"],
      formData: {
        [mockDynamicTemplateId]: [
          {
            id: mockDynamicFieldId,
            name: "Printing",
            totalComputable: "12.34",
          },
        ],
      },
    },
  ])(
    "uses the correct financial report delete labels",
    ({ formData, dynamicRowsTemplate, expectedLabels }) => {
      renderFinancialDeleteLabel({
        dynamicRowsTemplate,
        formData,
      });

      expectedLabels.forEach((label) => {
        expect(
          screen.getByRole("button", {
            name: label,
          })
        ).toBeVisible();
      });
    }
  );

  describe("modal", () => {
    const mockOpenModal = jest.fn();
    const updatedProps = {
      ...mockProps,
      dynamicRowsTemplate: mockDynamicRowsTemplateWithModalForm,
      emptyTableMessage:
        mockDynamicRowsTemplateWithModalForm.verbiage.emptyTableMessage,
      hasStaticRows: false,
      hasDynamicModalForm: true,
      openModal: mockOpenModal,
    };

    test("open modal", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockReportStore,
        report: {
          fieldData: mockProps.formData,
        },
      });
      mockGetValues(undefined);

      render(dynamicTableRowsComponent(updatedProps));

      const editButton = screen.getByRole("button", {
        name: `Edit ${mockDynamicFieldId}`,
      });

      await act(async () => {
        await userEvent.click(editButton);
      });

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
    });

    test("show empty table message", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockReportStore,
        report: {
          fieldData: {
            [mockDynamicTemplateId]: [],
          },
        },
      });
      mockGetValues(undefined);

      render(dynamicTableRowsComponent(updatedProps));

      expect(
        screen.getByText("Mock dynamic empty table message")
      ).toBeVisible();
    });
  });

  testA11yAct(dynamicTableRowsComponent());
});
