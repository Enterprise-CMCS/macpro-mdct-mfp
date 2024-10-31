import { Choice } from "prompts";
import {
  getSemiAnnualReportsByState,
  getWorkPlansByState,
  state,
} from "../../../tests/seeds/options";
import { SeedReportShape } from "../../../tests/seeds/types";
import { generateReportingPeriod } from "./helpers";

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

export const backToMenu = {
  title: "Back to Menu",
  value: "back",
};

export const generateChoices = (
  type: string,
  year: number,
  period: number
): Choice[] => {
  const reportingPeriod = generateReportingPeriod(year, period);

  const choices = [
    {
      title: `Create base ${type}: ${reportingPeriod}`,
      value: `create${type}`,
    },
    {
      title: `Create filled ${type}: ${reportingPeriod}`,
      value: `createFilled${type}`,
    },
    {
      title: `Create submitted ${type}: ${reportingPeriod}`,
      value: `createSubmitted${type}`,
    },
    {
      title: `Create locked ${type}: ${reportingPeriod}`,
      value: `createLocked${type}`,
    },
    {
      title: `Create archived ${type}: ${reportingPeriod}`,
      value: `createArchived${type}`,
    },
    { title: `Get ${type} by id`, value: `get${type}ById` },
    {
      title: `Get ${type}s by state: ${state}`,
      value: `get${type}sByState`,
    },
    backToMenu,
  ];

  if (type === "WP") {
    choices.splice(3, 0, {
      title: `Create approved ${type}: ${reportingPeriod}`,
      value: `createApproved${type}`,
    });
  }

  return choices;
};
