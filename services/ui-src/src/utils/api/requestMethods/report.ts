import { AnyObject, ReportKeys } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { apiLib } from "utils";

async function archiveReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/archive/${reportType}/${state}/${id}`;

  await apiLib.put(path, options);
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/reports/${reportType}/${state}`;

  return await apiLib.get(path, options);
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  return await apiLib.get(path, options);
}

/**
 * @todo Swap report from AnyObject to a ReportMetaData + FieldData type
 */
async function postReport(
  reportType: string,
  state: string,
  report: AnyObject
) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const path = `/reports/${reportType}/${state}`;

  return await apiLib.post(path, options);
}

async function putReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  return await apiLib.put(path, options);
}

async function releaseReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;

  await apiLib.put(path, options);
}

async function submitReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;

  return await apiLib.post(path, options);
}

async function approveReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/approve/${reportType}/${state}/${id}`;

  await apiLib.put(path, options);
}

export {
  archiveReport,
  getReportsByState,
  getReport,
  postReport,
  putReport,
  releaseReport,
  submitReport,
  approveReport,
};
