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

// Reports
export const createReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  if (reportType === "SAR") {
    const report = createSemiAnnualReport(flags, year, period);
    return report;
  }

  const data = newWorkPlan(flags, stateName, year, period);
  const report = await postApi(
    `/reports/${reportType}/${state}`,
    headers,
    data
  );
  return report;
};

export const createFilledReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const response = await createReport(flags, reportType, year, period);

  if (response.id) {
    const report = await updateFillReport(
      flags,
      response.id,
      reportType,
      year,
      period
    );
    return report;
  }

  // Error message
  return response;
};

export const updateFillReport = async (
  flags: { [key: string]: true },
  id: string,
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  let data = {};

  if (reportType === "SAR") {
    const sar = await getSemiAnnualReportById(id);
    data = fillSemiAnnualReport(flags, sar);
  } else {
    data = fillWorkPlan(flags, year, period);
  }

  const report = await putApi(
    `/reports/${reportType}/${state}/${id}`,
    headers,
    data
  );
  return report;
};

export const createSubmittedReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const response = await createFilledReport(flags, reportType, year, period);

  if (response.id) {
    const report = await updateSubmitReport(response.id, reportType);
    return report;
  }

  // Error message
  return response;
};

export const updateSubmitReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await postApi(
    `/reports/submit/${reportType}/${state}/${id}`,
    headers,
    {}
  );
  return report;
};

export const createApprovedReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const { id } = await createSubmittedReport(flags, reportType, year, period);
  const report = await updateApprovedReport(id, reportType);
  return report;
};

export const updateApprovedReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/approve/${reportType}/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createLockedReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const response = await createApprovedReport(flags, reportType, year, period);

  if (response.id) {
    const report = await updateLockedReport(response.id, reportType);
    return report;
  }

  // Error message
  return response;
};

export const updateLockedReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/release/${reportType}/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

export const createArchivedReport = async (
  flags: { [key: string]: true },
  reportType: string,
  year: number,
  period: number
): Promise<SeedReportShape> => {
  const response = await createSubmittedReport(flags, reportType, year, period);

  if (response.id) {
    const report = await updateArchivedReport(response.id, reportType);
    return report;
  }

  // Error message
  return response;
};

export const updateArchivedReport = async (
  id: string,
  reportType: string
): Promise<SeedReportShape> => {
  const report = await putApi(
    `/reports/archive/${reportType}/${state}/${id}`,
    adminHeaders,
    {}
  );
  return report;
};

// Work Plans (WP)
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

// Semi-Annual Reports (SAR)
export const createSemiAnnualReport = async (
  flags: { [key: string]: true },
  year: number,
  period: number
): Promise<SeedReportShape> => {
  let id = "";

  const newWP = await createApprovedReport(flags, "WP", year, period);

  if (newWP.id) {
    id = newWP.id;
  } else {
    const existingWPs = await getWorkPlansByReportingPeriod(year, period);
    const approvedWPs = existingWPs.filter(
      (w) => w.status === ReportStatus.APPROVED
    );

    if (approvedWPs.length === 0) {
      id = approvedWPs[0].id;
      return "No approved WP available for this SAR." as unknown as SeedReportShape;
    }
  }

  const wp = await getWorkPlanById(id);

  const report = await postApi(
    `/reports/SAR/${state}`,
    headers,
    newSemiAnnualReport(flags, wp)
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

// Banners
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
