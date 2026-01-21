import {
  flattenReportRoutesArray,
  getEligibleWorkPlan,
  isArchivable,
} from "./reports";
//types
import {
  ReportMetadataShape,
  ReportRoute,
  ReportStatus,
  ReportType,
} from "types";
import { convertDateEtToUtc } from "utils/other/time";

describe("flattenReportRoutesArray", () => {
  describe("Should find all form routes, including nested ones", () => {
    const reportRoutes: ReportRoute[] = [
      {
        name: "foo",
        path: "foo",
        children: [
          {
            name: "bar",
            path: "foo/bar",
            children: [
              {
                name: "baz",
                path: "foo/bar/baz",
              },
            ],
          },
        ],
      },
      {
        name: "quux",
        path: "quux",
      },
    ];

    const flattenedRoutes = flattenReportRoutesArray(reportRoutes);

    // Only form routes are included; routes with children don't matter here.
    expect(flattenedRoutes).toHaveLength(2);
    expect(flattenedRoutes.map((r) => r.name)).toEqual(["baz", "quux"]);
  });
});

describe("utils/reports", () => {
  describe("getEligibleWorkPlan()", () => {
    test("should grab the oldest eligble workplan", async () => {
      const submissions: ReportMetadataShape[] = [
        {
          submissionName: "New Jersey Work Plan 2023 - Period 2",
          dueDate: convertDateEtToUtc("11/01/2023"),
          lastAlteredBy: "Anthony Soprano",
          reportType: "WP",
          reportPeriod: 2,
          createdAt: 1699496227241,
          reportYear: 2023,
          lastAltered: 1699496227241,
          state: "NJ",
          id: "too-new",
          locked: false,
          status: ReportStatus.APPROVED,
        },
        {
          reportType: "WP",
          state: "NJ",
          id: "just-right",
          submissionName: "New Jersey Work Plan 2023 - Period 1",
          status: ReportStatus.APPROVED,
          createdAt: 1699496130000,
          lastAltered: 1699496172798,
          lastAlteredBy: "Anthony Soprano",
          dueDate: convertDateEtToUtc("11/01/2023"),
          reportPeriod: 2,
          reportYear: 2023,
          locked: false,
        },
        {
          reportType: "WP",
          state: "NJ",
          id: "way-too-new",
          submissionName: "New Jersey Work Plan 2024 - Period 2",
          status: ReportStatus.APPROVED,
          createdAt: 1699496172798,
          lastAltered: 1699496172798,
          lastAlteredBy: "Anthony Soprano",
          dueDate: convertDateEtToUtc("11/01/2023"),
          reportPeriod: 2,
          reportYear: 2023,
          locked: false,
        },
      ];

      expect(getEligibleWorkPlan(submissions)).toBe(submissions[1]);
    });

    test("should return undefined if not given a submission", async () => {
      const submissions: ReportMetadataShape[] = [];
      expect(getEligibleWorkPlan(submissions)).toBe(undefined);
    });

    test("should return undefined if given submissions but none are eligble", async () => {
      const submissions: ReportMetadataShape[] = [
        {
          reportType: "WP",
          state: "NJ",
          id: "2Xv4Me4q00ztl41PakEf7nxGPtp",
          submissionName: "New Jersey Work Plan 2023 - Period 2",
          status: ReportStatus.SUBMITTED,
          createdAt: 1699496172798,
          lastAltered: 1699496172798,
          lastAlteredBy: "Anthony Soprano",
          dueDate: convertDateEtToUtc("11/01/2023"),
          reportPeriod: 2,
          reportYear: 2023,
          locked: false,
        },
        {
          reportType: "WP",
          state: "NJ",
          id: "2Xv4Me4q00ztl41PakEf7nxGPtp",
          submissionName: "New Jersey Work Plan 2023 - Period 2",
          status: ReportStatus.APPROVED,
          archived: true,
          createdAt: 1699496172798,
          lastAltered: 1699496172798,
          lastAlteredBy: "Anthony Soprano",
          dueDate: convertDateEtToUtc("11/01/2023"),
          reportPeriod: 2,
          reportYear: 2023,
          locked: false,
        },
      ];
      expect(getEligibleWorkPlan(submissions)).toBe(undefined);
    });
  });

  describe("isArchivable()", () => {
    test("returns true for WP", () => {
      expect(isArchivable(ReportType.WP)).toEqual(true);
    });
    test("returns true for Expenditure", () => {
      expect(isArchivable(ReportType.EXPENDITURE)).toEqual(true);
    });
    test("returns false for SAR", () => {
      expect(isArchivable(ReportType.SAR)).toEqual(false);
    });
    test("returns false by default", () => {
      expect(isArchivable("" as ReportType)).toEqual(false);
    });
  });
});
