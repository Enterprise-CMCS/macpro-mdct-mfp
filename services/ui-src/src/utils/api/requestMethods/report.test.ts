import {
  approveReport,
  archiveReport,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  releaseReport,
  submitReport,
} from "./report";
// utils
import { mockReportKeys, mockWPReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

const mockDelete = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
}));

describe("utils/requestMethods/report", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
    jest.clearAllMocks();
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
});
