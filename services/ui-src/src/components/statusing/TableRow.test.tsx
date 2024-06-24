import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ReportPageProgress } from "types";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { TableRow } from "./TableRow";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: false,
  })),
}));

interface RowProps {
  page: ReportPageProgress;
  rowDepth: number;
}

const tableComponent = ({ page, rowDepth }: RowProps) => {
  return (
    <RouterWrappedComponent>
      <TableRow page={page} rowDepth={rowDepth} />
    </RouterWrappedComponent>
  );
};

const mockPage = {
  name: "name",
  path: "path",
  children: [] as ReportPageProgress[],
  status: false,
};

describe("Test TableRow", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("mobile TableRow renders correctly", () => {
    render(tableComponent({ page: mockPage, rowDepth: 1 }));
    expect(screen.getByRole("table")).toBeVisible();
  });

  test("desktop TableRow renders correctly", () => {
    render(tableComponent({ page: mockPage, rowDepth: 1 }));
    expect(screen.getByRole("table")).toBeVisible();
  });
});

describe("Test TableRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      tableComponent({ page: mockPage, rowDepth: 1 })
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
