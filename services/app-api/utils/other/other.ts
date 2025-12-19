import {
  getReportFieldData,
  queryReportMetadatasForState,
} from "../../storage/reports";
import { reportNames, States } from "../constants/constants";
import {
  AnyObject,
  ReportFieldData,
  ReportMetadataShape,
  ReportStatus,
  ReportType,
  State,
} from "../types";

export const createReportName = (
  reportType: ReportType,
  reportPeriod: number,
  state: State,
  reportYear?: number,
  workPlan?: ReportMetadataShape
) => {
  const reportName = reportNames[reportType];
  const period =
    reportType === ReportType.SAR ? workPlan?.reportPeriod : reportPeriod;

  const fullStateName = States[state];

  switch (reportType) {
    case ReportType.EXPENDITURE:
      return `${state}: ${reportYear} - ${fullExpenditureReportPeriod(
        Number(reportPeriod)
      )}`;
    case ReportType.SAR:
    case ReportType.WP:
      return `${fullStateName} MFP ${reportName} ${reportYear} - Period ${period}`;
    default:
      throw new Error("Unsupported report type for naming convention");
  }
};

export const getEligibleWorkPlan = async (
  state: State
): Promise<{
  workPlanMetadata?: ReportMetadataShape;
  workPlanFieldData?: ReportFieldData;
}> => {
  const allWorkPlans = await queryReportMetadatasForState(ReportType.WP, state);
  const eligibleWorkPlans = allWorkPlans.filter(
    (wp) =>
      wp.status === ReportStatus.APPROVED && !wp.associatedSar && !wp?.archived
  );
  if (eligibleWorkPlans.length === 0) {
    // There were no eligible work plans to treat as a base for this SAR
    return { workPlanMetadata: undefined, workPlanFieldData: undefined };
  }

  const workPlanMetadata = eligibleWorkPlans.reduce((mostRecent, wp) =>
    mostRecent.createdAt < wp.createdAt ? mostRecent : wp
  );
  const workPlanFieldData = await getReportFieldData(workPlanMetadata);
  return { workPlanMetadata, workPlanFieldData };
};

export const getReportYear = (
  reportData: AnyObject,
  isCopyOver: boolean = false
): number => {
  if (isCopyOver) {
    if (typeof reportData?.copyReport?.reportYear !== "number") {
      throw new Error("Invalid value for reportYear");
    }
    const prevReportYear = reportData?.copyReport?.reportYear;
    const prevReportPeriod = reportData?.copyReport?.reportPeriod;

    return prevReportPeriod === 2 ? prevReportYear + 1 : prevReportYear;
  }

  if (typeof reportData.reportYear !== "number") {
    throw new Error("Invalid value for reportYear");
  }

  return reportData?.reportYear;
};

export const getReportPeriod = (
  reportData: AnyObject,
  isCopyOver: boolean = false
): number => {
  if (isCopyOver) {
    if (typeof reportData?.copyReport?.reportPeriod !== "number") {
      throw new Error("Invalid value for reportPeriod");
    }

    let prevReportPeriod = reportData?.copyReport?.reportPeriod;

    return (prevReportPeriod % 2) + 1;
  }

  if (typeof reportData.reportPeriod !== "number") {
    throw new Error("Invalid value for reportPeriod");
  }

  return reportData?.reportPeriod;
};

export const fullExpenditureReportPeriod = (period: number): string => {
  switch (period) {
    case 1:
      return "Q1: January 1st to March 31st";
    case 2:
      return "Q2: April 1st to June 30th";
    case 3:
      return "Q3: July 1st to September 30th";
    case 4:
      return "Q4: October 1st to December 31st";
    default:
      throw new Error("Invalid report period");
  }
};
