import {
  getReportFieldData,
  queryReportMetadatasForState,
} from "../../storage/reports";
import { States } from "../constants/constants";
import {
  AnyObject,
  ReportFieldData,
  ReportMetadataShape,
  ReportStatus,
  ReportType,
  State,
} from "../types";

export const createReportName = (
  reportType: string,
  reportPeriod: number,
  state: State,
  reportYear?: number,
  workPlan?: ReportMetadataShape
) => {
  const reportName = reportType;
  const period =
    reportType === ReportType.SAR ? workPlan?.reportPeriod : reportPeriod;

  const fullStateName = States[state];
  return `${fullStateName} MFP ${reportName} ${reportYear} - Period ${period}`;
};

export const getEligbleWorkPlan = async (
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
    mostRecent.createdAt > wp.createdAt ? mostRecent : wp
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
