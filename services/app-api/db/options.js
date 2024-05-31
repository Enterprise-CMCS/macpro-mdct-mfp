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

const loginUsers = async () => {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  headers["x-api-key"] = stateLogin.IdToken;
  adminHeaders["x-api-key"] = adminLogin.IdToken;
};

// Work Plan (WP)
const createWorkPlan = async () => {
  const report = await postApi(
    `/reports/WP/${state}`,
    headers,
    newWorkPlan(stateName)
  );

  return report;
};

const createFilledWorkPlan = async () => {
  const { id, reportYear, reportPeriod } = await createWorkPlan();
  const report = await putApi(
    `/reports/WP/${state}/${id}`,
    headers,
    fillWorkPlan(reportYear, reportPeriod)
  );
  return report;
};

const createSubmittedWorkPlan = async () => {
  const { id } = await createFilledWorkPlan();
  const report = await postApi(`/reports/submit/WP/${state}/${id}`, headers);
  return report;
};

const createApprovedWorkPlan = async () => {
  const { id } = await createSubmittedWorkPlan();
  const report = await putApi(
    `/reports/approve/WP/${state}/${id}`,
    adminHeaders
  );
  return report;
};

const createLockedWorkPlan = async () => {
  const { id } = await createApprovedWorkPlan();
  const report = await putApi(
    `/reports/release/WP/${state}/${id}`,
    adminHeaders
  );
  return report;
};

const createArchivedWorkPlan = async () => {
  const { id } = await createApprovedWorkPlan();
  const report = await putApi(
    `/reports/archive/WP/${state}/${id}`,
    adminHeaders
  );
  return report;
};

const getWorkPlanById = async (id) => {
  const report = await getApi(`/reports/WP/${state}/${id}`, headers);
  return report;
};

const getWorkPlansByState = async () => {
  const reports = await getApi(`/reports/WP/${state}`, headers);
  return reports;
};

const workPlanChoices = async () => {
  const reports = await getWorkPlansByState();
  return reports.map(({ submissionName, id }) => ({
    title: `${submissionName} (${id})`,
    value: id,
  }));
};

// Semi-Annual Report (SAR)
const createSemiAnnualReport = async () => {
  const { id } = await createApprovedWorkPlan();
  const wp = await getWorkPlanById(id);

  const report = await postApi(
    `/reports/SAR/${state}`,
    headers,
    newSemiAnnualReport(wp)
  );

  return report;
};

const createFilledSemiAnnualReport = async () => {
  const sar = await createSemiAnnualReport();

  const report = await putApi(
    `/reports/SAR/${state}/${sar.id}`,
    headers,
    fillSemiAnnualReport(sar)
  );

  return report;
};

const createSubmittedSemiAnnualReport = async () => {
  const { id } = await createFilledSemiAnnualReport();
  const report = await postApi(`/reports/submit/SAR/${state}/${id}`, headers);
  return report;
};

const createLockedSemiAnnualReport = async () => {
  const { id } = await createFilledSemiAnnualReport();
  const report = await putApi(
    `/reports/release/SAR/${state}/${id}`,
    adminHeaders
  );
  return report;
};

const createArchivedSemiAnnualReport = async () => {
  const { id } = await createFilledSemiAnnualReport();
  const report = await putApi(
    `/reports/archive/SAR/${state}/${id}`,
    adminHeaders
  );
  return report;
};

const getSemiAnnualReportById = async (id) => {
  const report = await getApi(`/reports/SAR/${state}/${id}`, adminHeaders);
  return report;
};

const getSemiAnnualReportsByState = async () => {
  const reports = await getApi(`/reports/SAR/${state}`, adminHeaders);
  return reports;
};

const semiAnnualReportChoices = async () => {
  const reports = await getSemiAnnualReportsByState();
  return reports.map((report) => ({
    title: `${report.submissionName} (${report.id})`,
    value: report.id,
  }));
};

// Banner
const bannerKey = "admin-banner-id";

const createBanner = async () => {
  const banner = await postApi(
    `/banners/${bannerKey}`,
    adminHeaders,
    newBanner(bannerKey)
  );
  return banner;
};

const getBannerById = async () => {
  const banner = await getApi(`/banners/${bannerKey}`, headers);
  return banner;
};

const deleteBannerById = async () => {
  const banner = await deleteApi(`/banners/${bannerKey}`, adminHeaders);
  return banner;
};

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
