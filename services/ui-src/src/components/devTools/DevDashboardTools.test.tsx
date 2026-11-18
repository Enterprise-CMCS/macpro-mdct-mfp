import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import { DevDashboardTools } from "./DevDashboardTools";
import userEvent from "@testing-library/user-event";
import { ReportType } from "types";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";

const mockReload = vi.fn();
const mockDelete = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

vi.mock("utils/api/requestMethods/report", () => ({
  deleteReportsForState: () => mockDelete(),
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
    screen.debug();

    expect(screen.getByRole("button", { name: "Delete Report" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete All Reports" })
    ).toBeVisible();
  });
  test("Mock delete all", async () => {
    const deleteBtn = screen.getByRole("button", {
      name: "Delete All Reports",
    });
    await userEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();
  });
});
