/* eslint-disable no-console */
import prompts, { Choice, PromptObject } from "prompts";
import { createdLog, expandedLog, generateReportingPeriod } from "./helpers";
import {
  backToMenu,
  generateChoices,
  semiAnnualReportChoices,
  workPlanChoices,
} from "./options";
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
} from "../../../tests/seeds/options";

const seed = async (
  chosenYear?: number,
  chosenPeriod?: number
): Promise<void> => {
  await loginSeedUsers();
  const wpIds: Choice[] = await workPlanChoices();
  const sarIds: Choice[] = await semiAnnualReportChoices();

  const entityChoices: Choice[] = [
    { title: "Work Plan (WP)", value: "WP" },
    { title: "Semi-Annual Report (SAR)", value: "SAR" },
    { title: "Banner", value: "banner" },
  ];

  let reportYear = chosenYear || currentYear;
  let reportPeriod = chosenPeriod || 1;

  const questions: PromptObject[] = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        {
          title: `Change Reporting Year: ${reportYear}`,
          value: "chooseReportingYear",
        },
        {
          title: `Change Reporting Period: ${reportPeriod}`,
          value: "chooseReportingPeriod",
        },
        {
          title: `Create approved WP and filled SAR: ${generateReportingPeriod(
            reportYear,
            reportPeriod
          )}`,
          value: "createFilledSAR",
        },
        ...entityChoices,
      ],
    },
    {
      type: (prev: string) =>
        prev === "chooseReportingYear" ? "select" : null,
      name: "reportingYear",
      message: "Reporting Year",
      choices: () => {
        return [
          { title: `${currentYear}`, value: `${currentYear}` },
          { title: `${currentYear + 1}`, value: `${currentYear + 1}` },
          { title: `${currentYear + 2}`, value: `${currentYear + 2}` },
          { title: `${currentYear + 3}`, value: `${currentYear + 3}` },
          { title: `${currentYear + 4}`, value: `${currentYear + 4}` },
        ];
      },
    },
    {
      type: (prev: string) =>
        prev === "chooseReportingPeriod" ? "select" : null,
      name: "reportingPeriod",
      message: "Reporting Period",
      choices: () => {
        return [
          { title: "1", value: "1" },
          { title: "2", value: "2" },
        ];
      },
    },
    {
      type: (prev: string) => (["WP", "SAR"].includes(prev) ? "select" : null),
      name: "task",
      message: "Task",
      choices: (prev: string) => {
        return generateChoices(prev, reportYear, reportPeriod) as Choice[];
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
        backToMenu,
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
      type: (prev: string) =>
        Number.isInteger(parseInt(prev, 10)) || prev === "back"
          ? null
          : "confirm",
      name: "exit",
      message: "Exit?",
    },
  ];

  const onSubmit = async (
    prompt: PromptObject,
    answer: string | boolean
  ): Promise<void> => {
    switch (prompt.name) {
      case "reportingPeriod":
      case "reportingYear": {
        const answerInt = parseInt(answer as string, 10);

        if ([1, 2].includes(answerInt)) {
          reportPeriod = answerInt;
        }

        if (answerInt >= currentYear) {
          reportYear = answerInt;
        }

        seed(reportYear, reportPeriod);
        break;
      }
      case "workPlanId":
        expandedLog(await getWorkPlanById(answer as string));
        break;
      case "semiAnnualReportId":
        expandedLog(await getSemiAnnualReportById(answer as string));
        break;
      case "exit": {
        if (answer === false) {
          seed(reportYear, reportPeriod);
        }
        break;
      }
      default:
        break;
    }

    switch (answer) {
      case "back":
        seed(reportYear, reportPeriod);
        break;
      case "createFilledWP": {
        createdLog(
          await createFilledWorkPlan(reportYear, reportPeriod),
          "Filled",
          "WP"
        );
        break;
      }
      case "createWP": {
        createdLog(
          await createWorkPlan(reportYear, reportPeriod),
          "Base",
          "WP"
        );
        break;
      }
      case "createSubmittedWP": {
        createdLog(
          await createSubmittedWorkPlan(reportYear, reportPeriod),
          "Submitted",
          "WP"
        );
        break;
      }
      case "createApprovedWP": {
        createdLog(
          await createApprovedWorkPlan(reportYear, reportPeriod),
          "Approved",
          "WP"
        );
        break;
      }
      case "createLockedWP": {
        createdLog(
          await createLockedWorkPlan(reportYear, reportPeriod),
          "Locked",
          "WP"
        );
        break;
      }
      case "createArchivedWP": {
        createdLog(
          await createArchivedWorkPlan(reportYear, reportPeriod),
          "Archived",
          "WP"
        );
        break;
      }
      case "getWPsByState":
        expandedLog(await getWorkPlansByState());
        break;
      case "createSAR": {
        createdLog(
          await createSemiAnnualReport(reportYear, reportPeriod),
          "Base",
          "SAR"
        );
        break;
      }
      case "createFilledSAR": {
        createdLog(
          await createFilledSemiAnnualReport(reportYear, reportPeriod),
          "Filled",
          "SAR"
        );
        break;
      }
      case "createSubmittedSAR": {
        createdLog(
          await createSubmittedSemiAnnualReport(reportYear, reportPeriod),
          "Submitted",
          "SAR"
        );
        break;
      }
      case "createLockedSAR": {
        createdLog(
          await createLockedSemiAnnualReport(reportYear, reportPeriod),
          "Locked",
          "SAR"
        );
        break;
      }
      case "createArchivedSAR": {
        createdLog(
          await createArchivedSemiAnnualReport(reportYear, reportPeriod),
          "Archived",
          "SAR"
        );
        break;
      }
      case "getSARsByState":
        expandedLog(await getSemiAnnualReportsByState());
        break;
      case "createBanner": {
        await createBanner();
        console.log("Banner created.");
        break;
      }
      case "getBanner":
        expandedLog(await getBannerById());
        break;
      case "deleteBanner": {
        await deleteBannerById();
        console.log("Banner deleted.");
        break;
      }
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
};

seed();
