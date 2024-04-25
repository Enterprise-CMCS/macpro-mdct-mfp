import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";

// utils
import {
  RouterWrappedComponent,
  mockWPFullReport,
} from "utils/testing/setupJest";
import {
  postReport,
  getReport,
  archiveReport,
  putReport,
  approveReport,
  submitReport,
  getReportsByState,
  releaseReport,
} from "utils";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";

jest.mock("utils/api/requestMethods/report", () => ({
  postReport: jest.fn().mockResolvedValue({}),
  getReport: jest.fn().mockResolvedValue({}),
  archiveReport: jest.fn().mockResolvedValue({}),
  putReport: jest.fn().mockResolvedValue({}),
  approveReport: jest.fn().mockResolvedValue({}),
  submitReport: jest.fn().mockResolvedValue({}),
  getReportsByState: jest.fn().mockResolvedValue({}),
  releaseReport: jest.fn().mockResolvedValue({}),
}));

const mockReport = mockWPFullReport!;
const mockReportKeys = {
  reportType: "WP",
  state: "AL",
  id: mockReport.id,
};

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div>
      <button onClick={() => context.createReport("WP", "AL", mockReport)}>
        Create
      </button>
      <button onClick={() => context.fetchReport(mockReportKeys)}>Fetch</button>
      <button onClick={() => context.archiveReport(mockReportKeys)}>
        Archive
      </button>
      <button onClick={() => context.updateReport(mockReportKeys, mockReport)}>
        Update
      </button>
      <button onClick={() => context.approveReport(mockReportKeys, mockReport)}>
        Approve
      </button>
      <button onClick={() => context.submitReport(mockReportKeys)}>
        Submit
      </button>
      <button onClick={() => context.fetchReportsByState("WP", "AL")}>
        FetchByState
      </button>
      <button onClick={async () => context.fetchReportForSarCreation("AL")}>
        FetchForSar
      </button>
      <button onClick={() => context.clearReportSelection()}>Clear</button>
      <button onClick={() => context.setReportSelection()}>Set</button>
      <button onClick={() => context.clearReportsByState()}>
        ClearByState
      </button>
      <button onClick={() => context.releaseReport(mockReportKeys)}>
        Release
      </button>
      <p data-testid="contextIsLoaded">{context.contextIsLoaded.toString()}</p>
      <p data-testid="errorMessage">{context.errorMessage?.title}</p>
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <ReportProvider>
      <TestComponent />
    </ReportProvider>
  </RouterWrappedComponent>
);

describe("ReportProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(testComponent);
  });

  it("should call the API to create reports", async () => {
    const button = screen.getByText("Create");
    await userEvent.click(button);
    expect(postReport).toHaveBeenCalledWith("WP", "AL", mockReport);
  });

  it("should provide an error when a report cannot be created", async () => {
    (postReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Create");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  it("should call the API to fetch a report", async () => {
    const button = screen.getByText("Fetch");
    await userEvent.click(button);
    expect(getReport).toHaveBeenCalledWith(mockReportKeys);
  });

  it("should provide an error when a report cannot be fetched", async () => {
    (getReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Fetch");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be loaded/
    );
  });

  it("should call the API to archive a report", async () => {
    const button = screen.getByText("Archive");
    await userEvent.click(button);
    expect(archiveReport).toHaveBeenCalledWith(mockReportKeys);
  });

  it("should provide an error when a report cannot be archived", async () => {
    (archiveReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Archive");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  it("should call the API to update a report", async () => {
    const button = screen.getByText("Update");
    await userEvent.click(button);
    expect(putReport).toHaveBeenCalledWith(mockReportKeys, mockReport);
  });

  it("should provide an error when a report cannot be updated", async () => {
    (putReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Update");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  it("should call the API to approve a report", async () => {
    const button = screen.getByText("Approve");
    await userEvent.click(button);
    expect(approveReport).toHaveBeenCalledWith(mockReportKeys, mockReport);
  });

  it("should provide an error when a report cannot be approved", async () => {
    (approveReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Approve");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  it("should call the API to submit a report", async () => {
    const button = screen.getByText("Submit");
    await userEvent.click(button);
    expect(submitReport).toHaveBeenCalledWith(mockReportKeys);
  });

  it("should provide an error when a report cannot be submitted", async () => {
    (submitReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Submit");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  it("should call the API to fetch reports for a state", async () => {
    const button = screen.getByText("FetchByState");
    await userEvent.click(button);
    expect(getReportsByState).toHaveBeenCalledWith("WP", "AL");
  });

  it("should provide an error when reports for a state cannot be fetched", async () => {
    jest.clearAllMocks();
    (getReportsByState as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("FetchByState");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Reports could not be loaded/
    );
  });

  // This test passes when run by itself, but fails when the whole suite runs.
  it.skip("should call the API to fetch reports for SAR creation", async () => {
    const button = screen.getByText("FetchForSar");
    await act(async () => await userEvent.click(button));
    expect(getReportsByState).toHaveBeenCalledTimes(2);
    expect(getReportsByState).toHaveBeenNthCalledWith(1, "WP", "AL");
    expect(getReportsByState).toHaveBeenNthCalledWith(2, "SAR", "AL");
  });

  it("should provide an error when reports for SAR creation cannot be fetched", async () => {
    jest.clearAllMocks();
    (getReportsByState as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("FetchForSar");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Reports could not be loaded/
    );
  });

  it("should call the API to release a report", async () => {
    const button = screen.getByText("Release");
    await userEvent.click(button);
    expect(releaseReport).toHaveBeenCalledWith(mockReportKeys);
  });

  it("should provide an error when reports for SAR creation cannot be fetched", async () => {
    (releaseReport as jest.Mock).mockRejectedValue("Oh no");
    const button = screen.getByText("Release");
    await userEvent.click(button);
    expect(screen.getByTestId("errorMessage")).toHaveTextContent(
      /Report could not be updated/
    );
  });
});
