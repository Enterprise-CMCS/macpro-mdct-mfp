/* eslint-disable no-console */
import prompts, { Choice as PromptChoice, PromptObject } from "prompts";
import { createdLog, expandedLog } from "./helpers";
import { semiAnnualReportChoices, workPlanChoices } from "./options";
import { currentYear } from "../../../tests/seeds/helpers";
import {
  bannerKey,
  createApprovedWorkPlan,
  createArchivedSemiAnnualReport,
  createArchivedWorkPlan,
  createBanner,
  createFilledSemiAnnualReport,
  createFilledWorkPlan,
  createLockedSemiAnnualReport,
  createLockedWorkPlan,
  createSemiAnnualReport,
  createSubmittedSemiAnnualReport,
  createSubmittedWorkPlan,
  createWorkPlan,
  deleteBannerById,
  getBannerById,
  getSemiAnnualReportById,
  getSemiAnnualReportsByState,
  getWorkPlanById,
  getWorkPlansByState,
  loginSeedUsers,
  state,
} from "../../../tests/seeds/options";

const seed = async (): Promise<void> => {
  await loginSeedUsers();
  const wpIds: PromptChoice[] = await workPlanChoices();
  const sarIds: PromptChoice[] = await semiAnnualReportChoices();

  const entityChoices: PromptChoice[] = [
    { title: "Work Plan (WP)", value: "WP" },
    { title: "Semi-Annual Report (SAR)", value: "SAR" },
    { title: "Banner", value: "banner" },
  ];

  let reportYear = currentYear;
  let reportPeriod = 1;

  const generateReportingPeriod = (year: number, period: number) =>
    `${year} Period ${period}`;

  const generateChoices = (
    type: string,
    year: number,
    period: number
  ): PromptChoice[] => {
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
    ];

    if (type === "WP") {
      choices.splice(3, 0, {
        title: `Create approved ${type}: ${reportingPeriod}`,
        value: `createApproved${type}`,
      });
    }

    return choices;
  };

  const questions: PromptObject[] = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        {
          title: `Change Reporting Period: ${generateReportingPeriod(
            reportYear,
            reportPeriod
          )}`,
          value: "chooseReportingPeriod",
        },
        { title: "Create filled WP and filled SAR", value: "createFilledEach" },
        ...entityChoices,
      ],
    },
    {
      type: (prev: string) =>
        prev === "chooseReportingPeriod" ? "select" : null,
      name: "reportingPeriod",
      message: "Reporting Period",
      choices: () => {
        return [
          { title: `${currentYear} Period 1`, value: "period1" },
          { title: `${currentYear} Period 2`, value: "period2" },
          { title: `${currentYear + 1} Period 1`, value: "period3" },
          { title: `${currentYear + 1} Period 2`, value: "period4" },
        ];
      },
    },
    {
      type: (prev: string) =>
        ["period1", "period2", "period3", "period4"].includes(prev)
          ? "select"
          : null,
      name: "type",
      message: "Type",
      choices: (prev: string) => {
        reportYear = currentYear;
        reportPeriod = 1;

        if (["period2", "period4"].includes(prev)) {
          reportPeriod = 2;
        }

        if (["period3", "period4"].includes(prev)) {
          reportYear = currentYear + 1;
        }

        return [
          {
            title: `Create filled WP and filled SAR: ${generateReportingPeriod(
              reportYear,
              reportPeriod
            )}`,
            value: "createFilledEach",
          },
          ...entityChoices,
        ];
      },
    },
    {
      type: (prev: string) => (["WP", "SAR"].includes(prev) ? "select" : null),
      name: "task",
      message: "Task",
      choices: (prev: string) => {
        return generateChoices(
          prev,
          reportYear,
          reportPeriod
        ) as PromptChoice[];
      },
    },
    {
      type: (prev: string) => (prev === "banner" ? "select" : null),
      name: "bannerTask",
      message: "Task",
      choices: [
        {
          title: `Create Banner: ${bannerKey}`,
          value: "createBanner",
        },
        { title: `Get Banner: ${bannerKey}`, value: "getBanner" },
        {
          title: `Delete Banner: ${bannerKey}`,
          value: "deleteBanner",
        },
      ],
    },
    {
      type: (prev: string) =>
        prev === "getWPById" && wpIds.length > 0 ? "select" : null,
      name: "workPlanId",
      message: "Choose",
      choices: wpIds,
    },
    {
      type: (prev: string) =>
        prev === "getSARById" && sarIds.length > 0 ? "select" : null,
      name: "semiAnnualReportId",
      message: "Choose",
      choices: sarIds,
    },
    {
      type: "confirm",
      name: "exit",
      message: "Exit?",
    },
  ];

  const onSubmit = async (
    prompt: PromptObject,
    answer: string | boolean
  ): Promise<void> => {
    switch (prompt.name) {
      case "workPlanId":
        expandedLog(await getWorkPlanById(answer as string));
        break;
      case "semiAnnualReportId":
        expandedLog(await getSemiAnnualReportById(answer as string));
        break;
      case "exit": {
        if (answer === false) {
          seed();
        }
        break;
      }
      default:
        break;
    }

    switch (answer) {
      case "createFilledEach": {
        createdLog(
          await createFilledWorkPlan(reportYear, reportPeriod),
          "Filled WP"
        );
        createdLog(
          await createFilledSemiAnnualReport(reportYear, reportPeriod),
          "Filled SAR"
        );
        break;
      }
      case "createWP": {
        createdLog(await createWorkPlan(reportYear, reportPeriod), "Base WP");
        break;
      }
      case "createFilledWP": {
        createdLog(
          await createFilledWorkPlan(reportYear, reportPeriod),
          "Filled WP"
        );
        break;
      }
      case "createSubmittedWP": {
        createdLog(
          await createSubmittedWorkPlan(reportYear, reportPeriod),
          "Submitted WP"
        );
        break;
      }
      case "createApprovedWP": {
        createdLog(
          await createApprovedWorkPlan(reportYear, reportPeriod),
          "Approved WP"
        );
        break;
      }
      case "createLockedWP": {
        createdLog(
          await createLockedWorkPlan(reportYear, reportPeriod),
          "Locked WP"
        );
        break;
      }
      case "createArchivedWP": {
        createdLog(
          await createArchivedWorkPlan(reportYear, reportPeriod),
          "Archived WP"
        );
        break;
      }
      case "getWPsByState":
        expandedLog(await getWorkPlansByState());
        break;
      case "createSAR": {
        createdLog(
          await createSemiAnnualReport(reportYear, reportPeriod),
          "Base SAR"
        );
        break;
      }
      case "createFilledSAR": {
        createdLog(
          await createFilledSemiAnnualReport(reportYear, reportPeriod),
          "Filled SAR"
        );
        break;
      }
      case "createSubmittedSAR": {
        createdLog(
          await createSubmittedSemiAnnualReport(reportYear, reportPeriod),
          "Submitted SAR"
        );
        break;
      }
      case "createLockedSAR": {
        createdLog(
          await createLockedSemiAnnualReport(reportYear, reportPeriod),
          "Locked SAR"
        );
        break;
      }
      case "createArchivedSAR": {
        createdLog(
          await createArchivedSemiAnnualReport(reportYear, reportPeriod),
          "Archived SAR"
        );
        break;
      }
      case "getSARsByState":
        expandedLog(await getSemiAnnualReportsByState());
        break;
      case "createBanner": {
        const { Item } = await createBanner();
        console.log(`Banner created: ${Item?.key}`);
        break;
      }
      case "getBanner":
        expandedLog(await getBannerById());
        break;
      case "deleteBanner": {
        const { Key } = await deleteBannerById();
        console.log(`Banner deleted: ${Key?.key}`);
        break;
      }
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
};

seed();
