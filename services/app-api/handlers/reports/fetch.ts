import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
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
import { AnyObject, StatusCodes } from "../../utils/types";

export const fetchReport = handler(async (event, _context) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  if (!isAuthorizedToFetchState(event, state)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const reportTable = reportTables[reportType];
  const reportBucket = reportBuckets[reportType];

  // Get current report metadata
  const reportMetadataParams = {
    TableName: reportTable,
    Key: { state, id },
  };

  try {
    const response = await dynamoDb.get(reportMetadataParams);
    if (!response?.Item) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NOT_IN_DATABASE,
      };
    }

    const reportMetadata = response.Item as Record<string, any>;
    const { formTemplateId, fieldDataId } = reportMetadata;

    // Get form template from S3
    const formTemplateParams = {
      Bucket: reportBucket,
      Key: getFormTemplateKey(formTemplateId),
    };

    const formTemplate = (await s3Lib.get(formTemplateParams)) as AnyObject; // TODO: strict typing
    if (!formTemplate) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.MISSING_FORM_TEMPLATE,
      };
    }

    // Get field data from S3
    const fieldDataParams = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
    };

    const fieldData = (await s3Lib.get(fieldDataParams)) as AnyObject; // TODO: strict typing

    if (!fieldData) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NO_MATCHING_RECORD,
      };
    }

    if (!reportMetadata.completionStatus) {
      reportMetadata.completionStatus = await calculateCompletionStatus(
        fieldData,
        formTemplate
      );
      reportMetadata.isComplete = isComplete(reportMetadata.completionStatus);
    }

    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...reportMetadata,
        formTemplate,
        fieldData,
      },
    };
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});

export const fetchReportsByState = handler(async (event, _context) => {
  const { allParamsValid, reportType, state } =
    parseStateReportParameters(event);
  if (!allParamsValid) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  if (!isAuthorizedToFetchState(event, state!)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const reportTable = reportTables[reportType];

  const queryParams: QueryCommandInput = {
    TableName: reportTable,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": state!,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };

  const reportsByState = await dynamoDb.query(queryParams);

  return {
    status: StatusCodes.SUCCESS,
    body: reportsByState,
  };
});
