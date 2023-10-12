import { States } from "../constants/constants";
import { calculatePeriod } from "../time/time";
import { ReportMetadata, ReportType } from "../types";

export const createReportName = (
  reportType: string,
  createdAt: number,
  state: string,
  reportYear?: number,
  workPlan?: ReportMetadata
) => {
  const reportName = reportType;
  const period =
    reportType === ReportType.SAR
      ? workPlan?.reportPeriod
      : calculatePeriod(createdAt);

  const fullStateName = States[state as keyof typeof States];
  return `${fullStateName} ${reportName} ${reportYear} - Period ${period}`;
};
