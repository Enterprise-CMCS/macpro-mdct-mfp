import { render, screen } from "@testing-library/react";
//components
import { Table } from "@chakra-ui/react";
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
        <TableRow page={page} rowDepth={rowDepth} />
      </Table>
    </RouterWrappedComponent>
  );
};

describe("<TableRow />", () => {
  describe("Test TableRow", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
    });

    test("TableRow renders correctly", () => {
      expect(screen.getByText("Transition Benchmarks")).toBeVisible();
      expect(screen.getByAltText("Success notification")).toBeVisible();
    });
  });

  testA11y(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
});
