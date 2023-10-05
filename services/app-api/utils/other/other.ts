import { States } from "../constants/constants";
import { calculatePeriod, convertDateUtcToEt } from "../time/time";

export const createReportName = (
  reportType: string,
  createdAt: number,
  state: string
) => {
  const reportName = reportType;
  const etDate = convertDateUtcToEt(createdAt);
  const period = calculatePeriod(createdAt);
  const year = new Date(etDate).getFullYear();

  const fullStateName = States[state as keyof typeof States];
  return `${fullStateName} ${reportName} ${year} - Period ${period}`;
};
