import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ExportedReportFieldRow } from "./ExportedReportFieldRow";
import { mockWpReportContext } from "utils/testing/setupJest";
import { ReportContext } from "components";
import { Table } from "@chakra-ui/react";

const field = {
  id: "test",
  validation: "string",
  type: "drawer",
  props: { hint: "hint", number: 123 },
};
const fieldWithLabel = {
  id: "test",
  validation: "string",
  type: "drawer",
  props: { hint: "hint", label: "test label" },
};

const fieldWithNoLabelorHint = {
  id: "test",
  validation: "string",
  type: "drawer",
  props: {},
};

const exportRow = (
  <ReportContext.Provider value={mockWpReportContext}>
    <Table>
      <tbody>
        <ExportedReportFieldRow formField={field} pageType="drawer" />
      </tbody>
    </Table>
  </ReportContext.Provider>
);

const dynamicRow = (
  <ReportContext.Provider value={mockWpReportContext}>
    <Table>
      <tbody>
        <ExportedReportFieldRow formField={fieldWithLabel} pageType="drawer" />
      </tbody>
    </Table>
  </ReportContext.Provider>
);

const noHintRow = (
  <ReportContext.Provider value={mockWpReportContext}>
    <Table>
      <tbody>
        <ExportedReportFieldRow
          formField={field}
          pageType="drawer"
          showHintText={false}
        />
      </tbody>
    </Table>
  </ReportContext.Provider>
);

const noHintNoLabel = (
  <ReportContext.Provider value={mockWpReportContext}>
    <Table>
      <tbody>
        <ExportedReportFieldRow
          formField={fieldWithNoLabelorHint}
          pageType="drawer"
        />
      </tbody>
    </Table>
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportRow);
    const row = screen.getByTestId("exportRow");
    expect(row).toBeVisible();
  });

  test("displays alternate prop fields", async () => {
    render(dynamicRow);
    const row = screen.getByTestId("exportRow");
    expect(row).toBeVisible();
  });

  test("displays hint text by default", async () => {
    render(exportRow);
    const hint = screen.getByText("hint");
    expect(hint).toBeVisible();
  });

  test("hides hint text when appropriate", async () => {
    render(noHintRow);
    const hint = screen.queryByText(/hint/);
    expect(hint).not.toBeInTheDocument();
  });

  test("Box element doesnt appear if there is no label or no hint", async () => {
    render(noHintNoLabel);
    const row = screen.getByTestId("exportRow");
    const box = screen.queryByTestId("parentBoxElement");
    expect(row).toBeVisible();
    expect(box).toBeNull();
  });
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportRow);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
