import { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import {
  DynamicTableContext,
  DynamicTableProvider,
} from "./DynamicTableProvider";
// types
import { AnyObject } from "types";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mocks = {
  addDynamicRow: ["addDynamicRow test"],
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
    "addDynamicRow",
    "focusedRowIndex",
    "localDynamicRows",
    "localReport",
  ];

  const methods: AnyObject = {
    addDynamicRow: () => addDynamicRow(mocks["addDynamicRow"]),
    focusedRowIndex: () => setFocusedRowIndex(mocks["focusedRowIndex"]),
    localDynamicRows: () => setLocalDynamicRows(mocks["localDynamicRows"]),
    localReport: () => setLocalReport(mocks["localReport"]),
  };

  const values: AnyObject = {
    addDynamicRow: localDynamicRows[0],
    focusedRowIndex,
    localDynamicRows: localDynamicRows[0],
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

  test("addDynamicRow()", async () => {
    const button = screen.getByRole("button", { name: "addDynamicRow" });
    const text = `addDynamicRow: ${mocks["addDynamicRow"][0]}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setFocusedRowIndex()", async () => {
    const button = screen.getByRole("button", { name: "focusedRowIndex" });
    const text = `focusedRowIndex: ${mocks["focusedRowIndex"]}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setLocalDynamicRows()", async () => {
    const button = screen.getByRole("button", { name: "localDynamicRows" });
    const text = `localDynamicRows: ${mocks["localDynamicRows"][0]}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  test("setLocalReport()", async () => {
    const button = screen.getByRole("button", { name: "localReport" });
    const text = `localReport: ${mocks["localReport"].id}`;
    expect(screen.queryByText(text)).toBeNull();

    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByText(text)).toBeVisible();
  });

  testA11yAct(testComponent);
});
