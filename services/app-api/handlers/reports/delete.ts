import handler from "../handler-lib";
import { error } from "../../utils/constants/constants";
import { badRequest, ok } from "../../utils/responses/response-lib";
import {
  parseSpecificReportParameters,
  parseStateReportParameters,
} from "../../utils/auth/parameters";
import { isFeatureFlagEnabled } from "../../utils/featureFlags/featureFlags";
import {
  deleteReportFromDatabase,
  queryReportMetadatasForState,
} from "../../storage/reports";

//should not be callable if dev tool is not enabled
export const deleteReport = handler(async (event, _context) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  const useDevTools = await isFeatureFlagEnabled("devTools");
  if (useDevTools) {
    await deleteReportFromDatabase({ reportType, state, id });
  }
  return ok();
});

export const deleteReportsForState = handler(async (event, _context) => {
  const { allParamsValid, reportType, state } =
    parseStateReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  const useDevTools = await isFeatureFlagEnabled("devTools");
  if (useDevTools) {
    const reports = await queryReportMetadatasForState(reportType, state);
    for (var i = 0; i < reports.length; i++) {
      const id = reports[i].id;
      await deleteReportFromDatabase({ reportType, state, id });
    }
  }

  return ok();
});
