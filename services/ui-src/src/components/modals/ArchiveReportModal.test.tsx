import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import {
  mockReportMethods,
  mockUseStore,
  mockWPFullReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { ReportContext } from "components/reports/ReportProvider";
import { testA11yAct } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";
import { ArchiveReportModal } from "./ArchiveReportModal";
import wpVerbiage from "verbiage/pages/wp/wp-dashboard";

jest.mock("utils/state/useStore");

const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const report = {
  ...mockWPFullReport,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportMethods}>
      <ArchiveReportModal
        adminState={report.state}
        archiveReport={mockReportMethods.archiveReport}
        reportId={report.id}
        reportType={report.reportType}
        fetchReportsByState={mockFetchReportsByState}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ArchiveReportModal />", () => {
  describe("Test ArchiveReportModal", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue(mockUseStore);
      render(modalComponent);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("the modal opens with correct content", () => {
      expect(screen.getByText(wpVerbiage.modalArchive.heading)).toBeTruthy();
      expect(screen.getByText(wpVerbiage.modalArchive.body)).toBeTruthy();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Archive" })).toBeTruthy();
    });

    test("after correct user input, archive button is enabled", async () => {
      expect(screen.getByRole("button", { name: "Archive" })).not.toBeEnabled();
      const inputTextbox = screen.getByTestId("modal-input");
      await userEvent.type(inputTextbox, "ARCHIVE");
      expect(screen.getByRole("button", { name: "Archive" })).toBeEnabled();
    });

    test("Archive button successfully archives the program", async () => {
      const inputTextbox = screen.getByTestId("modal-input");
      await userEvent.type(inputTextbox, "ARCHIVE");
      const archiveButton = screen.getByTestId("modal-archive-button");
      await userEvent.click(archiveButton);
      await expect(mockReportMethods.archiveReport).toHaveBeenCalledTimes(1);
    });
  });

  testA11yAct(modalComponent);
});
