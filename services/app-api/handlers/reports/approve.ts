import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { getReportMetadata, putReportMetadata } from "../../storage/reports";
// types
import { ReportStatus, ReportType, State, UserRoles } from "../../utils/types";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
import { isFeatureFlagEnabled } from "../../utils/featureFlags/featureFlags";

const updateReportForApproval = async (
  reportType: ReportType,
  state: State,
  id: string
) => {
  const currentReport = await getReportMetadata(reportType, state, id);

  if (!currentReport) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const updatedReport = {
    ...currentReport,
    status: ReportStatus.APPROVED,
    locked: true,
    isComplete: true,
  };

  try {
    await putReportMetadata(updatedReport);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return updatedReport;
};

export const approveReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN, UserRoles.APPROVER])) {
    return forbidden(error.UNAUTHORIZED);
  }

  return ok(await updateReportForApproval(reportType, state, id));
});

//created a separate handler for quick approving reports when in dev tools
export const approveReportDev = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  const useDevTools = await isFeatureFlagEnabled("devTools");
  return useDevTools
    ? ok(await updateReportForApproval(reportType, state, id))
    : ok();
});
