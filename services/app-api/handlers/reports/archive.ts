import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { getReportMetadata, putReportMetadata } from "../../storage/reports";
// types
import { StatusCodes, UserRoles } from "../../utils/types";

export const archiveReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN, UserRoles.APPROVER])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const currentReport = await getReportMetadata(reportType, state, id);

  if (!currentReport) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const currentArchivedStatus = currentReport?.archived;

  const updatedReport = {
    ...currentReport,
    archived: !currentArchivedStatus,
  };

  try {
    await putReportMetadata(updatedReport);
  } catch {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: updatedReport,
  };
});
