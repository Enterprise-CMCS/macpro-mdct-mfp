import { getReportsByState, postReport } from "./report";
// utils
import { mockWPReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("Test report status methods", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });
  test("getReportsByState", () => {
    expect(getReportsByState("WP", "NJ")).toBeTruthy();
  });

  test("postReport", () => {
    expect(postReport("WP", "NJ", mockWPReport)).toBeTruthy();
  });
});
