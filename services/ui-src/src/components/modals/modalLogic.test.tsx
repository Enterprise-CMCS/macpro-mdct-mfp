import { ReportMetadataShape } from "types";
import { actionButtonText, checkForExistingReport } from "./modalLogic";
import { Spinner } from "@chakra-ui/react";

describe("actionButtonText", () => {
  test("returns Spinner when submitting is true", () => {
    const result = actionButtonText(true, false);
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("returns 'Return' when viewOnly is true", () => {
    const result = actionButtonText(false, true);
    expect(result).toBe("Return");
  });

  test("returns 'Update submission' when isEditingExisting is truthy", () => {
    const result = actionButtonText(false, false, "some-id");
    expect(result).toBe("Update submission");
  });

  test("returns 'Save' when creating a new report", () => {
    const result = actionButtonText(false, false);
    expect(result).toBe("Save");
  });

  test("prioritizes submitting over viewOnly", () => {
    const result = actionButtonText(true, true);
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("prioritizes submitting over isEditingExisting", () => {
    const result = actionButtonText(true, false, "some-id");
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("prioritizes viewOnly over isEditingExisting", () => {
    const result = actionButtonText(false, true, "some-id");
    expect(result).toBe("Return");
  });
});

describe("checkForExistingReport", () => {
  const report2023Period1: ReportMetadataShape = {
    reportYear: 2023,
    reportPeriod: 1,
    archived: false,
  } as ReportMetadataShape;

  const report2023Period1Archived: ReportMetadataShape = {
    ...report2023Period1,
    archived: true,
  } as ReportMetadataShape;

  const report2024Period2: ReportMetadataShape = {
    reportYear: 2024,
    reportPeriod: 2,
    archived: false,
  } as ReportMetadataShape;

  test("returns false when reportsByState is undefined", () => {
    const result = checkForExistingReport(2023, 1, undefined);
    expect(result).toBe(false);
  });

  test("returns false when reportsByState is empty", () => {
    const result = checkForExistingReport(2023, 1, []);
    expect(result).toBe(false);
  });

  test("returns true when matching non-archived report exists", () => {
    const reports: ReportMetadataShape[] = [report2023Period1];
    const result = checkForExistingReport(2023, 1, reports);
    expect(result).toBe(true);
  });

  test("returns false when matching report is archived", () => {
    const reports: ReportMetadataShape[] = [report2023Period1Archived];
    const result = checkForExistingReport(2023, 1, reports);
    expect(result).toBe(false);
  });

  test("returns false when reportYear does not match", () => {
    const reports: ReportMetadataShape[] = [report2023Period1];
    const result = checkForExistingReport(2024, 1, reports);
    expect(result).toBe(false);
  });

  test("returns false when reportPeriod does not match", () => {
    const reports: ReportMetadataShape[] = [report2023Period1];
    const result = checkForExistingReport(2023, 2, reports);
    expect(result).toBe(false);
  });

  test("returns true when matching report exists among multiple reports", () => {
    const reports: ReportMetadataShape[] = [
      report2023Period1,
      report2024Period2,
    ];
    const result = checkForExistingReport(2023, 1, reports);
    expect(result).toBe(true);
  });

  test("returns false when no matching report exists among multiple reports", () => {
    const reports: ReportMetadataShape[] = [
      report2024Period2,
      {
        ...report2023Period1,
        reportPeriod: 2,
      },
    ];
    const result = checkForExistingReport(2023, 1, reports);
    expect(result).toBe(false);
  });
});
