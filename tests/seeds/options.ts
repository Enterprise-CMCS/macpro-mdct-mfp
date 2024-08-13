import {
  fillSemiAnnualReport,
  fillWorkPlan,
  newBanner,
  newSemiAnnualReport,
  newWorkPlan,
} from "./fixtures";
import { deleteApi, getApi, login, postApi, putApi } from "./helpers";
import { AwsHeaders, SeedBannerShape, SeedReportShape } from "./types";

const adminUser: string | undefined = process.env.SEED_ADMIN_USER_EMAIL;
const adminPassword: string | undefined = process.env.SEED_ADMIN_USER_PASSWORD;
const stateUser: string | undefined = process.env.SEED_STATE_USER_EMAIL;
const statePassword: string | undefined = process.env.SEED_STATE_USER_PASSWORD;
export const state: string = process.env.SEED_STATE || "PR";
const stateName: string = process.env.SEED_STATE_NAME || "Puerto Rico";

let headers: AwsHeaders = {};
let adminHeaders: AwsHeaders = {};

export const loginSeedUsers = async (): Promise<void> => {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  headers["x-api-key"] = stateLogin.IdToken;
  adminHeaders["x-api-key"] = adminLogin.IdToken;
};

// Work Plan (WP)
export const createWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/WP/${state}`,
    headers,
    newWorkPlan(stateName, customReportYear, customReportPeriod)
  );
  return report;
};

export const createFilledWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id, reportYear, reportPeriod } = await createWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/WP/${state}/${id}`,
    headers,
    fillWorkPlan(reportYear, reportPeriod)
  );
  return report;
};

export const createSubmittedWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createFilledWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const report = await postApi(
    `/reports/submit/WP/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createApprovedWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createSubmittedWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/approve/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createLockedWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/release/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/archive/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const getWorkPlanById = async (id: string): Promise<SeedReportShape> => {
  const report = await getApi(`/reports/WP/${state}/${id}`, headers);
  return report;
};

export const getWorkPlansByState = async (): Promise<SeedReportShape[]> => {
  const reports = await getApi(`/reports/WP/${state}`, headers);
  return reports;
};

// Semi-Annual Report (SAR)
export const createSemiAnnualReport = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan(
    customReportYear,
    customReportPeriod
  );
  const wp = await getWorkPlanById(id);

  const report = await postApi(
    `/reports/SAR/${state}`,
    headers,
    newSemiAnnualReport(wp)
  );

  return report;
};

export const createFilledSemiAnnualReport = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const sar = await createSemiAnnualReport(
    customReportYear,
    customReportPeriod
  );

  const report = await putApi(
    `/reports/SAR/${state}/${sar.id}`,
    headers,
    fillSemiAnnualReport(sar)
  );

  return report;
};

export const createSubmittedSemiAnnualReport = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createFilledSemiAnnualReport(
    customReportYear,
    customReportPeriod
  );
  const report = await postApi(
    `/reports/submit/SAR/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createLockedSemiAnnualReport = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createFilledSemiAnnualReport(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/release/SAR/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedSemiAnnualReport = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const { id } = await createFilledSemiAnnualReport(
    customReportYear,
    customReportPeriod
  );
  const report = await putApi(
    `/reports/archive/SAR/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const getSemiAnnualReportById = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await getApi(`/reports/SAR/${state}/${id}`, adminHeaders);
  return report;
};

export const getSemiAnnualReportsByState = async (): Promise<
  SeedReportShape[]
> => {
  const reports = await getApi(`/reports/SAR/${state}`, adminHeaders);
  return reports;
};

// Banner
export const bannerKey: string = "admin-banner-id";

export const createBanner = async (): Promise<SeedBannerShape> => {
  const banner = await postApi(
    `/banners/${bannerKey}`,
    adminHeaders,
    newBanner(bannerKey)
  );
  return banner;
};

export const getBannerById = async (): Promise<SeedBannerShape> => {
  const banner = await getApi(`/banners/${bannerKey}`, headers);
  return banner;
};

export const deleteBannerById = async (): Promise<SeedBannerShape> => {
  const banner = await deleteApi(`/banners/${bannerKey}`, adminHeaders);
  return banner;
};
