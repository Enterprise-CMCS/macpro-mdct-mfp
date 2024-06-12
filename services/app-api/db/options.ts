import { Choice } from "prompts";
import { newWorkPlan, fillWorkPlan } from "./fixtures/work-plan";
import {
  newSemiAnnualReport,
  fillSemiAnnualReport,
} from "./fixtures/semi-annual-report";
import { newBanner } from "./fixtures/banner";
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

export const loginUsers = async (): Promise<void> => {
  const adminLogin = await login(adminUser, adminPassword);
  const stateLogin = await login(stateUser, statePassword);

  headers["x-api-key"] = stateLogin.IdToken;
  adminHeaders["x-api-key"] = adminLogin.IdToken;
};

// Work Plan (WP)
export const createWorkPlan = async (): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/WP/${state}`,
    headers,
    newWorkPlan(stateName)
  );

  return report;
};

export const createFilledWorkPlan = async (): Promise<SeedReportShape> => {
  const { id, reportYear, reportPeriod } = await createWorkPlan();
  const report = await putApi(
    `/reports/WP/${state}/${id}`,
    headers,
    fillWorkPlan(reportYear, reportPeriod)
  );
  return report;
};

export const createSubmittedWorkPlan = async (): Promise<SeedReportShape> => {
  const { id } = await createFilledWorkPlan();
  const report = await postApi(
    `/reports/submit/WP/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createApprovedWorkPlan = async (): Promise<SeedReportShape> => {
  const { id } = await createSubmittedWorkPlan();
  const report = await putApi(
    `/reports/approve/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createLockedWorkPlan = async (): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan();
  const report = await putApi(
    `/reports/release/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedWorkPlan = async (): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan();
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

export const workPlanChoices = async (): Promise<Choice[]> => {
  const reports: SeedReportShape[] = await getWorkPlansByState();
  return reports.map(({ submissionName, id }) => ({
    title: `${submissionName} (${id})`,
    value: id,
  }));
};

// Semi-Annual Report (SAR)
export const createSemiAnnualReport = async (): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan();
  const wp = await getWorkPlanById(id);

  const report = await postApi(
    `/reports/SAR/${state}`,
    headers,
    newSemiAnnualReport(wp)
  );

  return report;
};

export const createFilledSemiAnnualReport =
  async (): Promise<SeedReportShape> => {
    const sar = await createSemiAnnualReport();

    const report = await putApi(
      `/reports/SAR/${state}/${sar.id}`,
      headers,
      fillSemiAnnualReport(sar)
    );

    return report;
  };

export const createSubmittedSemiAnnualReport =
  async (): Promise<SeedReportShape> => {
    const { id } = await createFilledSemiAnnualReport();
    const report = await postApi(
      `/reports/submit/SAR/${state}/${id}`,
      headers,
      {}
    );
    return report;
  };

export const createLockedSemiAnnualReport =
  async (): Promise<SeedReportShape> => {
    const { id } = await createFilledSemiAnnualReport();
    const report = await putApi(
      `/reports/release/SAR/${state}/${id}`,
      adminHeaders,
      {}
    );
    return report;
  };

export const createArchivedSemiAnnualReport =
  async (): Promise<SeedReportShape> => {
    const { id } = await createFilledSemiAnnualReport();
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

export const semiAnnualReportChoices = async (): Promise<Choice[]> => {
  const reports = await getSemiAnnualReportsByState();
  return reports.map((report) => ({
    title: `${report.submissionName} (${report.id})`,
    value: report.id,
  }));
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
