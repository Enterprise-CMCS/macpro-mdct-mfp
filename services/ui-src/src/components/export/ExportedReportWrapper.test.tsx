import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { useStore } from "utils";
import {
  mockReportStore,
  mockModalDrawerReportPageJson,
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
} from "utils/testing/setupJest";
import { mockWpReportContext } from "../../utils/testing/mockReport";

import { ReportContext, ExportedReportWrapper } from "components";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockReportStore);

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);
const exportedDrawerReportPageWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);
const exportedModalDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockModalDrawerReportPageJson} />
  </ReportContext.Provider>
);

describe("ExportedReportWrapper rendering", () => {
  test("exportedStandardReportWrapperComponent renders", () => {
    render(exportedStandardReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });
  test("exportedDrawerReportPageWrapperComponent renders", () => {
    render(exportedDrawerReportPageWrapperComponent);
    expect(
      screen.getByTestId("exportedDrawerReportSection")
    ).toBeInTheDocument();
  });
  test("ExportedModalDrawerReportSection renders", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalDrawerReportSection")
    ).toBeInTheDocument();
  });
});

describe("Test ExportedReportWrapper accessibility", () => {
  it("exportedStandardReportWrapperComponent should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it("exportedDrawerReportPageWrapperComponent should not have basic accessibility issues", async () => {
    const { container } = render(exportedDrawerReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it("exportedModalDrawerReportWrapperComponent should not have basic accessibility issues", async () => {
    const { container } = render(exportedModalDrawerReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
