/* eslint-disable no-console */
import { Choice } from "prompts";
import {
  getSemiAnnualReportsByState,
  getWorkPlansByState,
} from "../../../tests/seeds/options";
import { SeedReportShape } from "../../../tests/seeds/types";

export const workPlanChoices = async (): Promise<Choice[]> => {
  try {
    const reports: SeedReportShape[] = await getWorkPlansByState();
    if (Array.isArray(reports)) {
      return reports.map(({ submissionName, id }) => ({
        title: `${submissionName} (${id})`,
        value: id,
      }));
    }

    return [];
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

export const semiAnnualReportChoices = async (): Promise<Choice[]> => {
  try {
    const reports = await getSemiAnnualReportsByState();
    if (Array.isArray(reports)) {
      return reports.map((report) => ({
        title: `${report.submissionName} (${report.id})`,
        value: report.id,
      }));
    }

    return [];
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
