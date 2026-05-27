import { fireEvent, render, screen } from "@testing-library/react";
//components
import { Table, Tbody } from "@chakra-ui/react";
import { TableRow } from "./TableRow";
//types
import { ReportPageProgress, ReportType } from "types";
// utils
import { useStore } from "utils";
import {
  mockFinancialReportingFormTableRowPage,
  mockRETTableRowPage,
  mockTableRowPage,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isMobile: false,
  })),
}));

interface RowProps {
  page: ReportPageProgress;
  rowDepth: number;
}

const tableRowComponent = ({ page, rowDepth }: RowProps) => {
  return (
    <RouterWrappedComponent>
      <Table>
        <Tbody>
          <TableRow page={page} rowDepth={rowDepth} />
        </Tbody>
      </Table>
    </RouterWrappedComponent>
  );
};

describe("<TableRow />", () => {
  test("TableRow renders correctly", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
    expect(screen.getByText("Transition Benchmarks")).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Edit Transition Benchmarks" })
    ).toBeVisible();
  });

  test("TableRow renders correctly across breakpoints", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
    expect(screen.getByText("Transition Benchmarks")).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Edit Transition Benchmarks" })
    ).toBeVisible();

    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    expect(screen.getByText("Transition Benchmarks")).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Edit Transition Benchmarks" })
    ).toBeVisible();
  });

  test("TableRow does not display status for RET HCBS", () => {
    mockedUseStore.mockReturnValue(mockUseStore);
    render(tableRowComponent({ page: mockRETTableRowPage, rowDepth: 0 }));
    expect(screen.getByText(mockRETTableRowPage.name)).toBeVisible();
    expect(screen.queryByAltText("Success notification")).toBeNull();
  });

  test("TableRow displays success status for Financial Reporting Form General Information page", () => {
    mockedUseStore.mockReturnValue({
      report: {
        reportType: ReportType.FINANCIAL_REPORT,
      },
    });
    render(
      tableRowComponent({
        page: {
          ...mockFinancialReportingFormTableRowPage,
          status: true,
        },
        rowDepth: 0,
      })
    );
    expect(
      screen.getByText(mockFinancialReportingFormTableRowPage.name)
    ).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
  });

  test("TableRow displays error status for Financial Reporting Form General Information page", () => {
    mockedUseStore.mockReturnValue({
      report: {
        reportType: ReportType.FINANCIAL_REPORT,
      },
    });
    render(
      tableRowComponent({
        page: {
          ...mockFinancialReportingFormTableRowPage,
          status: false,
        },
        rowDepth: 0,
      })
    );
    expect(
      screen.getByText(mockFinancialReportingFormTableRowPage.name)
    ).toBeVisible();
    expect(screen.getByAltText("Error notification")).toBeVisible();
  });

  test("TableRow displays success status for Financial Reporting Form FMAP page", () => {
    mockedUseStore.mockReturnValue({
      report: {
        reportType: ReportType.FINANCIAL_REPORT,
      },
    });
    render(
      tableRowComponent({
        page: {
          ...mockFinancialReportingFormTableRowPage,
          path: "/financial-report/fmap-percentages",
          status: true,
        },
        rowDepth: 0,
      })
    );
    expect(
      screen.getByText(mockFinancialReportingFormTableRowPage.name)
    ).toBeVisible();
    expect(screen.getByAltText("Success notification")).toBeVisible();
  });

  test("TableRow displays error status for Financial Reporting Form FMAP page", () => {
    mockedUseStore.mockReturnValue({
      report: {
        reportType: ReportType.FINANCIAL_REPORT,
      },
    });
    render(
      tableRowComponent({
        page: {
          ...mockFinancialReportingFormTableRowPage,
          path: "/financial-report/fmap-percentages",
          status: false,
        },
        rowDepth: 0,
      })
    );
    expect(
      screen.getByText(mockFinancialReportingFormTableRowPage.name)
    ).toBeVisible();
    expect(screen.getByAltText("Error notification")).toBeVisible();
  });

  test("TableRow does not display status for other Financial Reporting Form pages", () => {
    mockedUseStore.mockReturnValue({
      report: {
        reportType: ReportType.FINANCIAL_REPORT,
      },
    });
    render(
      tableRowComponent({
        page: mockTableRowPage,
        rowDepth: 0,
      })
    );
    expect(screen.getByText(mockTableRowPage.name)).toBeVisible();
    expect(screen.queryByAltText("Success notification")).toBeNull();
    expect(screen.queryByAltText("Error notification")).toBeNull();
  });

  testA11yAct(tableRowComponent({ page: mockTableRowPage, rowDepth: 1 }));
});
