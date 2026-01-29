import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import {
  DynamicTableContext,
  DynamicTableProvider,
} from "./DynamicTableProvider";
// types
import { AnyObject, FormField } from "types";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("react-uuid", () => jest.fn(() => "mock-uuid"));

const mocks = {
  addDynamicRow: [
    { id: "dynamicRowId-category[0]", props: {} },
    "addDynamicRow test",
  ],
  focusedRowIndex: 1,
  localDynamicRows: [["localDynamicRows test"]],
  localReport: { id: "mockReportId" },
  removeDynamicRow: "",
};

const TestComponent = () => {
  const {
    addDynamicRow,
    focusedRowIndex,
    localDynamicRows,
    localReport,
    setFocusedRowIndex,
    setLocalDynamicRows,
    setLocalReport,
  } = useContext(DynamicTableContext);

  const buttons = [
    "addDynamicRowObject",
    "addDynamicRowString",
    "focusedRowIndex",
    "localDynamicRows",
    "localReport",
  ];

  const methods: AnyObject = {
    addDynamicRowObject: () => addDynamicRow(mocks["addDynamicRow"]),
    addDynamicRowString: () => addDynamicRow(mocks["addDynamicRow"]),
    focusedRowIndex: () => setFocusedRowIndex(mocks["focusedRowIndex"]),
    localDynamicRows: () => setLocalDynamicRows(mocks["localDynamicRows"]),
    localReport: () => setLocalReport(mocks["localReport"]),
  };

  const values: AnyObject = {
    addDynamicRowObject: (localDynamicRows[0]?.[0] as FormField)?.props
      ?.idOverride,
    addDynamicRowString: localDynamicRows[0]?.[1],
    focusedRowIndex,
    localDynamicRows: localDynamicRows.length,
    localReport: localReport?.id,
  };

  return (
    <div>
      {buttons.map((button, index) => (
        <div key={index}>
          <button onClick={methods[button]}>{button}</button>
          {values[button] && (
            <span>
              {button}: {values[button]}
            </span>
          )}
        </div>
      ))}
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
    render(testComponent);
  });

  test("addDynamicRow() - object", async () => {
    const button = screen.getByRole("button", { name: "addDynamicRowObject" });
    const text = "addDynamicRowObject: mock-uuid-category";
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("addDynamicRow() - string", async () => {
    const button = screen.getByRole("button", { name: "addDynamicRowString" });
    const text = "addDynamicRowString: addDynamicRow test";
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setFocusedRowIndex()", async () => {
    const button = screen.getByRole("button", { name: "focusedRowIndex" });
    const text = "focusedRowIndex: 1";
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setLocalDynamicRows()", async () => {
    const button = screen.getByRole("button", { name: "localDynamicRows" });
    const text = "localDynamicRows: 1";
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setLocalReport()", async () => {
    const button = screen.getByRole("button", { name: "localReport" });
    const text = "localReport: mockReportId";
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  testA11yAct(testComponent);
});
