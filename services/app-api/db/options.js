const { newWorkPlan, fillWorkPlan } = require("./fixtures/work-plan.js");
const {
  newSemiAnnualReport,
  fillSemiAnnualReport,
} = require("./fixtures/semi-annual-report.js");
const { newBanner } = require("./fixtures/banner.js");
const { deleteApi, getApi, login, postApi, putApi } = require("./helpers.js");

const adminUser = process.env.SEED_ADMIN_USER;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const stateUser = process.env.SEED_STATE_USER;
const statePassword = process.env.SEED_STATE_PASSWORD;
const state = process.env.SEED_STATE;
const stateName = process.env.SEED_STATE_NAME;

let headers = {};
let adminHeaders = {};

async function loginUsers() {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  headers["x-api-key"] = stateLogin.IdToken;
  adminHeaders["x-api-key"] = adminLogin.IdToken;
}

// Work Plan (WP)
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

// Semi-Annual Report (SAR)
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

// Banner
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

module.exports = {
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
};
