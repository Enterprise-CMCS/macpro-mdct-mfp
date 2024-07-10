import { render, screen } from "@testing-library/react";
// components
import { ReportContext } from "components";
// utils
import { useStore } from "../../utils";
import { mockUseStore } from "../../utils/testing/setupJest";
import { ExportedOverlayModalReportSection } from "./ExportedOverlayModalReportSection";
import { mockWpReportContext } from "../../utils/testing/mockReport";
import { entityTypes } from "types";
import { mockOverlayModalPageJson } from "utils/testing/setupJest";

jest.mock("utils/state/useStore");

const mockEntity = {
  id: "mock-id-1",
  type: entityTypes[0],
  "mock-modal-text-field": "mock input 1",
};

const mockEntity2 = {
  id: "mock-id-2",
  type: entityTypes[0],
  "mock-modal-text-field": "mock input 1",
  fundingSources: [
    {
      fundingSources_quarters2024Q1: "7.00",
      fundingSources_quarters2024Q2: "7.00",
    },
  ],
};

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const entityMockStep = [
  "fundingSources",
  "III. Funding sources",
  "Add funding sources with projected quarterly expenditures",
  {
    id: "fundingSources_wpTopic",
    props: {
      label: "2024 1",
      mask: "currency",
    },
    transformation: { rule: "" },
    type: "number",
    validation: "number",
  },
  {
    id: "fundingSources_quarters2024Q1",
    props: {
      label: "2024 1",
      mask: "currency",
    },
    transformation: { rule: "" },
    type: "number",
    validation: "number",
  },
];

const exportedOverlayModalReportComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedOverlayModalReportSection
      entity={mockEntity}
      entityStep={entityMockStep}
      section={mockOverlayModalPageJson}
    />
  </ReportContext.Provider>
);

const exportedOverlayModalReportComponentEntityStep = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedOverlayModalReportSection
      entity={mockEntity2}
      entityStep={entityMockStep}
      section={mockOverlayModalPageJson}
    />
  </ReportContext.Provider>
);

describe("<ExportedOverlayModalReportSection />", () => {
  test("ExportedOverlayModalReportComponent renders", () => {
    render(exportedOverlayModalReportComponent);
    expect(screen.getByTestId("exportedOverlayModalPage")).toBeInTheDocument();
  });

  test("ExportedOverlayModalReportComponent returns entity step card", () => {
    render(exportedOverlayModalReportComponentEntityStep);
    expect(screen.getByTestId("exportedOverlayModalPage")).toBeInTheDocument();
  });
});
