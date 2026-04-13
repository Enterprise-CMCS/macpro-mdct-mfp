import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { DynamicModalOverlayReportPageV2 } from "components";
// utils
import {
  RouterWrappedComponent,
  mockDynamicModalOverlayReportPageJson,
  mockModalOverlayReportPageJson,
  mockSARReportStore,
  mockUseSARStore,
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

const { dashboardSubtitle, dashboardTitle, enterEntityDetailsButtonText } =
  mockDynamicModalOverlayReportPageJson.verbiage;

const dynamicModalOverlayReportPageComponent = (
  route = mockModalOverlayReportPageJson
) => (
  <RouterWrappedComponent>
    <DynamicModalOverlayReportPageV2
      route={route as any}
      setSidebarHidden={mockSetSidebarHidden}
    />
  </RouterWrappedComponent>
);

describe("<DynamicModalOverlayReportPage />", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({ isMobile: false, isTablet: false });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders desktop table", () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
    render(dynamicModalOverlayReportPageComponent());

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.getByRole("columnheader", { name: "Mock table header" })
    ).toBeVisible();

    expect(screen.getByRole("heading", { name: dashboardTitle, level: 3 }));
    expect(screen.getByRole("heading", { name: dashboardSubtitle, level: 2 }));
  });

  test("renders mobile table", () => {
    mockUseBreakpoint.mockReturnValue({ isMobile: true, isTablet: true });
    mockedUseStore.mockReturnValue(mockUseSARStore);
    render(dynamicModalOverlayReportPageComponent());

    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.queryByRole("columnheader", { name: "Mock table header" })
    ).not.toBeInTheDocument();
  });

  test("opens and closes overlay", async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
    render(dynamicModalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const backButton = screen.getByRole("button", {
      name: "Return to all initiatives",
    });
    await act(async () => {
      await userEvent.click(backButton);
    });
    expect(backButton).not.toBeInTheDocument();
  });

  testA11yAct(dynamicModalOverlayReportPageComponent(), () => {
    mockedUseStore.mockReturnValue(mockSARReportStore);
  });
});
