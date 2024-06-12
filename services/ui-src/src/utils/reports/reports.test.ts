import { flattenReportRoutesArray, getEligbleWorkPlan } from "./reports";
//types
import { ReportMetadataShape, ReportRoute, ReportStatus } from "types";
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

describe("Test lastFoundSubmission function", () => {
  it("should grab the most recently created submission", async () => {
    const submissions: ReportMetadataShape[] = [
      {
        reportType: "WP",
        state: "NJ",
        id: "2Xv4Me4q00ztl41PakEf7nxGPtp",
        submissionName: "New Jersey Work Plan 2023 - Period 2",
        status: ReportStatus.APPROVED,
        createdAt: 1699496172798,
        lastAltered: 1699496172798,
        lastAlteredBy: "Anthony Soprano",
        dueDate: convertDateEtToUtc("11/01/2023"),
        reportPeriod: 2,
        reportYear: 2023,
        locked: false,
      },
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
        id: "2Xv4TaPFSy9Q0ZGSVB0wuzwtAnA",
        locked: false,
        status: ReportStatus.APPROVED,
      },
    ];

    expect(getEligbleWorkPlan(submissions)).toBe(submissions[1]);
  });

  it("should return undefined if not given a submission", async () => {
    const submissions: ReportMetadataShape[] = [];
    expect(getEligbleWorkPlan(submissions)).toBe(undefined);
  });

  it("should return undefined if given submissions but none are eligble", async () => {
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
    expect(getEligbleWorkPlan(submissions)).toBe(undefined);
  });
});
