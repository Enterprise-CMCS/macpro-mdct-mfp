import { AnyObject, ReportShape, ReportKeys } from "types";
import { get, post, put } from "utils";

async function archiveReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/archive/${reportType}/${state}/${id}`;
  return put<ReportShape>(path);
}

async function getReportsByState(reportType: string, state: string) {
  const path = `/reports/${reportType}/${state}`;
  return get<ReportShape[]>(path);
}

async function getReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;
  return get<ReportShape>(path);
}

/**
 * TODO: Swap report from AnyObject to a ReportMetaData + FieldData type
 */
async function postReport(
  reportType: string,
  state: string,
  report: AnyObject
) {
  const options: any = {
    body: { ...report },
  };
  const path = `/reports/${reportType}/${state}`;
  return post<AnyObject>(path, options);
}

async function putReport(reportKeys: ReportKeys, report: AnyObject) {
  const options: any = {
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  return put<AnyObject>(path, options);
}

async function releaseReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;
  return put<ReportShape>(path);
}

async function submitReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;
  return post<ReportShape>(path);
}

async function approveReport(reportKeys: ReportKeys, report: AnyObject) {
  const options: any = {
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/approve/${reportType}/${state}/${id}`;
  return put<AnyObject>(path, options);
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
