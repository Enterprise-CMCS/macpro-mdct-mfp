import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { getReportMetadata, putReportMetadata } from "../../storage/reports";
// types
import { ReportType, UserRoles } from "../../utils/types";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";

export const archiveReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN, UserRoles.APPROVER])) {
    return forbidden(error.UNAUTHORIZED);
  }

  const currentReport = await getReportMetadata(reportType, state, id);
  const hasAssociatedSar = currentReport?.associatedSar;

  // SAR or WP with associated SAR cannot be archived
  if (reportType === ReportType.SAR || hasAssociatedSar) {
    return badRequest(error.INVALID_DATA);
  }

  if (!currentReport) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const updatedReport = {
    ...currentReport,
    archived: true,
  };

  try {
    await putReportMetadata(updatedReport);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return ok(updatedReport);
});
