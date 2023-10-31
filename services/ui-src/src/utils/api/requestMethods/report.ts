import { API } from "aws-amplify";
import { AnyObject, ReportKeys } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

async function archiveReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mfp",
    `/reports/archive/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get(
    "mfp",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.get(
    "mfp",
    `/reports/${reportType}/${state}/${id}`,
    request
  );
  return response;
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
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  updateTimeout();
  const response = await API.post(
    "mfp",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}

async function putReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mfp",
    `/reports/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function releaseReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mfp",
    `/reports/release/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function submitReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.post(
    "mfp",
    `/reports/submit/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function approveReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mfp",
    `/reports/approve/${reportType}/${state}/${id}`,
    request
  );
  return response;
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
