import handler from "../handler-lib";
import KSUID from "ksuid";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
// types
import { GetCommandInput, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import {
  FormJson,
  WPReportMetadata,
  StatusCodes,
  UserRoles,
} from "../../utils/types";
import { calculateCompletionStatus } from "../../utils/validation/completionStatus";

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

  const reportTable = reportTables[reportType];
  // Get report metadata

  const reportMetadataParams: GetCommandInput = {
    Key: { id, state },
    TableName: reportTable,
  };

  let reportMetadata;

  try {
    reportMetadata = await dynamoDb.get(reportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  if (!reportMetadata.Item) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const metadata = reportMetadata.Item as WPReportMetadata;

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

  const reportBucket = reportBuckets[reportType];

  const getFieldDataParameters: GetObjectCommandInput = {
    Bucket: reportBucket,
    Key: getFieldDataKey(metadata.state, metadata.fieldDataId),
  };

  const getFormTemplateParameters: GetObjectCommandInput = {
    Bucket: reportBucket,
    Key: getFormTemplateKey(metadata.formTemplateId),
  };

  let fieldData: Record<string, any>;
  let formTemplate: FormJson;
  try {
    fieldData = (await s3Lib.get(getFieldDataParameters)) as Record<
      string,
      any
    >;
    formTemplate = (await s3Lib.get(getFormTemplateParameters)) as FormJson;
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  const updatedFieldData = {
    ...fieldData,
    generalInformation_resubmissionInformation: "",
  };

  const newReportMetadata: WPReportMetadata = {
    ...metadata,
    fieldDataId: newFieldDataId,
    locked: false,
    previousRevisions,
    status: "In revision",
    completionStatus: await calculateCompletionStatus(
      updatedFieldData,
      formTemplate
    ),
  };

  const putReportMetadataParams: PutCommandInput = {
    TableName: reportTable,
    Item: newReportMetadata,
  };

  try {
    await dynamoDb.put(putReportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  // Copy the original field data to a new location.
  try {
    const putObjectParameters: PutObjectCommandInput = {
      Bucket: reportBucket,
      Body: JSON.stringify({
        ...updatedFieldData,
      }),
      ContentType: "application/json",
      Key: getFieldDataKey(metadata.state, newFieldDataId),
    };

    await s3Lib.put(putObjectParameters);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_CREATION_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: putReportMetadataParams.Item,
  };
});
