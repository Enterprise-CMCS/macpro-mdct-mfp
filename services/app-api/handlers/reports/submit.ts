import { bool } from "aws-sdk/clients/signer";
import jwtDecode from "jwt-decode";
import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { error } from "../../utils/constants/constants";
import { convertDateUtcToEt } from "../../utils/time/time";
// types
import { ReportStatus, UserRoles } from "../../utils/types";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
import {
  badRequest,
  conflict,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";

export const submitReport = handler(async (event, _context) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportMetadata = await getReportMetadata(reportType, state, id);
  if (!reportMetadata) {
    return notFound(error.NOT_IN_DATABASE);
  }

  const { status, isComplete } = reportMetadata;

  if (status === "Submitted") {
    return ok(reportMetadata);
  }

  if (!isComplete) {
    return conflict(error.REPORT_INCOMPLETE);
  }

  const jwt = jwtDecode(event.headers["x-api-key"]!) as Record<
    string,
    string | bool
  >;

  const date = Date.now();
  const fullName = `${jwt.given_name} ${jwt.family_name}`;
  const submissionCount = reportMetadata.submissionCount
    ? reportMetadata.submissionCount + 1
    : 1;
  const submittedReportMetadata = {
    ...reportMetadata,
    submittedBy: fullName,
    submittedOnDate: date,
    status: ReportStatus.SUBMITTED,
    locked: true,
    submissionCount: submissionCount,
  };

  try {
    await putReportMetadata(submittedReportMetadata);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  const existingFieldData = await getReportFieldData(reportMetadata);
  if (!existingFieldData) {
    return internalServerError(error.NOT_IN_DATABASE);
  }

  const fieldData = {
    ...existingFieldData,
    submitterName: fullName,
    submitterEmailAddress: jwt.email,
    reportSubmissionDate: convertDateUtcToEt(date),
  };

  const formTemplate = await getReportFormTemplate(reportMetadata);
  if (!formTemplate) {
    return internalServerError(error.NOT_IN_DATABASE);
  }

  try {
    await putReportFieldData(reportMetadata, fieldData);
  } catch {
    return internalServerError(error.S3_OBJECT_UPDATE_ERROR);
  }

  return ok({
    ...submittedReportMetadata,
    fieldData: { ...fieldData },
    formTemplate: {
      ...formTemplate,
    },
  });
});
