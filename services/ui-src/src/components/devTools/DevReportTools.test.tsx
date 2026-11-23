import { render, screen } from "@testing-library/react";
import { DevReportTools } from "./DevReportTools";
import { useLocation } from "react-router";
import { MockedFunction } from "vitest";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";
import { mockUseStore, mockWpReportContext } from "utils/testing/setupTest";
import { ReportContext } from "components";

vi.mock("react-router");
const mockedUseLocation = useLocation as MockedFunction<typeof useLocation>;

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

vi.mock("./utils/wp", () => ({
  fillWorkPlanPage: vi.fn().mockReturnValue({}),
}));

describe("Test DevReportTools component", () => {
  beforeEach(() => {
    mockedUseLocation.mockReturnValue({
      pathname: "general",
      state: undefined,
      key: "",
      search: "",
      hash: "",
    });
    render(
      <ReportContext.Provider value={mockWpReportContext}>
        <DevReportTools />
      </ReportContext.Provider>
    );
  });
  test("DevReportTools renders", () => {
    expect(
      screen.getByText("Click the [Auto Fill Page] button to autofill the page")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Auto Fill Page" })
    ).toBeInTheDocument();
  });
  test("Fill a page", async () => {
    const fillBtn = screen.getByRole("button", { name: "Auto Fill Page" });
    await userEvent.click(fillBtn);
    expect(mockWpReportContext.updateReport).toHaveBeenCalled();
  });
});
