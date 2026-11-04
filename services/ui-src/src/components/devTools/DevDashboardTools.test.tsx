import { act, fireEvent, render, screen } from "@testing-library/react";
import { DevDashboardTools } from "./DevDashboardTools";
import userEvent from "@testing-library/user-event";

const mockReload = vi.fn();
const mockUpload = vi.fn();
const mockDelete = vi.fn();
const mockPng = new File(["0xMockPngData"], "bar.png", { type: "image/png" });

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
        datasets={[
          {
            label: "Flowers",
            value: "1234",
          },
        ]}
      />
    );
  });
  test("DevDashboardTools renders", () => {
    expect(screen.getByText("Choose from folder")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Generate Uploads" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete All Uploads" })
    ).toBeVisible();
  });
  test("Mock generating uploads", async () => {
    const dropArea = screen.getByLabelText("file drop area");
    await act(async () => {
      fireEvent.drop(dropArea, {
        dataTransfer: { items: [{ getAsFile: () => mockPng }] },
      });
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: "Amount To Generate:" }),
      "2"
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Generate Uploads" })
    );
    expect(mockUpload).toHaveBeenCalled();
  });
  test("Mock delete all", async () => {
    const deleteBtn = screen.getByRole("button", {
      name: "Delete All Uploads",
    });
    await userEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalled();
  });
});
