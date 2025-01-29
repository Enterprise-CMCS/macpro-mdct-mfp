import { ReportType } from "types";
import { getStatus, tableBody } from "./DashboardTable";

describe("<DashboardTable />", () => {
  describe("getStatus()", () => {
    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus(ReportType.WP, "In revision", false, 1)).toBe(
        "In revision"
      );
    });

    test("should render the correct status if report been started", () => {
      expect(getStatus(ReportType.WP, "In progress", false, 0)).toBe(
        "In progress"
      );
    });

    test("should render the correct status if report has been archived", () => {
      expect(getStatus(ReportType.WP, "In progress", true, 1)).toBe("Archived");
    });

    test("should render the correct status if report has been submitted", () => {
      expect(getStatus(ReportType.WP, "Submitted", false, 1)).toBe("Submitted");
    });

    test("should render the correct status if report has not started", () => {
      expect(getStatus(ReportType.WP, "Not started", false, 1)).toBe(
        "Not started"
      );
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus(ReportType.SAR, "In progress", false, 1)).toBe(
        "In progress"
      );
    });

    test("should render the correct status for SAR reports", () => {
      expect(getStatus(ReportType.SAR, "Not started", false, 1)).toBe(
        "Not started"
      );
    });
  });

  describe("tableBody()", () => {
    const all = {
      headRow: ["row1", "Due date", "Target populations", "#"],
    };
    const adminBody = {
      headRow: ["row1", "#"],
    };
    const stateBody = {
      headRow: ["row1", "Due date", "Target populations"],
    };

    test("should remove Due date and Target populations rows for admin", () => {
      expect(tableBody(all, true)).toEqual(adminBody);
    });

    test("should remove # row for non-admin", () => {
      expect(tableBody(all, false)).toEqual(stateBody);
    });
  });
});
