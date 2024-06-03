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

const seed = async () => {
  await loginUsers();
  const wpIds = await workPlanChoices();
  const sarIds = await semiAnnualReportChoices();

  const generateChoices = (type) => {
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
      choices.toSpliced(3, 0, {
        title: `Create approved ${type}`,
        value: `createApproved${type}`,
      });
    }

    return choices;
  };

  const questions = [
    {
      type: "select",
      name: "type",
      message: "Type",
      choices: [
        { title: "Work Plan (WP)", value: "WP" },
        { title: "Semi-Annual Report (SAR)", value: "SAR" },
        { title: "Create filled WP and filled SAR", value: "createFilledEach" },
        { title: "Banner", value: "banner" },
      ],
    },
    {
      type: (prev) => (["WP", "SAR"].includes(prev) ? "select" : null),
      name: "task",
      message: "Task",
      choices: (prev) => generateChoices(prev),
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
      type: (prev) => (prev === "getWPById" ? "select" : null),
      name: "workPlanId",
      message: "Choose",
      choices: wpIds,
    },
    {
      type: (prev) => (prev === "getSARById" ? "select" : null),
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
};

seed();
