import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { DynamicModalOverlayReportPage } from "components";
// types
import { ReportType } from "types";
// utils
import {
  RouterWrappedComponent,
  mockDynamicModalOverlayEntityStepsReportPageJson,
  mockDynamicModalOverlayReportPageJson,
  mockReportStore,
  mockUseEntityStore,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

const mockSetSidebarHidden = jest.fn();

const {
  dashboardSubtitle,
  dashboardTitle,
  emptyDashboardText,
  enterEntityDetailsButtonText,
} = mockDynamicModalOverlayReportPageJson.verbiage;

const cloneEntityStore = structuredClone(mockUseEntityStore);
const emptyStore = {
  ...cloneEntityStore,
  report: {
    ...cloneEntityStore.report,
    fieldData: {},
  },
};

const emptyReport = {
  ...cloneEntityStore,
  report: undefined,
};

const dynamicModalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <DynamicModalOverlayReportPage
      route={mockDynamicModalOverlayEntityStepsReportPageJson}
      setSidebarHidden={mockSetSidebarHidden}
    />
  </RouterWrappedComponent>
);

describe("<DynamicModalOverlayReportPage />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders desktop table", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: false });
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(dynamicModalOverlayReportPageComponent);

    expect(screen.getAllByRole("columnheader")).toHaveLength(1);
    expect(
      screen.getByRole("columnheader", { name: "Mock table header" })
    ).toBeVisible();

    expect(screen.getByRole("heading", { name: dashboardTitle, level: 3 }));
    expect(screen.getByRole("heading", { name: dashboardSubtitle, level: 2 }));
  });

  test("renders mobile table", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: true, isTablet: true });
    mockedUseStore.mockReturnValue(mockUseEntityStore);
    render(dynamicModalOverlayReportPageComponent);

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.queryByRole("columnheader", { name: "Mock table header" })
    ).not.toBeInTheDocument();
  });

  test("shows empty table message", async () => {
    mockedUseStore.mockReturnValue(emptyStore);
    render(dynamicModalOverlayReportPageComponent);

    expect(screen.getByText(emptyDashboardText)).toBeVisible();
    expect(screen.getByRole("heading", { name: dashboardTitle, level: 3 }));
  });

  test("throws error for missing report", async () => {
    mockedUseStore.mockReturnValue(emptyReport);
    expect(() => render(dynamicModalOverlayReportPageComponent)).toThrow(
      "Cannot render DynamicModalOverlayPage without a report"
    );
  });

  test("opens and closes overlay", async () => {
    mockedUseStore.mockReturnValue({
      ...mockUseEntityStore,
      report: {
        ...cloneEntityStore.report,
        reportType: ReportType.SAR,
      },
    });
    render(dynamicModalOverlayReportPageComponent);
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });
    expect(
      screen.getByRole("heading", {
        name: "State or Territory-Specific Initiatives",
        level: 1,
      })
    );
    expect(
      screen.getByRole("heading", { name: "mock-initiative-name", level: 2 })
    );

    const backButton = screen.getAllByRole("button", {
      name: "Return to all initiatives",
    });
    expect(backButton).toHaveLength(2);

    await act(async () => {
      await userEvent.click(backButton[0]);
    });
    expect(backButton[0]).not.toBeInTheDocument();
  });

  testA11yAct(dynamicModalOverlayReportPageComponent, () => {
    mockedUseStore.mockReturnValue(mockReportStore);
  });
});
