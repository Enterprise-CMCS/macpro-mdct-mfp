import { render, screen } from "@testing-library/react";
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
import { testA11y } from "utils/testing/commonTests";

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

describe("<ChildRow />", () => {
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

  testA11y(childRowComponent);
});
