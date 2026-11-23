import {
  approveReport,
  approveReportDev,
  archiveReport,
  deleteReport,
  deleteReportsForState,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  releaseReport,
  submitReport,
} from "./report";
// utils
import { mockReportKeys, mockWPReport } from "utils/testing/setupTest";
import { initAuthManager } from "utils/auth/authLifecycle";
import { ReportMetadataShape, ReportType } from "types";

const mockDelete = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
}));

describe("utils/requestMethods/report", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    initAuthManager();
    vi.runAllTimers();
    vi.clearAllMocks();
  });

  test("approveReport()", async () => {
    await approveReport(mockReportKeys, mockWPReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("archiveReport()", async () => {
    await archiveReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("getReport()", async () => {
    await getReport(mockReportKeys);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState()", async () => {
    await getReportsByState("WP", "NJ");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postReport()", async () => {
    await postReport("WP", "NJ", mockWPReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("putReport()", async () => {
    await putReport(mockReportKeys, mockWPReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("releaseReport()", async () => {
    await releaseReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("submitReport()", async () => {
    await submitReport(mockReportKeys);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("approveReportDev()", async () => {
    await approveReportDev(mockWPReport as unknown as ReportMetadataShape);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
  test("deleteReport()", async () => {
    await deleteReport(mockWPReport as unknown as ReportMetadataShape);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
  test("deleteReportsForState()", async () => {
    await deleteReportsForState(ReportType.WP, "NJ");
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
