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
// types
import { AnyObject } from "types";
// utils
import { mockReportKeys, mockWPReport } from "utils/testing/setupJest";

const mockDel = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    del: (path: string, options: AnyObject) => mockDel(path, options),
    get: (path: string, options: AnyObject) => mockGet(path, options),
    post: (path: string, options: AnyObject) => mockPost(path, options),
    put: (path: string, options: AnyObject) => mockPut(path, options),
  },
}));

describe("utils/report", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("approveReport", async () => {
    await approveReport(mockReportKeys, mockWPReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("archiveReport", async () => {
    await archiveReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("getReport", async () => {
    await getReport(mockReportKeys);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState", async () => {
    await getReportsByState("WP", "NJ");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postReport", async () => {
    await postReport("WP", "NJ", mockWPReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("putReport", async () => {
    await putReport(mockReportKeys, mockWPReport);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("releaseReport", async () => {
    await releaseReport(mockReportKeys);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    await submitReport(mockReportKeys);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
