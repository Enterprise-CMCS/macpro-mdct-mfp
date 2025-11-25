import { render, screen } from "@testing-library/react";
// components
import { ChildRow } from "./ChildRow";
import { TableRow } from "./TableRow";
import { Table, Tbody } from "@chakra-ui/react";
// utils
import { useStore } from "utils";
import {
  mockChildRowPage,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const childRowComponent = (
  <RouterWrappedComponent>
    <Table>
      <Tbody>
        <TableRow page={mockChildRowPage} rowDepth={2} />
        {mockChildRowPage.children?.map((child) => (
          <ChildRow key={child.path} page={child} rowDepth={2} />
        ))}
      </Tbody>
    </Table>
  </RouterWrappedComponent>
);

describe("<ChildRow />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(childRowComponent);
    });

    test("Check that childrow renders", () => {
      const row = screen.getByRole("cell", {
        name: "State or Territory-Specific Initiatives",
      });
      expect(row).toBeVisible();
    });
  });

  testA11yAct(childRowComponent);
});
