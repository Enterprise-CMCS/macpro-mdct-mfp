import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { DynamicTableRows, DynamicTableProvider } from "components";
// types
import { EntityType, ReportType } from "types";
// utils
import { useStore } from "utils";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockDynamicRowsTemplate,
  mockReportStore,
  mockStateUserStore,
  mockTableId,
  mockDynamicRowsTemplateWithModalForm,
  mockFieldStore,
} from "utils/testing/setupTest";
import { testA11yAct } from "utils/testing/commonTests";
import { ResponsiveTable } from "./ResponsiveTable";

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
  openModal: () => {},
  emptyTableMessage: undefined,
  entityType: undefined,
};

const mockSetValue = vi.fn();
const mockAutosave = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;

mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockReportStore,
  report: {
    fieldData: mockProps.formData,
  },
  ...mockFieldStore,
  setAnswer: mockSetValue,
});

vi.mock("utils/autosave/autosave", () => ({
  autoSaveFields: vi.fn().mockImplementation(() => {
    return [
      {
        name: `tempDynamicField_mockFormId_mockTableId_mockDynamicFieldId_123a-456b-789c-totalComputable`,
        value: "123",
      },
    ];
  }),
}));

const DynamicTableRowsComponent = ({ props = mockProps }) => {
  return ResponsiveTable({
    id: "",
    dynamicRows: DynamicTableRows(
      props.tableId,
      props.formPercentage,
      props.disabled,
      props.dynamicRowsTemplate,
      props.hasDynamicModalForm,
      props.hasStaticRows,
      props.formData,
      props.openModal,
      props.emptyTableMessage,
      undefined,
      undefined,
      props.entityType
    ),
  });
};

describe("<DynamicTableRows />", () => {
  test("delete row", async () => {
    render(
      <DynamicTableProvider updateFieldValues={mockAutosave}>
        <DynamicTableRowsComponent />
      </DynamicTableProvider>
    );
    const row = screen.getByRole("row", {
      name: `Other: $ % Delete Other: ${mockDynamicFieldId}`,
    });
    expect(row).toBeVisible();

    const inputs = screen.getAllByRole("textbox", { name: "Other:" });
    expect(inputs).toHaveLength(2);

    const deleteButton = screen.getByRole("button", {
      name: `Delete Other: ${mockDynamicFieldId}`,
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
    render(
      <DynamicTableProvider updateFieldValues={mockAutosave}>
        <DynamicTableRowsComponent />
      </DynamicTableProvider>
    );

    const inputs = screen.getAllByRole("textbox", { name: "Other:" });
    const pctInputs = screen.getAllByRole("textbox", { name: "" }); //Changed from "Other: $"

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

  test("edit row - entity", async () => {
    const mockCurrentEntityId = "mockCurrentEntityId";
    const formData = {
      id: mockCurrentEntityId,
      ...mockProps.formData,
    };
    const updatedProps = {
      ...mockProps,
      entityType: EntityType.INITIATIVE,
      formData,
    };

    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockReportStore,
      report: {
        fieldData: {
          [EntityType.INITIATIVE]: [formData],
        },
      },
      ...mockFieldStore,
      setAnswer: mockSetValue,
    });

    render(
      <DynamicTableProvider updateFieldValues={mockAutosave}>
        <DynamicTableRowsComponent props={updatedProps as any} />
      </DynamicTableProvider>
    );

    const inputs = screen.getAllByRole("textbox", { name: "Other:" });
    const pctInputs = screen.getAllByRole("textbox", { name: "" }); //Changed from "Other: $"

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
      ...mockFieldStore,
      setAnswer: mockSetValue,
    });
    render(
      <DynamicTableProvider updateFieldValues={mockAutosave}>
        <DynamicTableRowsComponent />
      </DynamicTableProvider>
    );

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
      ...mockFieldStore,
      setAnswer: mockSetValue,
    });

    const newProps = { ...mockProps, dynamicRowsTemplate, formData };

    return render(
      <DynamicTableProvider updateFieldValues={mockAutosave}>
        <DynamicTableRowsComponent props={newProps} />
      </DynamicTableProvider>
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
    const mockOpenModal = vi.fn();
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
        ...mockFieldStore,
        setAnswer: mockSetValue,
      });

      render(
        <DynamicTableProvider updateFieldValues={mockAutosave}>
          <DynamicTableRowsComponent props={updatedProps as any} />
        </DynamicTableProvider>
      );

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
        ...mockFieldStore,
        setAnswer: mockSetValue,
      });

      render(
        <DynamicTableProvider updateFieldValues={mockAutosave}>
          <DynamicTableRowsComponent props={updatedProps as any} />
        </DynamicTableProvider>
      );

      expect(
        screen.getByText("Mock dynamic empty table message")
      ).toBeVisible();
    });
  });

  testA11yAct(
    <DynamicTableProvider updateFieldValues={mockAutosave}>
      <DynamicTableRowsComponent />
    </DynamicTableProvider>
  );
});
