import { render, screen } from "@testing-library/react";
// components
import { ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockReportJson,
  mockStandardReportPageJson,
  RouterWrappedComponent,
  mockWpReportContext,
  mockUseStore,
  mockDynamicModalOverlayReportPageJson,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { testA11y } from "utils/testing/commonTests";

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockLocations = {
  standard: { pathname: mockReportJson.flatRoutes[0].path },
  drawer: { pathname: mockReportJson.flatRoutes[1].path },
  modalDrawer: { pathname: mockReportJson.flatRoutes[2].path },
  modalOverlay: { pathname: mockReportJson.flatRoutes[4].path },
  dynamicModalOverlay: { pathname: mockReportJson.flatRoutes[5].path },
  reviewSubmit: { pathname: mockReportJson.flatRoutes[6].path },
};

const ReportPageWrapperComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ReportPageWrapper />", () => {
  describe("Test ReportPageWrapper view", () => {
    test("ReportPageWrapper StandardFormSection view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.standard);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
      ).toBeVisible();
    });

    test("ReportPageWrapper DrawerSection view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.drawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalDrawerReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockModalDrawerReportPageJson.verbiage.addEntityButtonText
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalOverlayReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockModalOverlayReportPageJson.verbiage.intro.section)
      ).toBeVisible();
    });

    test("ReportPageWrapper DynamicModalOverlayReportPagte view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.dynamicModalOverlay);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockDynamicModalOverlayReportPageJson.verbiage.intro.section
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ReviewSubmitPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
      render(ReportPageWrapperComponent);
      expect(screen.getByTestId("review-submit-page")).toBeVisible();
    });
  });

  describe("Test ReportPageWrapper functionality", () => {
    afterEach(() => jest.clearAllMocks());

    test("ReportPageWrapper doesn't display report if no matching report route template", () => {
      mockUseLocation.mockReturnValue({ pathname: "" });
      render(ReportPageWrapperComponent);
      expect(
        screen.queryByText(mockStandardReportPageJson.verbiage.intro.section)
      ).toBeNull();
      expect(
        screen.queryByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeNull();
      expect(
        screen.queryByText(
          mockModalDrawerReportPageJson.verbiage.addEntityButtonText
        )
      ).toBeNull();
      expect(
        screen.queryByText(
          mockModalOverlayReportPageJson.verbiage.intro.section
        )
      ).toBeNull();
      expect(screen.queryByTestId("review-submit-page")).toBeNull();
    });
  });

  describe("standard", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.standard);
    });
  });

  describe("drawer", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.drawer);
    });
  });

  describe("modalDrawer", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
    });
  });

  describe("modalOverlay", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
    });
  });

  describe("dynamicModalOverlay", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.dynamicModalOverlay);
    });
  });

  describe("reviewSubmit", () => {
    testA11y(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
    });
  });
});
