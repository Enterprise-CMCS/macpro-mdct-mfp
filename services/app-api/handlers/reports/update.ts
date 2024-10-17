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
import { UserRoles } from "../../utils/types";
import { removeNotApplicablePopsFromInitiatives } from "../../utils/data/data";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";

export const updateReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return badRequest(error.MISSING_DATA);
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

  // This parse is guaranteed to succeed, because handler-lib already did it.
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
    return badRequest(error.INVALID_DATA);
  }

  // Ensure user has correct permissions to update a report.
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const currentReport = await getReportMetadata(reportType, state, id);
  if (!currentReport) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  if (currentReport.archived || currentReport.locked) {
    return forbidden(error.UNAUTHORIZED);
  }

  const formTemplate = await getReportFormTemplate(currentReport);
  if (!formTemplate) {
    return notFound(error.MISSING_DATA);
  }

  const existingFieldData = await getReportFieldData(currentReport);
  if (!existingFieldData) {
    return notFound(error.MISSING_DATA);
  }

  // Parse the passed payload.
  const unvalidatedPayload = JSON.parse(event.body);

  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!unvalidatedFieldData) {
    return badRequest(error.MISSING_DATA);
  }

  // Validation JSON should be there—if it's not, there's an issue.
  if (!formTemplate.validationJson) {
    return internalServerError(error.MISSING_FORM_TEMPLATE);
  }

  // Validate passed field data
  let validatedFieldData;
  try {
    validatedFieldData = await validateFieldData(
      formTemplate.validationJson,
      unvalidatedFieldData
    );
  } catch {
    return badRequest(error.INVALID_DATA);
  }

  // Finalize fieldData to be sent to s3
  const fieldData = {
    ...existingFieldData,
    ...validatedFieldData,
  };

  const cleanedFieldData = removeNotApplicablePopsFromInitiatives(fieldData);
  try {
    await putReportFieldData(currentReport, cleanedFieldData);
  } catch {
    return internalServerError(error.S3_OBJECT_UPDATE_ERROR);
  }

  const completionStatus = await calculateCompletionStatus(
    fieldData,
    formTemplate
  );

  // validate report metadata
  let validatedMetadata;
  try {
    validatedMetadata = await validateData(metadataValidationSchema, {
      ...unvalidatedMetadata,
      completionStatus,
    });
  } catch {
    // If metadata fails validation, return 400
    return badRequest(error.INVALID_DATA);
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
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return ok({
    ...updatedMetadata,
    fieldData,
    formTemplate,
  });
});
