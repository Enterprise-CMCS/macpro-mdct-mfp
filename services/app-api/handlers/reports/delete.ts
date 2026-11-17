import handler from "../handler-lib";
import { error } from "../../utils/constants/constants";
import { badRequest, forbidden, ok } from "../../utils/responses/response-lib";
import {
  parseSpecificReportParameters,
  parseStateReportParameters,
} from "../../utils/auth/parameters";
import { isFeatureFlagEnabled } from "../../utils/featureFlags/featureFlags";
import {
  deleteReportFromDatabase,
  queryReportMetadatasForState,
} from "../../storage/reports";
import { hasPermissions } from "../../utils/auth/authorization";
import { UserRoles } from "../../utils/types";

//should not be callable if dev tool is not enabled
export const deleteReport = handler(async (event) => {
  const { allParamsValid, state } = parseSpecificReportParameters(event);

  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }
  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return badRequest(error.MISSING_DATA);
  }

  const useDevTools = await isFeatureFlagEnabled("devTools");
  if (useDevTools) {
    await deleteReportFromDatabase(JSON.parse(event.body));
  }
  return ok();
});

export const deleteReportsForState = handler(async (event) => {
  const { allParamsValid, reportType, state } =
    parseStateReportParameters(event);

  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  const useDevTools = await isFeatureFlagEnabled("devTools");
  if (useDevTools) {
    const reports = await queryReportMetadatasForState(reportType, state);
    for (var i = 0; i < reports.length; i++) {
      await deleteReportFromDatabase(reports[i]);
    }
  }

  return ok();
});
