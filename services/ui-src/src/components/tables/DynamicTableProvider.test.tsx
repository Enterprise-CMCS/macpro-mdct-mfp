import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import {
  DynamicTableContext,
  DynamicTableProvider,
} from "./DynamicTableProvider";
// types
import {
  DynamicValidationType,
  ReportFormFieldType,
  ValidationType,
} from "types";
// utils
import {
  mockDynamicFieldId,
  mockDynamicRowsTemplate,
  mockDynamicTemplateId,
  mockFieldId,
  mockTableId,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { useFormContext } from "react-hook-form";

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

const mockUuid = "mock-uuid";
jest.mock("react-uuid", () => jest.fn(() => mockUuid));

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

const TestComponent = () => {
  const dynamicRowsTemplate = mockDynamicRowsTemplate;

  const field = {
    id: mockFieldId,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    props: {
      label: "Mock field label",
      mask: "currency",
    },
  };

  const dynamicField = {
    id: `${mockDynamicTemplateId}-mockNumberFieldId`,
    type: ReportFormFieldType.NUMBER,
    validation: DynamicValidationType.NUMBER_OPTIONAL,
    props: {
      mask: "currency",
    },
  };

  const dynamicFieldWithDynamicLabel = {
    ...dynamicField,
    props: {
      ...dynamicField.props,
      dynamicLabel: "Other:",
    },
  };

  const fieldData = {
    [mockDynamicTemplateId]: [
      {
        id: mockDynamicFieldId,
        mockNumberFieldId: "12.34",
      },
    ],
  };

  const displayCellProps = {
    ariaLabelledby: "display-cell-label",
    cell: field,
    columnId: "columnId",
    disabled: false,
    formData: {},
    id: "cellId",
    percentage: 100,
    rowId: "rowId",
    rowIndex: 0,
    tableId: mockTableId,
  };

  const displayCellStringProps = {
    ...displayCellProps,
    cell: "Mock string",
  };

  const displayCellNoProps = {
    ...displayCellProps,
    ariaLabelledby: undefined,
    cell: {
      ...displayCellProps.cell,
      props: undefined,
    },
  };

  const displayCellReadOnlyProps = {
    ...displayCellProps,
    cell: {
      ...displayCellProps.cell,
      props: {
        ...displayCellProps.cell.props,
        initialValue: "123.45",
        readOnly: true,
      },
    },
  };

  const dynamicDisplayCellProps = {
    ariaLabelledby: "dynamic-display-cell-label",
    cell: dynamicField,
    columnId: "columnId",
    dynamicId: mockDynamicFieldId,
    disabled: false,
    id: "dynanicCellId",
    onBlurHandler: () => {},
    onChangeHandler: () => {},
    percentage: 100,
    rowId: "rowId",
    rowIndex: 0,
    tableId: mockTableId,
  };

  const dynamicDisplayCellLabelProps = {
    ...dynamicDisplayCellProps,
    cell: dynamicFieldWithDynamicLabel,
  };

  const dynamicDisplayCellStringProps = {
    ...dynamicDisplayCellProps,
    cell: "Mock string",
  };

  const dynamicDisplayCellReadOnlyProps = {
    ...dynamicDisplayCellProps,
    cell: {
      ...dynamicDisplayCellProps.cell,
      props: {
        ...dynamicDisplayCellProps.cell.props,
        initialValue: "123.45",
        readOnly: true,
      },
    },
  };

  const displayReadOnlyCellProps = {
    id: mockFieldId,
    hydrate: [
      {
        id: "mockId",
      },
    ],
    initialValue: "12.34",
    mask: "currency",
    rowIndex: 0,
  };

  const displayReadOnlyCellHydrateProps = {
    ...displayReadOnlyCellProps,
    hydrate: [
      {
        id: "mockId",
        name: "1234.56",
      },
    ],
  };

  const {
    addDynamicRow,
    displayCell,
    displayDynamicCell,
    displayReadOnlyCell,
    focusedRowIndex,
    localFieldData,
    removeDynamicRow,
    setFocusedRowIndex,
    setLocalFieldData,
  } = useContext(DynamicTableContext);

  return (
    <div>
      <button onClick={() => setFocusedRowIndex(1)}>setFocusedRowIndex</button>
      <h3>focusedRowIndex: {focusedRowIndex}</h3>

      <button onClick={() => setLocalFieldData(fieldData)}>
        setLocalFieldData
      </button>
      <h3>
        localFieldData: {localFieldData?.[mockDynamicTemplateId]?.[0]?.id}
      </h3>

      <button onClick={() => addDynamicRow(dynamicRowsTemplate)}>
        addDynamicRow
      </button>
      <h3>addDynamicRow: {localFieldData?.[mockDynamicTemplateId]?.[0]?.id}</h3>

      <button
        onClick={() =>
          removeDynamicRow(mockDynamicTemplateId, mockDynamicFieldId)
        }
      >
        removeDynamicRow
      </button>
      <h3>
        removeDynamicRow: {localFieldData?.[mockDynamicTemplateId]?.length}
      </h3>

      <h3>displayCell string: {displayCell(displayCellStringProps)}</h3>
      <h3>displayCell readOnly: {displayCell(displayCellReadOnlyProps)}</h3>
      <h3>
        displayDynamicCell string:{" "}
        {displayDynamicCell(dynamicDisplayCellStringProps)}
      </h3>
      <h3>
        displayDynamicCell readOnly:{" "}
        {displayDynamicCell(dynamicDisplayCellReadOnlyProps)}
      </h3>
      <h3>
        displayReadOnlyCell initialValue:{" "}
        {displayReadOnlyCell(displayReadOnlyCellProps)}
      </h3>
      <h3>
        displayReadOnlyCell hydrate:{" "}
        {displayReadOnlyCell(displayReadOnlyCellHydrateProps)}
      </h3>

      <div id="display-cell-label">displayCell label</div>
      <div id="dynamic-display-cell-label">displayDynamicCell label</div>
      <div id="rowId">Row 1</div>
      <div id="columnId">Column 1</div>

      {displayCell(displayCellProps)}
      {displayCell(displayCellNoProps)}
      {displayDynamicCell(dynamicDisplayCellProps)}
      {displayDynamicCell(dynamicDisplayCellLabelProps)}
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <DynamicTableProvider>
      <TestComponent />
    </DynamicTableProvider>
  </RouterWrappedComponent>
);

describe("<DynamicTableProvider />", () => {
  beforeEach(() => {
    mockGetValues(undefined);
    render(testComponent);
  });
  describe("displayCell()", () => {
    test("string", () => {
      const cell = screen.getByRole("heading", {
        name: "displayCell string: Mock string",
      });
      expect(cell).toBeVisible();
    });

    test("text field", () => {
      const cell = screen.getByRole("textbox", { name: "displayCell label" });
      expect(cell).toBeVisible();
    });

    test("no props", () => {
      const cell = screen.getByRole("textbox", { name: "Row 1 Column 1" });
      expect(cell).toBeVisible();
    });

    test("readOnly", () => {
      const cell = screen.getByRole("heading", {
        name: "displayCell readOnly: $123.45",
      });
      expect(cell).toBeVisible();
    });
  });

  describe("displayDynamicCell()", () => {
    test("string", () => {
      const cell = screen.getByRole("heading", {
        name: "displayDynamicCell string: Mock string",
      });
      expect(cell).toBeVisible();
    });

    test("number field", () => {
      const cell = screen.getByRole("textbox", {
        name: "displayDynamicCell label",
      });
      expect(cell).toBeVisible();
    });

    test("number field with dynamicLabel", () => {
      const cell = screen.getByRole("textbox", { name: "Row 1 Other:" });
      expect(cell).toBeVisible();
    });

    test("readOnly", () => {
      const cell = screen.getByRole("heading", {
        name: "displayDynamicCell readOnly: $123.45",
      });
      expect(cell).toBeVisible();
    });
  });

  describe("displayReadOnlyCell()", () => {
    test("hydrate", () => {
      const cell = screen.getByRole("heading", {
        name: "displayReadOnlyCell hydrate: $1,234.56",
      });
      expect(cell).toBeVisible();
    });

    test("initialValue", () => {
      const cell = screen.getByRole("heading", {
        name: "displayReadOnlyCell initialValue: $12.34",
      });
      expect(cell).toBeVisible();
    });
  });

  test("setFocusedRowIndex()", async () => {
    const button = screen.getByRole("button", { name: "setFocusedRowIndex" });
    const text = "focusedRowIndex: 1";
    expect(screen.queryByRole("heading", { name: text })).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole("heading", { name: text })).toBeVisible();
  });

  test("setLocalFieldData()", async () => {
    const button = screen.getByRole("button", { name: "setLocalFieldData" });
    const text = `localFieldData: ${mockDynamicFieldId}`;
    expect(screen.queryByRole("heading", { name: text })).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole("heading", { name: text })).toBeVisible();
  });

  test("addDynamicRow()", async () => {
    const button = screen.getByRole("button", { name: "addDynamicRow" });
    const text = `addDynamicRow: ${mockUuid}`;
    expect(screen.queryByRole("heading", { name: text })).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole("heading", { name: text })).toBeVisible();
  });

  test("removeDynamicRow()", async () => {
    const setLocalData = screen.getByRole("button", {
      name: "setLocalFieldData",
    });
    await act(async () => {
      await userEvent.click(setLocalData);
    });
    const button = screen.getByRole("button", { name: "removeDynamicRow" });
    const text = "removeDynamicRow: 0";
    expect(screen.queryByRole("heading", { name: text })).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole("heading", { name: text })).toBeVisible();
  });

  test("removeDynamicRow() - all rows already removed", async () => {
    const button = screen.getByRole("button", { name: "removeDynamicRow" });
    const text = "removeDynamicRow: 0";

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole("heading", { name: text })).toBeVisible();
  });

  testA11yAct(testComponent);
});
