/* eslint-disable no-console */
import prompts, { Choice as PromptChoice, PromptObject } from "prompts";
import { createdLog, expandedLog } from "./helpers";
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
  loginUsers,
  semiAnnualReportChoices,
  state,
  workPlanChoices,
} from "./options";

const seed = async (): Promise<void> => {
  await loginUsers();
  const wpIds: PromptChoice[] = await workPlanChoices();
  const sarIds: PromptChoice[] = await semiAnnualReportChoices();

  const generateChoices = (type: string): PromptChoice[] => {
    const choices = [
      { title: `Create base ${type}`, value: `create${type}` },
      {
        title: `Create filled ${type}`,
        value: `createFilled${type}`,
      },
      {
        title: `Create submitted ${type}`,
        value: `createSubmitted${type}`,
      },
      {
        title: `Create locked ${type}`,
        value: `createLocked${type}`,
      },
      {
        title: `Create archived ${type}`,
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
        title: `Create approved ${type}`,
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
        { title: "Create filled WP and filled SAR", value: "createFilledEach" },
        { title: "Work Plan (WP)", value: "WP" },
        { title: "Semi-Annual Report (SAR)", value: "SAR" },
        { title: "Banner", value: "banner" },
      ],
    },
    {
      type: (prev: string) => (["WP", "SAR"].includes(prev) ? "select" : null),
      name: "task",
      message: "Task",
      choices: (prev: string) => generateChoices(prev) as PromptChoice[],
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
        createdLog(await createFilledWorkPlan(), "WP");
        createdLog(await createFilledSemiAnnualReport(), "SAR");
        break;
      }
      case "createWP": {
        createdLog(await createWorkPlan(), "WP");
        break;
      }
      case "createFilledWP": {
        createdLog(await createFilledWorkPlan(), "WP");
        break;
      }
      case "createSubmittedWP": {
        createdLog(await createSubmittedWorkPlan(), "WP");
        break;
      }
      case "createApprovedWP": {
        createdLog(await createApprovedWorkPlan(), "WP");
        break;
      }
      case "createLockedWP": {
        createdLog(await createLockedWorkPlan(), "WP");
        break;
      }
      case "createArchivedWP": {
        createdLog(await createArchivedWorkPlan(), "WP");
        break;
      }
      case "getWPsByState":
        expandedLog(await getWorkPlansByState());
        break;
      case "createSAR": {
        createdLog(await createSemiAnnualReport(), "SAR");
        break;
      }
      case "createFilledSAR": {
        createdLog(await createFilledSemiAnnualReport(), "SAR");
        break;
      }
      case "createSubmittedSAR": {
        createdLog(await createSubmittedSemiAnnualReport(), "SAR");
        break;
      }
      case "createLockedSAR": {
        createdLog(await createLockedSemiAnnualReport(), "SAR");
        break;
      }
      case "createArchivedSAR": {
        createdLog(await createArchivedSemiAnnualReport(), "SAR");
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
