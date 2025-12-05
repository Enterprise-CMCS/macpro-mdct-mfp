import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import {
  mockReportStore,
  mockModalDrawerReportPageJson,
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockUnknownPageJson,
  mockModalOverlayReportPageJson,
} from "utils/testing/setupJest";
import { mockWpReportContext } from "../../utils/testing/mockReport";

import { ReportContext, ExportedReportWrapper } from "components";
import { testA11yAct } from "utils/testing/commonTests";

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

const exportedModalOverlayReportWrapperComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockModalOverlayReportPageJson} />
  </ReportContext.Provider>
);

const UnknownComponent = (
  <ReportContext.Provider value={mockWpReportContext}>
    <ExportedReportWrapper section={mockUnknownPageJson} />
  </ReportContext.Provider>
);

describe("<ExportedReportWrapper />", () => {
  describe("ExportedReportWrapper rendering", () => {
    test("ExportedModalOverlayReportSection renders", () => {
      render(exportedModalOverlayReportWrapperComponent);
      expect(screen.getByTestId("exportTable")).toBeInTheDocument();
    });

    test("renders default logic block correctly", () => {
      const { container } = render(UnknownComponent);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Standard", () => {
    test("exportedStandardReportWrapperComponent renders", () => {
      render(exportedStandardReportWrapperComponent);
      expect(
        screen.getByTestId("exportedStandardReportSection")
      ).toBeInTheDocument();
    });

    testA11yAct(exportedStandardReportWrapperComponent);
  });

  describe("Drawer", () => {
    test("exportedDrawerReportPageWrapperComponent renders", () => {
      render(exportedDrawerReportPageWrapperComponent);
      expect(
        screen.getByTestId("exportedDrawerReportSection")
      ).toBeInTheDocument();
    });

    testA11yAct(exportedDrawerReportPageWrapperComponent);
  });

  describe("Modal", () => {
    test("ExportedModalDrawerReportSection renders", () => {
      render(exportedModalDrawerReportWrapperComponent);
      expect(
        screen.getByTestId("exportedModalDrawerReportSection")
      ).toBeInTheDocument();
    });

    testA11yAct(exportedModalDrawerReportWrapperComponent);
  });
});
