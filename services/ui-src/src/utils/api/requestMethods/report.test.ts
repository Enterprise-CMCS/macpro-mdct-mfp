import { getReport, getReportsByState, postReport, putReport } from "./report";
// utils
import { mockReportKeys, mockWPReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("utils/report", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });

  test("getReport()", () => {
    expect(getReport(mockReportKeys)).toBeTruthy();
  });

  test("getReportsByState()", () => {
    expect(getReportsByState("WP", "NJ")).toBeTruthy();
  });

  test("postReport()", () => {
    expect(postReport("WP", "NJ", mockWPReport)).toBeTruthy();
  });

  test("putReport()", () => {
    expect(putReport(mockReportKeys, mockWPReport)).toBeTruthy();
  });
});
