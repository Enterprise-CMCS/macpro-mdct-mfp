import { render, screen } from "@testing-library/react";
//components
import { Table, Tbody } from "@chakra-ui/react";
import { TableRow } from "./TableRow";
//types
import { ReportPageProgress } from "types";
// utils
import { useStore } from "utils";
import {
  mockTableRowPage,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: false,
  })),
}));

interface RowProps {
  page: ReportPageProgress;
  rowDepth: number;
}

const tableRowComponent = ({ page, rowDepth }: RowProps) => {
  return (
    <RouterWrappedComponent>
      <Table>
        <Tbody>
          <TableRow page={page} rowDepth={rowDepth} />
        </Tbody>
      </Table>
    </RouterWrappedComponent>
  );
};

describe("<TableRow />", () => {
  test("TableRow renders correctly", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
    expect(screen.getByText("Transition Benchmarks")).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
  });

  testA11y(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
});
