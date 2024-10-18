import { get, post, put } from "aws-amplify/api";
import { AnyObject, ReportKeys, ReportShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

const apiName = "mfp";

async function archiveReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/archive/${reportType}/${state}/${id}`;

  updateTimeout();
  await put({
    apiName,
    path,
    options,
  }).response;
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/reports/${reportType}/${state}`;

  updateTimeout();
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;
  return (await body.json()) as unknown as ReportShape[];
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;
  return (await body.json()) as unknown as ReportShape;
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

  updateTimeout();
  const { body } = await post({
    apiName,
    path,
    options,
  }).response;
  return (await body.json()) as unknown as ReportShape;
}

async function putReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await put({
    apiName,
    path,
    options,
  }).response;
  return (await body.json()) as unknown as ReportShape;
}

async function releaseReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;

  updateTimeout();
  await put({
    apiName,
    path,
    options,
  }).response;
}

async function submitReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await post({
    apiName,
    path,
    options,
  }).response;
  return (await body.json()) as unknown as ReportShape;
}

async function approveReport(reportKeys: ReportKeys, report: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/approve/${reportType}/${state}/${id}`;

  updateTimeout();
  await put({
    apiName,
    path,
    options,
  }).response;
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
