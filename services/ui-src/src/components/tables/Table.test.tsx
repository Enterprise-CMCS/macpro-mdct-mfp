import { render, screen } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Table } from "components";
import { testA11yAct } from "utils/testing/commonTests";
// types
import { normalizeHeaderCell } from "./Table";

const tableContent = {
  caption: "mock caption",
  headRow: ["mock header 1", "mock header 2", "mock header 3"],
  bodyRows: [],
};

const tableComponent = (
  <RouterWrappedComponent>
    <Table content={tableContent} />
  </RouterWrappedComponent>
);

describe("<Table />", () => {
  test("Table is visible", () => {
    render(tableComponent);
    expect(screen.getByRole("table")).toBeVisible();
  });

  describe("normalizeHeaderCell()", () => {
    test("should convert string header to object with title property", () => {
      const result = normalizeHeaderCell("test header");
      expect(result).toEqual({ title: "test header" });
    });
  });

  describe("header rendering", () => {
    test("should render colSpan attribute on header cell when provided", () => {
      const contentWithColSpan = {
        caption: "test",
        headRow: ["Header 1", { title: "Actions", colSpan: 2 }],
        bodyRows: [],
      };
      render(
        <RouterWrappedComponent>
          <Table content={contentWithColSpan} />
        </RouterWrappedComponent>
      );
      expect(
        screen.getByRole("columnheader", { name: "Actions" })
      ).toHaveAttribute("colspan", "2");
    });

    test("should handle mixed string and object headers", () => {
      const mixedContent = {
        caption: "test",
        headRow: [
          "String header",
          { title: "Object header", colSpan: 2, align: "center" as const },
        ],
        bodyRows: [],
      };
      render(
        <RouterWrappedComponent>
          <Table content={mixedContent} />
        </RouterWrappedComponent>
      );
      const headerCells = screen.getAllByRole("columnheader");
      expect(headerCells).toHaveLength(2);
      expect(headerCells[0]).toHaveTextContent("String header");
      expect(headerCells[1]).toHaveTextContent("Object header");
      expect(headerCells[1]).toHaveAttribute("colspan", "2");
      expect(headerCells[1]).toHaveStyle({ textAlign: "center" });
    });
  });

  testA11yAct(tableComponent);
});
