import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "react-router";
// components
import { ExpenditureDashboardPage, ReportContext } from "components";
// utils
import { useStore } from "utils";
import {
  mockExpenditureNoReportContext,
  mockExpenditureOneNotStartedReportContext,
  mockNoExpenditureStore,
  mockNotStartedExpenditureStore,
} from "utils/testing/expenditure/mockExpenditure";
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import expenditureVerbiage from "verbiage/pages/expenditure/expenditure-dashboard";

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

const expenditureDashboardWithNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockExpenditureNoReportContext}>
      <ExpenditureDashboardPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const expenditureDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockExpenditureOneNotStartedReportContext}>
      <ExpenditureDashboardPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Expenditure Report Dashboard", () => {
  const mockSetSearchParams = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: mockGetSearchParams },
      mockSetSearchParams,
    ]);
  });

  test("Check that Expenditure Dashboard view renders with no reports", () => {
    mockedUseStore.mockReturnValue(mockNoExpenditureStore);
    render(expenditureDashboardWithNoReports);

    //Check if the header and table are present
    expect(
      screen.getByRole("heading", { name: /MFP Expenditure/i })
    ).toBeVisible();
    expect(
      screen.queryByText(expenditureVerbiage.body.table.caption)
    ).toBeInTheDocument();

    //Check that the empty table message is present
    expect(
      screen.queryByText(expenditureVerbiage.body.empty)
    ).toBeInTheDocument();
  });

  test("Check that Expenditure Dashboard view renders with reports", () => {
    mockedUseStore.mockReturnValue(mockNotStartedExpenditureStore);
    render(expenditureDashboardViewWithReports);

    //Check if the header and table are present
    expect(
      screen.getByRole("heading", { name: /MFP Expenditure/i })
    ).toBeVisible();
    expect(
      screen.queryByText(expenditureVerbiage.body.table.caption)
    ).toBeInTheDocument();

    //Check that the report data is present
    expect(
      screen.getByText(
        "Expenditure Submission Period: 1 Year: 2024 Status: Not started"
      )
    ).toBeInTheDocument();

    //Check that the empty table message is NOT present
    expect(
      screen.queryByText(expenditureVerbiage.body.empty)
    ).not.toBeInTheDocument();
  });
});

describe("Test ExpenditureDashboardPage modal functionality", () => {
  const mockSetSearchParams = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: mockGetSearchParams },
      mockSetSearchParams,
    ]);
    mockedUseStore.mockReturnValue(mockNotStartedExpenditureStore);
  });

  test("Check that modal opens when setModalReport is called with undefined", async () => {
    render(expenditureDashboardViewWithReports);

    const callToAction = expenditureVerbiage.body.callToAction;
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
    render(expenditureDashboardViewWithReports);

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
