import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Table } from "components";

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

describe("Test Table", () => {
  beforeEach(() => {
    render(tableComponent);
  });

  test("Table is visible", () => {
    expect(screen.getByRole("table")).toBeVisible();
  });
});

describe("Test Table accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(tableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
