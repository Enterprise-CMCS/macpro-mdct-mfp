import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";
import { isAuthorizedToFetchState } from "../../utils/auth/authorization";
import {
  parseSpecificReportParameters,
  parseStateReportParameters,
} from "../../utils/auth/parameters";
// types
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  queryReportMetadatasForState,
} from "../../storage/reports";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
} from "../../utils/responses/response-lib";

export const fetchReport = handler(async (event, _context) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  if (!isAuthorizedToFetchState(event, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportMetadata = await getReportMetadata(reportType, state, id);
  if (!reportMetadata) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const fieldData = await getReportFieldData(reportMetadata);
  if (!fieldData) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const formTemplate = await getReportFormTemplate(reportMetadata);
  if (!formTemplate) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  if (!reportMetadata.completionStatus) {
    reportMetadata.completionStatus = await calculateCompletionStatus(
      fieldData,
      formTemplate
    );
    reportMetadata.isComplete = isComplete(reportMetadata.completionStatus);
  }

  return ok({
    ...reportMetadata,
    formTemplate,
    fieldData,
  });
});

export const fetchReportsByState = handler(async (event, _context) => {
  const { allParamsValid, reportType, state } =
    parseStateReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  if (!isAuthorizedToFetchState(event, state!)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportsByState = await queryReportMetadatasForState(reportType, state);

  return ok(reportsByState);
});
