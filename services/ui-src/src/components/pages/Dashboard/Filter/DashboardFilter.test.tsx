import { render, screen, act, waitFor } from "@testing-library/react";
import { DashboardFilter } from "./DashboardFilter";
import { useSearchParams } from "react-router";
import userEvent from "@testing-library/user-event";

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

    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quarter/i)).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it('initializes with default "All" values when no search params', () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    expect(screen.getByLabelText(/year/i)).toHaveValue("All");

    expect(screen.getByLabelText(/quarter/i)).toHaveValue("All");
  });

  it("initializes with search params from URL", () => {
    mockGetSearchParams.mockImplementation((key: string) => {
      if (key === "year") return "2025";
      if (key === "quarter") return "1";
      return null;
    });

    render(<DashboardFilter />);

    expect(screen.getByLabelText(/year/i)).toHaveValue("2025");
    expect(screen.getByLabelText(/quarter/i)).toHaveValue("1");
  });

  it("updates year dropdown value on change", async () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const yearDropdown = screen.getByLabelText(/year/i);

    await act(async () => {
      userEvent.selectOptions(yearDropdown, "2025");
    });

    waitFor(() => {
      expect(yearDropdown).toHaveValue("2025");
    });
  });

  it("updates quarter dropdown value on change", async () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const quarterDropdown = screen.getByLabelText(/quarter/i);

    await act(async () => {
      userEvent.selectOptions(quarterDropdown, "2");
    });

    waitFor(() => {
      expect(quarterDropdown).toHaveValue("2");
    });
  });

  it("calls setSearchParams with selected values when Filter button is clicked", async () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);
    const yearDropdown = screen.getByLabelText(/year/i);
    const quarterDropdown = screen.getByLabelText(/quarter/i);
    const filterButton = screen.getByRole("button", { name: "Filter" });

    await act(async () => {
      userEvent.selectOptions(yearDropdown, "2026");
      userEvent.selectOptions(quarterDropdown, "4");
      await userEvent.click(filterButton);
    });

    waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith({
        year: "2026",
        quarter: "4",
      });
    });
  });

  it("applies filters with default values when Filter button clicked without changes", async () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const filterButton = screen.getByText("Filter");

    await act(async () => {
      await userEvent.click(filterButton);
    });

    waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith({
        year: "All",
        quarter: "All",
      });
    });
  });

  it("clears both dropdown values when Clear button is clicked", async () => {
    mockGetSearchParams.mockImplementation((key: string) => {
      if (key === "year") return "2025";
      if (key === "quarter") return "3";
      return null;
    });

    render(<DashboardFilter />);

    const clearButton = screen.getByRole("button", { name: "Clear" });

    await act(async () => {
      await userEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/year/i)).toHaveValue("All");
      expect(screen.getByLabelText(/quarter/i)).toHaveValue("All");
      expect(mockSetSearchParams).toHaveBeenCalledWith({});
    });
  });

  it("clears filters after user has made selections but not applied them", async () => {
    mockGetSearchParams.mockReturnValue(null);
    render(<DashboardFilter />);

    const yearDropdown = screen.getByLabelText(/year/i);
    const quarterDropdown = screen.getByLabelText(/quarter/i);
    const clearButton = screen.getByRole("button", { name: "Clear" });

    await act(async () => {
      userEvent.selectOptions(yearDropdown, "2025");
      userEvent.selectOptions(quarterDropdown, "3");
      await userEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(yearDropdown).toHaveValue("All");
      expect(quarterDropdown).toHaveValue("All");
      expect(mockSetSearchParams).toHaveBeenCalledWith({});
    });
  });
});
