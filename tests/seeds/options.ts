import { ReportStatus } from "../../services/app-api/utils/types";
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
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/WP/${state}`,
    headers,
    newWorkPlan(stateName, year, period)
  );
  return report;
};

export const createFilledWorkPlan = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createWorkPlan(year, period);
  const report = await updateFillWorkPlan(id);
  return report;
};

export const updateFillWorkPlan = async (
  id: string
): Promise<SeedReportShape> => {
  const { reportYear, reportPeriod } = await getWorkPlanById(id);

  const report = await putApi(
    `/reports/WP/${state}/${id}`,
    headers,
    fillWorkPlan(reportYear, reportPeriod)
  );
  return report;
};

export const createSubmittedWorkPlan = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createFilledWorkPlan(year, period);
  const report = await updateSubmitWorkPlan(id);
  return report;
};

export const updateSubmitWorkPlan = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/submit/WP/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createApprovedWorkPlan = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createSubmittedWorkPlan(year, period);
  const report = await updateApproveWorkPlan(id);
  return report;
};

export const updateApproveWorkPlan = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/approve/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createLockedWorkPlan = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan(year, period);
  const report = await updateLockWorkPlan(id);
  return report;
};

export const updateLockWorkPlan = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/release/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedWorkPlan = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createApprovedWorkPlan(year, period);
  const report = await updateArchiveWorkPlan(id);
  return report;
};

export const updateArchiveWorkPlan = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/archive/WP/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const getWorkPlansByReportingPeriod = async (
  year: number,
  period: number
): Promise<SeedReportShape[]> => {
  const wps = await getWorkPlansByState();
  const reports = wps.filter(
    (w) => w.reportYear === year && w.reportPeriod === period
  );
  return reports;
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
  year: number,
  period: number
): Promise<SeedReportShape> => {
  let id;

  const newWP = await createApprovedWorkPlan(year, period);

  if (newWP.id) {
    id = newWP.id;
  } else {
    const existingWPs = await getWorkPlansByReportingPeriod(year, period);
    const approvedWPs = existingWPs.filter(
      (w) => w.status === ReportStatus.APPROVED
    );

    if (approvedWPs.length === 0) {
      return "No approved WP available for this SAR." as unknown as SeedReportShape;
    }

    id = approvedWPs[0].id;
  }

  const wp = await getWorkPlanById(id);

  const report = await postApi(
    `/reports/SAR/${state}`,
    headers,
    newSemiAnnualReport(wp)
  );

  return report;
};

export const createFilledSemiAnnualReport = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const sar = await createSemiAnnualReport(year, period);

  if (sar.id) {
    const report = await updateFillSemiAnnualReport(sar.id);
    return report;
  }

  // Error message
  return sar;
};

export const updateFillSemiAnnualReport = async (
  id: string
): Promise<SeedReportShape> => {
  const sar = await getSemiAnnualReportById(id);
  const report = await putApi(
    `/reports/SAR/${state}/${id}`,
    headers,
    fillSemiAnnualReport(sar)
  );
  return report;
};

export const createSubmittedSemiAnnualReport = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const sar = await createFilledSemiAnnualReport(year, period);

  if (sar.id) {
    const report = await updateSubmitSemiAnnualReport(sar.id);
    return report;
  }

  // Error message
  return sar;
};

export const updateSubmitSemiAnnualReport = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/submit/SAR/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createLockedSemiAnnualReport = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const sar = await createFilledSemiAnnualReport(year, period);

  if (sar.id) {
    const report = await updateLockSemiAnnualReport(sar.id);
    return report;
  }

  // Error message
  return sar;
};

export const updateLockSemiAnnualReport = async (
  id: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/release/SAR/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedSemiAnnualReport = async (
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const sar = await createFilledSemiAnnualReport(year, period);

  if (sar.id) {
    const report = await updateArchiveSemiAnnualReport(sar.id);
    return report;
  }

  // Error message
  return sar;
};

export const updateArchiveSemiAnnualReport = async (
  id: string
): Promise<SeedReportShape> => {
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
export const createBanner = async (
  status: string
): Promise<SeedBannerShape> => {
  const banner = await postApi(`/banners`, adminHeaders, newBanner(status));
  return banner;
};

export const getBanners = async (): Promise<SeedBannerShape[]> => {
  const banners = await getApi(`/banners`, adminHeaders);
  return banners;
};

export const deleteBanners = async (): Promise<void> => {
  const banners = await getBanners();

  banners.map(async (banner: SeedBannerShape) => {
    await deleteApi(`/banners/${banner.key}`, adminHeaders);
  });
};
