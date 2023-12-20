import { render, screen } from "@testing-library/react";
// import { axe } from "jest-axe";
import { useStore } from "utils";
import {
  mockReportStore,
  mockModalDrawerReportPageJson,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";
import { mockWpReportContext } from "../../utils/testing/mockReport";

import { ReportContext, ExportedReportWrapper } from "components";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockReportStore);

const exportedModalDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockModalDrawerReportPageJson} />
  </ReportContext.Provider>
);

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);
describe("ExportedReportWrapper rendering", () => {
  test("ExportedModalDrawerReportSection renders", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalDrawerReportSection")
    ).toBeInTheDocument();
  });
  test("exportedStandardReportWrapperComponent renders", () => {
    render(exportedStandardReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });
});
