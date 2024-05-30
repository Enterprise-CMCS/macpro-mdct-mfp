/* eslint-disable no-console */
const prompts = require("prompts");
const { newWorkPlan, fillWorkPlan } = require("./fixtures/work-plan.js");
const {
  newSemiAnnualReport,
  fillSemiAnnualReport,
} = require("./fixtures/semi-annual-report.js");
const { newBanner } = require("./fixtures/banner.js");
const {
  expandedLog,
  deleteApi,
  getApi,
  login,
  postApi,
  putApi,
} = require("./helpers.js");

const adminUser = process.env.SEED_ADMIN_USER;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const stateUser = process.env.SEED_STATE_USER;
const statePassword = process.env.SEED_STATE_PASSWORD;
const state = process.env.SEED_STATE;
const stateName = process.env.SEED_STATE_NAME;

(async () => {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  const headers = {
    "x-api-key": stateLogin.IdToken,
  };

  const adminHeaders = {
    "x-api-key": adminLogin.IdToken,
  };

  // Work Plans (WP)
  async function createWorkPlan() {
    const report = await postApi(
      `/reports/WP/${state}`,
      headers,
      newWorkPlan(stateName)
    );

    return report;
  }

  async function createFilledWorkPlan() {
    const { id, reportYear, reportPeriod } = await createWorkPlan();
    const report = await putApi(
      `/reports/WP/${state}/${id}`,
      headers,
      fillWorkPlan(reportYear, reportPeriod)
    );
    return report;
  }

  async function createSubmittedWorkPlan() {
    const { id } = await createFilledWorkPlan();
    const report = await postApi(`/reports/submit/WP/${state}/${id}`, headers);
    return report;
  }

  async function createApprovedWorkPlan() {
    const { id } = await createSubmittedWorkPlan();
    const report = await putApi(
      `/reports/approve/WP/${state}/${id}`,
      adminHeaders
    );
    return report;
  }

  async function createLockedWorkPlan() {
    const { id } = await createApprovedWorkPlan();
    const report = await putApi(
      `/reports/release/WP/${state}/${id}`,
      adminHeaders
    );
    return report;
  }

  async function createArchivedWorkPlan() {
    const { id } = await createApprovedWorkPlan();
    const report = await putApi(
      `/reports/archive/WP/${state}/${id}`,
      adminHeaders
    );
    return report;
  }

  async function getWorkPlanById(id) {
    const report = await getApi(`/reports/WP/${state}/${id}`, headers);
    return report;
  }

  async function getWorkPlansByState() {
    const reports = await getApi(`/reports/WP/${state}`, headers);
    return reports;
  }

  async function workPlanChoices() {
    const reports = await getWorkPlansByState();
    return reports.map(({ submissionName, id }) => ({
      title: `${submissionName} (${id})`,
      value: id,
    }));
  }

  // Semi-Annual Reports (SAR)
  async function createSemiAnnualReport() {
    const approved = await createApprovedWorkPlan();
    const wp = await getWorkPlanById(approved.id);

    const report = await postApi(
      `/reports/SAR/${state}`,
      headers,
      newSemiAnnualReport(wp)
    );

    return report;
  }

  async function createFilledSemiAnnualReport() {
    const sar = await createSemiAnnualReport();

    const report = await putApi(
      `/reports/SAR/${state}/${sar.id}`,
      headers,
      fillSemiAnnualReport(sar)
    );

    return report;
  }

  async function createSubmittedSemiAnnualReport() {
    const { id } = await createFilledSemiAnnualReport();
    const report = await postApi(`/reports/submit/SAR/${state}/${id}`, headers);
    return report;
  }

  async function createLockedSemiAnnualReport() {
    const { id } = await createFilledSemiAnnualReport();
    const report = await putApi(
      `/reports/release/SAR/${state}/${id}`,
      adminHeaders
    );
    return report;
  }

  async function createArchivedSemiAnnualReport() {
    const { id } = await createFilledSemiAnnualReport();
    const report = await putApi(
      `/reports/archive/SAR/${state}/${id}`,
      adminHeaders
    );
    return report;
  }

  async function getSemiAnnualReportById(id) {
    const report = await getApi(`/reports/SAR/${state}/${id}`, adminHeaders);
    return report;
  }

  async function getSemiAnnualReportsByState() {
    const reports = await getApi(`/reports/SAR/${state}`, adminHeaders);
    return reports;
  }

  async function semiAnnualReportChoices() {
    const reports = await getSemiAnnualReportsByState();
    return reports.map((report) => ({
      title: `${report.submissionName} (${report.id})`,
      value: report.id,
    }));
  }

  const wpIds = await workPlanChoices();
  const sarIds = await semiAnnualReportChoices();

  const bannerKey = "admin-banner-id";

  async function createBanner() {
    const banner = await postApi(
      `/banners/${bannerKey}`,
      adminHeaders,
      newBanner(bannerKey)
    );
    return banner;
  }

  async function getBannerById() {
    const banner = await getApi(`/banners/${bannerKey}`, headers);
    return banner;
  }

  async function deleteBannerById() {
    const banner = await deleteApi(`/banners/${bannerKey}`, adminHeaders);
    return banner;
  }

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
        prev === "getSemiAnnualReportById" && sarIds.length > 0
          ? "select"
          : null,
      name: "semiAnnualReportId",
      message: "Choose",
      choices: sarIds,
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
      case "deleteBanner":
        expandedLog(await deleteBannerById());
        break;
      case "getBanner":
        expandedLog(await getBannerById());
        break;
      default:
        break;
    }
  };

  await prompts(questions, { onSubmit });
})();
