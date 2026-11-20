import { MockedFunction } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DevDashboardTools } from "./DevDashboardTools";
import userEvent from "@testing-library/user-event";
import { ReportType } from "types";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";

const mockApprove = vi.fn();
const mockDelete = vi.fn();
const mockDeleteAll = vi.fn();
const mockReload = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

vi.mock("utils/api/requestMethods/report", () => ({
  approveReportDev: () => mockApprove(),
  deleteReport: () => mockDelete(),
  deleteReportsForState: () => mockDeleteAll(),
}));

describe("Test DevDashboardTools component", () => {
  beforeEach(() => {
    render(
      <DevDashboardTools
        state={"PA"}
        reload={mockReload}
        reportType={ReportType.WP}
      />
    );
  });
  test("DevDashboardTools renders", () => {
    expect(
      screen.getByRole("button", { name: "Approve Report" })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete Report" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete All Reports" })
    ).toBeVisible();
  });
  test("Mock approval", async () => {
    const approveBtn = screen.getByRole("button", { name: "Approve Report" });
    await userEvent.click(approveBtn);
    expect(mockApprove).toHaveBeenCalled();
  });
  test("Mock delete individual report", async () => {
    const deleteBtn = screen.getByRole("button", { name: "Delete Report" });
    expect(deleteBtn).toBeDisabled();
    const selectReport = screen.getByLabelText("select a report to delete");
    fireEvent.change(selectReport, {
      target: { value: "mock-wp-full-report-id" },
    });
    await userEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();
  });
  test("Mock delete all", async () => {
    const deleteBtn = screen.getByRole("button", {
      name: "Delete All Reports",
    });
    await userEvent.click(deleteBtn);
    expect(mockDeleteAll).toHaveBeenCalled();
  });
});
