import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

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
      screen.queryByText(mockModalOverlayReportPageJson.verbiage.intro.section)
    ).toBeNull();
    expect(screen.queryByTestId("review-submit-page")).toBeNull();
  });
});

describe("Test ReportPageWrapper accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.standard);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.drawer);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ModalDrawer should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ModalOverlay should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("DynamicModalOverlay should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.dynamicModalOverlay);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ReviewSubmit should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
