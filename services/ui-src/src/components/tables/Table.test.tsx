import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Table } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const tableContent = {
  caption: "mock caption",
  headRow: ["mock header 1", "mock header 2", "mock header 3"],
  bodyRows: [],
};

const tableComponent = (
  <RouterWrappedComponent>
    <Table content={tableContent} variant="striped" />
  </RouterWrappedComponent>
);

describe("<Table />", () => {
  test("Table is visible", () => {
    render(tableComponent);
    expect(screen.getByRole("table")).toBeVisible();
  });

  testA11yAct(tableComponent);
});
