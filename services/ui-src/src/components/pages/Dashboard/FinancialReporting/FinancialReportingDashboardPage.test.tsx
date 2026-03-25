import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "react-router";
// components
import { FinancialReportingDashboardPage, ReportContext } from "components";
// utils
import { useStore } from "utils";
import {
  mockFinancialReportNoReportContext,
  mockFinancialReportOneNotStartedReportContext,
  mockNoFinancialReportStore,
  mockNotStartedFinancialReportStore,
} from "utils/testing/financial-report/mockFinancialReport";
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import financialReportVerbiage from "verbiage/pages/financial-report/financial-report-dashboard";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-dashboard",
  })),
  useSearchParams: jest.fn(),
}));

const financialReportDashboardWithNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockFinancialReportNoReportContext}>
      <FinancialReportingDashboardPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const financialReportDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={mockFinancialReportOneNotStartedReportContext}
    >
      <FinancialReportingDashboardPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Financial Report Dashboard", () => {
  const mockSetSearchParams = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: mockGetSearchParams },
      mockSetSearchParams,
    ]);
  });

  test("Check that Financial Report Dashboard view renders with no reports", () => {
    mockedUseStore.mockReturnValue(mockNoFinancialReportStore);
    render(financialReportDashboardWithNoReports);

    //Check if the header and table are present
    expect(
      screen.getByRole("heading", { name: /MFP Financial Reporting Form/i })
    ).toBeVisible();
    expect(
      screen.queryByText(financialReportVerbiage.body.table.caption)
    ).toBeInTheDocument();

    //Check that the empty table message is present
    expect(
      screen.queryByText(financialReportVerbiage.body.empty)
    ).toBeInTheDocument();
  });

  test("Check that Financial Report Dashboard view renders with reports", () => {
    mockedUseStore.mockReturnValue(mockNotStartedFinancialReportStore);
    render(financialReportDashboardViewWithReports);

    //Check if the header and table are present
    expect(
      screen.getByRole("heading", { name: /MFP Financial Reporting Form/i })
    ).toBeVisible();
    expect(
      screen.queryByText(financialReportVerbiage.body.table.caption)
    ).toBeInTheDocument();

    //Check that the report data is present
    expect(
      screen.getByText(
        "Financial Report Submission Period: 1 Year: 2024 Status: Not started"
      )
    ).toBeInTheDocument();

    //Check that the empty table message is NOT present
    expect(
      screen.queryByText(financialReportVerbiage.body.empty)
    ).not.toBeInTheDocument();
  });
});

describe("Test FinancialReportingDashboardPage modal functionality", () => {
  const mockSetSearchParams = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: mockGetSearchParams },
      mockSetSearchParams,
    ]);
    mockedUseStore.mockReturnValue(mockNotStartedFinancialReportStore);
  });

  test("Check that modal opens when setModalReport is called with undefined", async () => {
    render(financialReportDashboardViewWithReports);

    const callToAction = financialReportVerbiage.body.callToAction;
    const addButton = screen.getByRole("button", { name: callToAction });
    expect(addButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(addButton);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /Add new MFP Financial Reporting Form submission/i,
        })
      ).toBeInTheDocument();
    });
  });

  test("Check that modal opens when setModalReport is called with a report", async () => {
    render(financialReportDashboardViewWithReports);

    const editModalButton = screen.getByRole("img", { name: /edit/i });
    expect(editModalButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(editModalButton);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /Edit MFP Financial Reporting Form submission/i,
        })
      ).toBeInTheDocument();
    });
  });
});
