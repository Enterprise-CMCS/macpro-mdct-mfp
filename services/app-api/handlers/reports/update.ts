import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { error } from "../../utils/constants/constants";
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";
// types
import { StatusCodes, UserRoles } from "../../utils/types";
import { removeNotApplicablePopsFromInitiatives } from "../../utils/data/data";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";

export const updateReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
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

  const currentReport = await getReportMetadata(reportType, state, id);
  if (!currentReport) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  if (currentReport.archived || currentReport.locked) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const formTemplate = await getReportFormTemplate(currentReport);
  if (!formTemplate) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  const existingFieldData = await getReportFieldData(currentReport);
  if (!existingFieldData) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

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
  try {
    await putReportFieldData(currentReport, cleanedFieldData);
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

  // Update record in report metadata table
  const updatedMetadata = {
    ...currentReport,
    ...validatedMetadata,
    isComplete: isComplete(completionStatus),
    lastAltered: Date.now(),
  };

  try {
    await putReportMetadata(updatedMetadata);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: {
      ...updatedMetadata,
      fieldData,
      formTemplate,
    },
  };
});
