import handler from "../handler-lib";
import KSUID from "ksuid";
// utils
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { calculateCompletionStatus } from "../../utils/validation/completionStatus";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
// types
import {
  ReportMetadataShape,
  ReportStatus,
  StatusCodes,
  UserRoles,
} from "../../utils/types";

/**
 * Locked reports can be released by admins.
 *
 * When reports are released:
 *
 * 1) Report metadata is set to `locked=false`
 * 2) previousVersions has current metadata fieldDataId appended
 * 3) Report table row is updated with new fieldDataId
 * 4) User can now edit report.
 *
 */
export const releaseReport = handler(async (event) => {
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

  const metadata = await getReportMetadata(reportType, state, id);
  if (!metadata) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const isLocked = metadata.locked;

  // Report is not locked.
  if (!isLocked) {
    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...metadata,
      },
    };
  }

  const isArchived = metadata.archived;

  if (isArchived) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.ALREADY_ARCHIVED,
    };
  }

  const newFieldDataId = KSUID.randomSync().string;

  const previousRevisions = Array.isArray(metadata.previousRevisions)
    ? metadata.previousRevisions.concat([metadata.fieldDataId])
    : [metadata.fieldDataId];

  const fieldData = await getReportFieldData(metadata);
  if (!fieldData) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const formTemplate = await getReportFormTemplate(metadata);
  if (!formTemplate) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const updatedFieldData = {
    ...fieldData,
    generalInformation_resubmissionInformation: "",
  };

  const newReportMetadata: ReportMetadataShape = {
    ...metadata,
    fieldDataId: newFieldDataId,
    locked: false,
    previousRevisions,
    status: ReportStatus.IN_REVISION,
    completionStatus: await calculateCompletionStatus(
      updatedFieldData,
      formTemplate
    ),
  };

  try {
    await putReportMetadata(newReportMetadata);
  } catch {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }
  // Copy the original field data to a new location.
  try {
    await putReportFieldData(newReportMetadata, updatedFieldData);
  } catch {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_CREATION_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: newReportMetadata,
  };
});
