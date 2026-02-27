import { act, render, screen } from "@testing-library/react";
// components
import { useFormContext } from "react-hook-form";
import { Table, Tbody } from "@chakra-ui/react";
import { DynamicTableRows, DynamicTableProvider } from "components";
// utils
import { useStore } from "utils";
import {
  mockDynamicFieldId,
  mockDynamicTemplateId,
  mockDynamicRowsTemplate,
  mockReportStore,
  mockStateUserStore,
  mockTableId,
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
      name: `Other: $ Delete ${mockDynamicFieldId}`,
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

    await act(async () => {
      await userEvent.type(inputs[0], "123");
    });
    expect(inputs[0]).toHaveValue("123");

    await act(async () => {
      await userEvent.tab();
    });
    expect(inputs[0]).toHaveValue("123.00");
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

  testA11yAct(dynamicTableRowsComponent());
});
