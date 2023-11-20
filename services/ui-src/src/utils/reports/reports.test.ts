import { getLastSubmission } from "./reports";
//types
import { ReportMetadataShape, ReportStatus } from "types";
import { convertDateEtToUtc } from "utils/other/time";

describe("Test lastFoundSubmission function", () => {
  it("should grab the last submission based on the time", async () => {
    const submissions: ReportMetadataShape[] = [
      {
        reportType: "WP",
        state: "NJ",
        id: "2Xv4Me4q00ztl41PakEf7nxGPtp",
        submissionName: "New Jersey Work Plan 2023 - Period 2",
        status: ReportStatus.IN_PROGRESS,
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
        status: ReportStatus.IN_PROGRESS,
      },
    ];

    expect(getLastSubmission(submissions)).toBe(submissions[1]);
  });

  it("should return undefined if not given a submission", async () => {
    const submissions: ReportMetadataShape[] = [];
    expect(getLastSubmission(submissions)).toBe(undefined);
  });

  it("should return undefined if given submissions but none are of right type", async () => {
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
    ];
    expect(getLastSubmission(submissions)).toBe(undefined);
  });
});
