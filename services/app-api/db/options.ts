import { Choice } from "prompts";
import {
  getSemiAnnualReportsByState,
  getWorkPlansByState,
} from "../../../tests/seeds/options";
import { SeedReportShape } from "../../../tests/seeds/types";

export const workPlanChoices = async (): Promise<Choice[]> => {
  try {
    const reports: SeedReportShape[] = await getWorkPlansByState();
    return reports.map(({ submissionName, id }) => ({
      title: `${submissionName} (${id})`,
      value: id,
    }));
  } catch {
    process.exit();
  }
};

export const semiAnnualReportChoices = async (): Promise<Choice[]> => {
  try {
    const reports = await getSemiAnnualReportsByState();
    return reports.map((report) => ({
      title: `${report.submissionName} (${report.id})`,
      value: report.id,
    }));
  } catch {
    process.exit();
  }
};
