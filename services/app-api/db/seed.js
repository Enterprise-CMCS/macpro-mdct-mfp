/* eslint-disable no-console */
const prompts = require("prompts");
const { expandedLog } = require("./helpers.js");
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
  const wpIds = await workPlanChoices();
  const sarIds = await semiAnnualReportChoices();

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
      name: "task",
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
      name: "task",
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
      name: "task",
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
        prev === "getSemiAnnualReportById" && semiAnnualReportChoices.length > 0
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

    switch (answer) {
      case "createFilledEach": {
        const { id: wpId } = await createFilledWorkPlan();
        console.log(`WP created: ${wpId}`);
        const { id } = await createFilledSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "createWorkPlan": {
        const { id } = await createWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "createFilledWorkPlan": {
        const { id } = await createFilledWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "createSubmittedWorkPlan": {
        const { id } = await createSubmittedWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "createApprovedWorkPlan": {
        const { id } = await createApprovedWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "createLockedWorkPlan": {
        const { id } = await createLockedWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "createArchivedWorkPlan": {
        const { id } = await createArchivedWorkPlan();
        console.log(`WP created: ${id}`);
        break;
      }
      case "getWorkPlansByState":
        expandedLog(await getWorkPlansByState());
        break;
      case "createSemiAnnualReport": {
        const { id } = await createSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "createFilledSemiAnnualReport": {
        const { id } = await createFilledSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "createSubmittedSemiAnnualReport": {
        const { id } = await createSubmittedSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "createLockedSemiAnnualReport": {
        const { id } = await createLockedSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "createArchivedSemiAnnualReport": {
        const { id } = await createArchivedSemiAnnualReport();
        console.log(`SAR created: ${id}`);
        break;
      }
      case "getSemiAnnualReportsByState":
        expandedLog(await getSemiAnnualReportsByState());
        break;
      case "createBanner": {
        const { Item } = await createBanner();
        console.log(`Banner created: ${Item.key}`);
        break;
      }
      case "deleteBanner": {
        const { Key } = await deleteBannerById();
        console.log(`Banner deleted: ${Key.key}`);
        break;
      }
      case "getBanner":
        expandedLog(await getBannerById());
        break;
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
}

seed();
