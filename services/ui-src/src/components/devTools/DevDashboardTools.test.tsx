import { render, screen } from "@testing-library/react";
import { DevDashboardTools } from "./DevDashboardTools";
import userEvent from "@testing-library/user-event";
import { ReportType } from "types";

const mockReload = vi.fn();
const mockUpload = vi.fn();
const mockDelete = vi.fn();

vi.mock("utils/api/requestMethods/uploads", async (importOriginal) => ({
  ...(await importOriginal()),
  uploadFileToS3: () => {
    mockUpload();
  },
  recordFileInDatabaseAndGetUploadUrl: vi
    .fn()
    .mockReturnValue({ presignedUploadUrl: "1234", fileId: "" }),
  getUploadedFiles: vi
    .fn()
    .mockReturnValue([
      { filename: "mock-name", fileSize: 100, fileId: "mock-id" },
    ]),
  deleteUploadsForState: () => {
    mockDelete();
  },
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
    expect(screen.getByText("Choose from folder")).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete Report" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete All Reports" })
    ).toBeVisible();
  });
  test("Mock delete all", async () => {
    const deleteBtn = screen.getByRole("button", {
      name: "Delete All Uploads",
    });
    await userEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();
  });
});
