import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ChildRow } from "./ChildRow";
import { TableRow } from "./TableRow";
import { Table } from "@chakra-ui/react";
// utils
import { useStore } from "utils";
import {
  mockChildRowPage,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const childRowComponent = (
  <RouterWrappedComponent>
    <Table>
      <TableRow page={mockChildRowPage} rowDepth={2} />
      {mockChildRowPage.children?.map((child) => (
        <ChildRow key={child.path} page={child} rowDepth={2} />
      ))}
    </Table>
  </RouterWrappedComponent>
);

describe("Test ChildRow", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(childRowComponent);
  });
  test("Check that childrow renders", () => {
    const row = screen.getByRole("gridcell", {
      name: "State or Territory-Specific Initiatives",
    });
    expect(row).toBeVisible();
  });
});

describe("Test ChildRow accessibility", () => {
  test("Should not have basic accessibility issues", async () => {
    const { container } = render(childRowComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
