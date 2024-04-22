import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import {
  error,
  reportTables,
  reportBuckets,
} from "../../utils/constants/constants";
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";
// types
import { ReportJson, StatusCodes, UserRoles } from "../../utils/types";
import { removeNotApplicablePopsFromInitiatives } from "../../utils/data/data";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";

export const updateReport = handler(async (event, context) => {
  const { allParamsValid, reportType, state } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  // Blocklisted keys
  const metadataBlocklist = [
    "submittedBy",
    "submittedOnDate",
    "locked",
    "archive",
  ];
  const fieldDataBlocklist = [
    "submitterName",
    "submitterEmailAddress",
    "reportSubmissionDate",
  ];

  try {
    const eventBody = JSON.parse(event.body);
    if (
      (eventBody.metadata &&
        Object.keys(eventBody.metadata).some((_) =>
          metadataBlocklist.includes(_)
        )) ||
      (eventBody.fieldData &&
        Object.keys(eventBody.fieldData).some((_) =>
          fieldDataBlocklist.includes(_)
        ))
    ) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.INVALID_DATA,
      };
    }
  } catch (err) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
  }

  // Ensure user has correct permissions to update a report.
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  // Get current report
  const reportEvent = { ...event, body: "" };
  const fetchReportRequest = await fetchReport(reportEvent, context);

  if (!fetchReportRequest?.body || fetchReportRequest.statusCode !== 200) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  // If current report exists, get formTemplateId and fieldDataId
  const currentReport = JSON.parse(fetchReportRequest.body);

  if (currentReport.archived || currentReport.locked) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const { formTemplateId, fieldDataId } = currentReport;

  const reportBucket = reportBuckets[reportType];
  const reportTable = reportTables[reportType];

  if (!formTemplateId || !fieldDataId) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  const formTemplateParams = {
    Bucket: reportBucket,
    Key: getFormTemplateKey(formTemplateId),
  };
  const formTemplate = (await s3Lib.get(formTemplateParams)) as ReportJson;

  // Get existing fieldData from s3 bucket (for patching with passed data)
  const fieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
  };
  const existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
    string,
    any
  >;

  // Parse the passed payload.
  const unvalidatedPayload = JSON.parse(event.body);

  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!unvalidatedFieldData) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  // Validation JSON should be there—if it's not, there's an issue.
  if (!formTemplate.validationJson) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_FORM_TEMPLATE,
    };
  }

  // Validate passed field data
  const validatedFieldData = await validateFieldData(
    formTemplate.validationJson,
    unvalidatedFieldData
  );

  if (!validatedFieldData) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.INVALID_DATA,
    };
  }

  // Finalize fieldData to be sent to s3
  const fieldData = {
    ...existingFieldData,
    ...validatedFieldData,
  };

  const cleanedFieldData = removeNotApplicablePopsFromInitiatives(fieldData);

  // Post validated field data to s3 bucket
  const updateFieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
    Body: JSON.stringify(cleanedFieldData),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(updateFieldDataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_UPDATE_ERROR,
    };
  }

  const completionStatus = await calculateCompletionStatus(
    fieldData,
    formTemplate
  );

  // validate report metadata
  const validatedMetadata = await validateData(metadataValidationSchema, {
    ...unvalidatedMetadata,
    completionStatus,
  });

  // If metadata fails validation, return 400
  if (!validatedMetadata) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
  }

  /*
   * Data has passed validation
   * Delete raw data prior to updating
   */
  delete currentReport.fieldData;
  delete currentReport.formTemplate;

  // Update record in report metadata table
  const reportMetadataParams = {
    TableName: reportTable,
    Item: {
      ...currentReport,
      ...validatedMetadata,
      isComplete: isComplete(completionStatus),
      lastAltered: Date.now(),
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
    body: {
      ...reportMetadataParams.Item,
      fieldData,
      formTemplate,
    },
  };
});
