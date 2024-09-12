import {
  fillSemiAnnualReport,
  fillWorkPlan,
  newBanner,
  newSemiAnnualReport,
  newWorkPlan,
} from "./fixtures";
import {
  awsSignedHeaders,
  deleteApi,
  getApi,
  login,
  postApi,
  putApi,
} from "./helpers";
import { AwsHeaders, SeedBannerShape, SeedReportShape } from "./types";

function decomment(json: any) {
  const content = JSON.stringify(json);
  return JSON.parse(content);
}

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

async function updateHeaders(
  headers: AwsHeaders,
  signedHeaders: AwsHeaders | undefined
) {
  if (signedHeaders) {
    headers["authorization"] = signedHeaders.authorization;
    headers["host"] = signedHeaders.host;
    headers["x-amz-date"] = signedHeaders["x-amz-date"];
    headers["x-amz-security-token"] = signedHeaders["x-amz-security-token"];
  }
  return headers;
}

// Work Plan (WP)
export const createWorkPlan = async (
  customReportYear?: number,
  customReportPeriod?: number
): Promise<SeedReportShape> => {
  const requestPath = `/reports/WP/${state}`;
  const signedHeaders = awsSignedHeaders(
    "POST",
    requestPath,
    decomment(newWorkPlan(stateName, customReportYear, customReportPeriod))
  );
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await postApi(
    requestPath,
    headers,
    decomment(newWorkPlan(stateName, customReportYear, customReportPeriod))
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

  const requestPath = `/reports/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders(
    "POST",
    requestPath,
    decomment(fillWorkPlan(reportYear, reportPeriod))
  );
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await putApi(
    requestPath,
    headers,
    decomment(fillWorkPlan(reportYear, reportPeriod))
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

  const requestPath = `/reports/submit/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await postApi(requestPath, headers, {});
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

  const requestPath = `/reports/approve/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await putApi(requestPath, adminHeaders, {});
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

  const requestPath = `/reports/release/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await putApi(requestPath, adminHeaders, {});
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

  const requestPath = `/reports/archive/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await putApi(requestPath, adminHeaders, {});
  return report;
};

export const getWorkPlanById = async (id: string): Promise<SeedReportShape> => {
  const requestPath = `/reports/WP/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("GET", requestPath, {});
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await getApi(requestPath, headers);
  return report;
};

export const getWorkPlansByState = async (): Promise<SeedReportShape[]> => {
  const requestPath = `/reports/WP/${state}`;
  const signedHeaders = awsSignedHeaders("GET", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const reports = await getApi(requestPath, headers);
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

  const requestPath = `/reports/SAR/${state}`;
  const signedHeaders = awsSignedHeaders(
    "POST",
    requestPath,
    decomment(newSemiAnnualReport(wp))
  );
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await postApi(
    requestPath,
    headers,
    decomment(newSemiAnnualReport(wp))
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

  const requestPath = `/reports/SAR/${state}/${sar.id}`;
  const signedHeaders = awsSignedHeaders(
    "POST",
    requestPath,
    decomment(fillSemiAnnualReport(sar))
  );
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await putApi(
    requestPath,
    headers,
    decomment(fillSemiAnnualReport(sar))
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

  const requestPath = `/reports/submit/SAR/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!headers["x-api-key"]) {
    await loginSeedUsers();
  }
  headers = await updateHeaders(headers, signedHeaders);

  const report = await postApi(requestPath, headers, {});
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

  const requestPath = `/reports/release/SAR/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await putApi(requestPath, adminHeaders, {});
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

  const requestPath = `/reports/archive/SAR/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("POST", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await putApi(requestPath, adminHeaders, {});
  return report;
};

export const getSemiAnnualReportById = async (
  id: string
): Promise<SeedReportShape> => {
  const requestPath = `/reports/SAR/${state}/${id}`;
  const signedHeaders = awsSignedHeaders("GET", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const report = await getApi(requestPath, adminHeaders);
  return report;
};

export const getSemiAnnualReportsByState = async (): Promise<
  SeedReportShape[]
> => {
  const requestPath = `/reports/SAR/${state}`;
  const signedHeaders = awsSignedHeaders("GET", requestPath, {});
  if (!adminHeaders["x-api-key"]) {
    await loginSeedUsers();
  }
  adminHeaders = await updateHeaders(adminHeaders, signedHeaders);

  const reports = await getApi(requestPath, adminHeaders);
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
