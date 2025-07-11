import { render } from "@testing-library/react";
import {
  mockABCDReportContext,
  RouterWrappedComponent,
} from "../../utils/testing/setupJest";
import { ReportContext } from "../reports/ReportProvider";
import { CreateAbcdModal } from "./CreateAbcdModal";
import { act } from "react-dom/test-utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedABCDReportContext = {
  ...mockABCDReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const mockSelectedABCDReport = {
  id: "mock-abcd-1",
  formData: {},
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedABCDReportContext}>
      <CreateAbcdModal
        activeState="CA"
        selectedReport={{ ...mockSelectedABCDReport, id: undefined }}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<CreateAbcdModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("New ABCD", () => {
    test("Adding a new report", async () => {
      await act(async () => {
        await render(modalComponent);
      });
    });
    testA11yAct(modalComponent);
  });
});
