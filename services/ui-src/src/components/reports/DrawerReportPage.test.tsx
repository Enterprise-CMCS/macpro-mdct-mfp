import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, DrawerReportPage } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockUseStore,
  mockWPFullReport,
  mockWpReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import { ReportShape } from "types";
// constants
import { saveAndCloseText } from "../../constants";
import { testA11yAct } from "utils/testing/commonTests";

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockReportStoreWithoutEntities = {
  ...mockUseStore,
  report: {
    ...(mockWPFullReport as ReportShape),
    fieldData: {},
  },
};

const drawerReportPage = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockWpReportContext}>
      <DrawerReportPage route={mockDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<DrawerReportPage />", () => {
  describe("Test DrawerReportPage without entities", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockReportStoreWithoutEntities);
      render(drawerReportPage);
    });

    test("should render the view", () => {
      expect(
        screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });

    test("should not have any way to open the side drawer", () => {
      const drawerButtons = screen.queryAllByText("Enter");
      expect(drawerButtons).toEqual([]);
    });
  });

  describe("Test DrawerReportPage with entities", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(drawerReportPage);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render the view", () => {
      expect(
        screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });

    test("Opens the sidedrawer correctly", async () => {
      const visibleEntityText =
        mockWpReportContext.report.fieldData.entityType[0].name;
      expect(screen.getByText(visibleEntityText)).toBeVisible();
      const launchDrawerButton = screen.getAllByText("Enter")[0];
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    test("Submit sidedrawer opens and saves for state user", async () => {
      const visibleEntityText =
        mockWpReportContext.report.fieldData.entityType[0].name;
      expect(screen.getByText(visibleEntityText)).toBeVisible();
      const launchDrawerButton = screen.getAllByText("Enter")[0];
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
      const textField = await screen.getByLabelText("mock drawer text field");
      expect(textField).toBeVisible();
      await act(async () => {
        await userEvent.type(textField, "test");
      });
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await act(async () => {
        await userEvent.click(saveAndCloseButton);
      });
      expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(1);
    });

    test("Submit sidedrawer doesn't save if no change was made by State User", async () => {
      const visibleEntityText =
        mockWpReportContext.report.fieldData.entityType[0].name;
      expect(screen.getByText(visibleEntityText)).toBeVisible();
      const launchDrawerButton = screen.getAllByText("Enter")[0];
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
      const textField = await screen.getByLabelText("mock drawer text field");
      expect(textField).toBeVisible();
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await act(async () => {
        await userEvent.click(saveAndCloseButton);
      });
      expect(mockWpReportContext.updateReport).toHaveBeenCalledTimes(0);
    });
  });

  testA11yAct(drawerReportPage, () => {
    mockedUseStore.mockReturnValue(mockUseStore);
  });
});
