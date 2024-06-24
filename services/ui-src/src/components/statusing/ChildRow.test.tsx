import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { ChildRow } from "./ChildRow";
import { TableRow } from "./TableRow";
import { ReportPageProgress } from "types";

const mockPage = {
  name: "name",
  path: "path",
  children: [] as ReportPageProgress[],
  status: false,
};

const childRowComponent = (
  <RouterWrappedComponent>
    <TableRow page={mockPage} rowDepth={2} />
    {mockPage.children?.map((child) => (
      <ChildRow key={child.path} page={child} rowDepth={2} />
    ))}
  </RouterWrappedComponent>
);

describe("Test ChildRow", () => {
  test("Check that childrow renders", () => {
    render(childRowComponent);
    expect(screen.getByText("add something here")).toBeVisible();
  });
});

describe("Test ChildRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(childRowComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
