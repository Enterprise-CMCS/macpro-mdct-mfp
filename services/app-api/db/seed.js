/* eslint-disable no-console */
const prompts = require("prompts");
const { createdLog, expandedLog } = require("./helpers.js");
const {
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
} = require("./options.js");

async function seed() {
  await loginUsers();
  let wpIds = await workPlanChoices();
  let sarIds = await semiAnnualReportChoices();

  const questions = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        { title: "Work Plan (WP)", value: "wp" },
        { title: "Semi-Annual Report (SAR)", value: "sar" },
        { title: "Create filled WP and filled SAR", value: "createFilledEach" },
        { title: "Banner", value: "banner" },
      ],
    },
    {
      type: (prev) => (prev === "wp" ? "select" : null),
      name: "wpTask",
      message: "Task",
      choices: [
        { title: "Create base WP", value: "createWorkPlan" },
        {
          title: "Create filled WP",
          value: "createFilledWorkPlan",
        },
        {
          title: "Create submitted WP",
          value: "createSubmittedWorkPlan",
        },
        {
          title: "Create approved WP",
          value: "createApprovedWorkPlan",
        },
        {
          title: "Create locked WP",
          value: "createLockedWorkPlan",
        },
        {
          title: "Create archived WP",
          value: "createArchivedWorkPlan",
        },
        { title: "Get WP by id", value: "getWorkPlanById" },
        {
          title: `Get WPs by state: ${state}`,
          value: "getWorkPlansByState",
        },
      ],
    },
    {
      type: (prev) => (prev === "sar" ? "select" : null),
      name: "sarTask",
      message: "Task",
      choices: [
        { title: "Create base SAR", value: "createSemiAnnualReport" },
        {
          title: "Create filled SAR",
          value: "createFilledSemiAnnualReport",
        },
        {
          title: "Create submitted SAR",
          value: "createSubmittedSemiAnnualReport",
        },
        {
          title: "Create locked SAR",
          value: "createLockedSemiAnnualReport",
        },
        {
          title: "Create archived SAR",
          value: "createArchivedSemiAnnualReport",
        },
        { title: "Get SAR by id", value: "getSemiAnnualReportById" },
        {
          title: `Get SARs by state: ${state}`,
          value: "getSemiAnnualReportsByState",
        },
      ],
    },
    {
      type: (prev) => (prev === "banner" ? "select" : null),
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
      type: (prev) =>
        prev === "getWorkPlanById" && wpIds.length > 0 ? "select" : null,
      name: "workPlanId",
      message: "Choose",
      choices: wpIds,
    },
    {
      type: (prev) =>
        prev === "getSemiAnnualReportById" && sarIds.length > 0
          ? "select"
          : null,
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

  const onSubmit = async (prompt, answer) => {
    switch (prompt.name) {
      case "workPlanId":
        expandedLog(await getWorkPlanById(answer));
        break;
      case "semiAnnualReportId":
        expandedLog(await getSemiAnnualReportById(answer));
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

    if (["wpTask", "sarTask"].includes(prompt.name)) {
      switch (answer) {
        case "createFilledEach": {
          createdLog(await createFilledWorkPlan(), "WP");
          createdLog(await createFilledSemiAnnualReport(), "SAR");
          break;
        }
        case "createWorkPlan": {
          createdLog(await createWorkPlan(), "WP");
          break;
        }
        case "createFilledWorkPlan": {
          createdLog(await createFilledWorkPlan(), "WP");
          break;
        }
        case "createSubmittedWorkPlan": {
          createdLog(await createSubmittedWorkPlan(), "WP");
          break;
        }
        case "createApprovedWorkPlan": {
          createdLog(await createApprovedWorkPlan(), "WP");
          break;
        }
        case "createLockedWorkPlan": {
          createdLog(await createLockedWorkPlan(), "WP");
          break;
        }
        case "createArchivedWorkPlan": {
          createdLog(await createArchivedWorkPlan(), "WP");
          break;
        }
        case "getWorkPlansByState":
          expandedLog(await getWorkPlansByState());
          break;
        case "createSemiAnnualReport": {
          createdLog(await createSemiAnnualReport(), "SAR");
          break;
        }
        case "createFilledSemiAnnualReport": {
          createdLog(await createFilledSemiAnnualReport(), "SAR");
          break;
        }
        case "createSubmittedSemiAnnualReport": {
          createdLog(await createSubmittedSemiAnnualReport(), "SAR");
          break;
        }
        case "createLockedSemiAnnualReport": {
          createdLog(await createLockedSemiAnnualReport(), "SAR");
          break;
        }
        case "createArchivedSemiAnnualReport": {
          createdLog(await createArchivedSemiAnnualReport(), "SAR");
          break;
        }
        case "getSemiAnnualReportsByState":
          expandedLog(await getSemiAnnualReportsByState());
          break;
        default:
          break;
      }

      wpIds = await workPlanChoices();
      sarIds = await semiAnnualReportChoices();
    }

    switch (answer) {
      case "createBanner": {
        const { Item } = await createBanner();
        console.log(`Banner created: ${Item.key}`);
        break;
      }
      case "getBanner":
        expandedLog(await getBannerById());
        break;
      case "deleteBanner": {
        const { Key } = await deleteBannerById();
        console.log(`Banner deleted: ${Key.key}`);
        break;
      }
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
}

seed();
