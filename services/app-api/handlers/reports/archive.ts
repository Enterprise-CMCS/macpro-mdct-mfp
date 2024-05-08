import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { error, reportTables } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
// types
import { StatusCodes, UserRoles } from "../../utils/types";
import { getReportMetadata } from "../../storage/reports";

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

  const reportTable = reportTables[reportType];

  // toggle archived status in report metadata table
  const reportMetadataParams = {
    TableName: reportTable,
    Item: {
      ...currentReport,
      archived: !currentArchivedStatus,
    },
  };

  try {
    await dynamoDb.put(reportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: reportMetadataParams.Item,
  };
});
