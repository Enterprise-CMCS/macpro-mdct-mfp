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

const mockAmplifyApi = require("aws-amplify/api");

describe("utils/report", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
    jest.clearAllMocks();
  });

  test("approveReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await approveReport(mockReportKeys, mockWPReport);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("archiveReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await archiveReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("getReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await getReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("getReportsByState", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await getReportsByState("WP", "NJ");
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("postReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await postReport("WP", "NJ", mockWPReport);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("putReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await putReport(mockReportKeys, mockWPReport);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("releaseReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "put");
    await releaseReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await submitReport(mockReportKeys);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
