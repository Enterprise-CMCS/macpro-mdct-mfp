import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { CloseEntityModal, ReportContext } from "components";
// utils
import {
  mockEntityDetailsOverlayJson,
  mockReportMethods,
  mockWPFullReport,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  report: {
    ...mockWPFullReport,
    fieldData: {
      ...mockWPFullReport.fieldData,
      initiative: [
        {
          id: "smockEntityId",
        },
      ],
    },
  },
});

const mockCloseHandler = jest.fn();

const mockEntityName = "mock-name";

const modalComponent = (
  <ReportContext.Provider value={mockReportMethods}>
    <CloseEntityModal
      entityName={mockEntityName}
      route={{
        ...mockEntityDetailsOverlayJson,
        entityType: "initiative", // must match selectedEntity for confirm test
      }}
      selectedEntity={{
        id: "mockEntityId",
        type: "initiative",
      }}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

const {
  closeOutModalBodyText,
  closeOutModalConfirmButtonText,
  closeOutModalTitle,
} = mockEntityDetailsOverlayJson.verbiage.closeOutModal;

const closeOutModalTitleWithName = closeOutModalTitle + mockEntityName;

describe("<CloseEntityModal />", () => {
  describe("Renders", () => {
    beforeEach(async () => {
      await act(async () => {
        await render(modalComponent);
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("CloseEntityModal shows the contents", () => {
      expect(screen.getByText(closeOutModalTitleWithName)).toBeTruthy();
      expect(screen.getByText(closeOutModalBodyText)).toBeTruthy();
      expect(screen.getByText(closeOutModalConfirmButtonText)).toBeTruthy();
      expect(screen.getByText("Cancel")).toBeTruthy();
    });

    test("CloseEntityModal top close button can be clicked", async () => {
      await userEvent.click(screen.getByText("Close"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("CloseEntityModal bottom cancel button can be clicked", async () => {
      await userEvent.click(screen.getByText("Cancel"));
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    test("CloseEntityModal confirm button can be clicked", async () => {
      await userEvent.click(screen.getByText("Confirm"));
      expect(mockReportMethods.updateReport).toHaveBeenCalled();
    });
  });

  testA11y(modalComponent);
});
