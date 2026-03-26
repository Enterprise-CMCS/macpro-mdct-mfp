import { act, render, screen } from "@testing-library/react";
// components
import { ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockDynamicModalOverlayReportPageJson,
  mockLDFlags,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockReportJson,
  mockStandardReportPageJson,
  mockUseEntityStore,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { testA11yAct } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseEntityStore);

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
        screen.getByRole("button", {
          name: mockModalDrawerReportPageJson.verbiage.addEntityButtonText,
        })
      ).toBeVisible();
    });

    test("ReportPageWrapper loads ModalOverlayReportPageV2 with flag on", async () => {
      mockLDFlags.set({ wpSarRelease2025: true });
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
      render(ReportPageWrapperComponent);

      const enterDetailsButton = screen.getByRole("button", {
        name: mockModalDrawerReportPageJson.verbiage
          .enterEntityDetailsButtonText,
      });

      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });

      const backButton = screen.getByRole("button", {
        name: "Return to all initiatives",
      });
      expect(backButton).toBeVisible();
    });

    test("ReportPageWrapper loads ModalOverlayReportPageV1 with flag off", async () => {
      mockLDFlags.set({ wpSarRelease2025: false });
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
      render(ReportPageWrapperComponent);

      const enterDetailsButton = screen.getByRole("button", {
        name: mockModalDrawerReportPageJson.verbiage
          .enterEntityDetailsButtonText,
      });

      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });

      const backButton = screen.queryByRole("button", {
        name: "Return to all initiatives",
      });
      expect(backButton).not.toBeInTheDocument();
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
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.standard);
    });
  });

  describe("drawer", () => {
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.drawer);
    });
  });

  describe("modalDrawer", () => {
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
    });
  });

  describe("modalOverlay", () => {
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
    });
  });

  describe("dynamicModalOverlay", () => {
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.dynamicModalOverlay);
    });
  });

  describe("reviewSubmit", () => {
    testA11yAct(ReportPageWrapperComponent, () => {
      mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
    });
  });
});
