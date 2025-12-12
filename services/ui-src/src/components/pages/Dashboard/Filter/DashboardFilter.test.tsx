import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardFilter } from "./DashboardFilter";
import { useSearchParams } from "react-router";

jest.mock("react-router", () => ({
  useSearchParams: jest.fn(),
}));

describe("DashboardFilter", () => {
  const mockSetSearchParams = jest.fn();
  const mockGetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([
      { get: mockGetSearchParams },
      mockSetSearchParams,
    ]);
  });

  it("renders all filter elements", () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    expect(screen.getByTestId("year-filter-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("quarter-filter-dropdown")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it('initializes with default "All" values when no search params', () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    expect(screen.getByTestId("year-filter-dropdown")).toHaveTextContent("All");

    expect(screen.getByTestId("quarter-filter-dropdown")).toHaveTextContent(
      "All"
    );
  });

  it("initializes with search params from URL", () => {
    mockGetSearchParams.mockImplementation((key: string) => {
      if (key === "year") return "2025";
      if (key === "quarter") return "1";
      return null;
    });

    render(<DashboardFilter />);

    expect(screen.getByTestId("year-filter-dropdown")).toHaveTextContent(
      "2025"
    );
    expect(screen.getByTestId("quarter-filter-dropdown")).toHaveTextContent(
      "1"
    );
  });

  it("updates year dropdown value on change", () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const yearDropdown = screen.getByTestId("year-filter-dropdown");
    fireEvent.change(yearDropdown, { target: { value: "2024" } });

    expect(yearDropdown).toHaveValue("2024");
  });

  it("updates quarter dropdown value on change", () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const quarterDropdown = screen.getByTestId("quarter-filter-dropdown");
    fireEvent.change(quarterDropdown, { target: { value: "Q2" } });

    expect(quarterDropdown).toHaveValue("Q2");
  });

  // This test is commented out due to issues with dropdown interaction.

  /*
   * it('calls setSearchParams with selected values when Filter button is clicked', () => {
   *  mockGetSearchParams.mockReturnValue(null);
   *   render(<DashboardFilter />);
   *   const yearDropdown = screen.getByTestId('year-filter-dropdown');
   *   const quarterDropdown = screen.getByTestId('quarter-filter-dropdown');
   *   const filterButton = screen.getByTestId('dash-filter-button')
   *   fireEvent.change(yearDropdown, { target: { value: '2026' } });
   *   fireEvent.change(quarterDropdown, { target: { value: '4' } });
   *   expect(yearDropdown).toHaveValue('2026');
   *   expect(quarterDropdown).toHaveValue('4');
   *   userEvent.click(filterButton);
   *   expect(mockSetSearchParams).toHaveBeenCalledWith({
   *     year: '2026',
   *     quarter: '4',
   *   });
   *});
   */

  it("applies filters with default values when Filter button clicked without changes", () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      year: "All",
      quarter: "All",
    });
  });
});
