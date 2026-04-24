import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { DynamicModalOverlayReportPageV2, ReportContext } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  RouterWrappedComponent,
  mockDynamicModalOverlayReportPageJson,
  mockModalOverlayReportPageJson,
  mockReportFieldData,
  mockSARReportStore,
  mockUseSARStore,
  mockWPFullReport,
  mockWpReportContext,
} from "utils/testing/setupJest";
import { useBreakpoint, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { mockAdminUser, mockStateUser } from "utils/testing/mockUsers";

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
    <ReportContext.Provider value={mockWpReportContext}>
      <DynamicModalOverlayReportPageV2
        route={route as any}
        setSidebarHidden={mockSetSidebarHidden}
      />
    </ReportContext.Provider>
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
    mockedUseStore.mockReturnValue({
      ...mockUseSARStore,
      setSelectedEntity: jest.fn(),
    });
    render(dynamicModalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const backButton = screen.getByRole("button", {
      name: mockModalOverlayReportPageJson.verbiage.backButtonText,
    });
    await act(async () => {
      await userEvent.click(backButton);
    });
    expect(backButton).not.toBeInTheDocument();
  });

  test("submits overlay form for state user", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUser,
      ...mockWpReportContext,
      editable: true,
      setAutosaveState: jest.fn(),
      setSelectedEntity: jest.fn(),
    });
    render(dynamicModalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const button = screen.getByRole("button", {
      name: "Save & return",
    });
    const inputs = screen.getAllByRole("textbox");

    for (const input of inputs) {
      await act(async () => {
        await userEvent.type(input, "123");
      });
    }

    await act(async () => {
      await userEvent.click(button);
    });

    expect(mockWpReportContext.updateReport).toHaveBeenCalledWith(
      {
        id: mockWPFullReport.id,
        reportType: mockWPFullReport.reportType,
        state: mockStateUser.user?.state,
      },
      {
        fieldData: {
          entityType: [
            {
              ...mockReportFieldData.entityType[0],
              "mock-number-field": "123",
              "mock-optional-text-field": "123",
              "mock-text-field": "123",
            },
          ],
        },
        metadata: {
          lastAlteredBy: mockStateUser.user?.full_name,
          status: ReportStatus.IN_PROGRESS,
        },
      }
    );
  });

  test("does not submits overlay form for admin user", async () => {
    mockedUseStore.mockReturnValue({
      ...mockAdminUser,
      ...mockWpReportContext,
      editable: true,
      setAutosaveState: jest.fn(),
      setSelectedEntity: jest.fn(),
    });
    render(dynamicModalOverlayReportPageComponent());
    const enterDetailsButton = screen.getByRole("button", {
      name: enterEntityDetailsButtonText,
    });

    await act(async () => {
      await userEvent.click(enterDetailsButton);
    });

    const button = screen.getByRole("button", {
      name: "Return",
    });
    await act(async () => {
      await userEvent.click(button);
    });

    expect(mockWpReportContext.updateReport).not.toHaveBeenCalled();
  });

  testA11yAct(dynamicModalOverlayReportPageComponent(), () => {
    mockedUseStore.mockReturnValue(mockSARReportStore);
  });
});
