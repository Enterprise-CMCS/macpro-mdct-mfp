import KSUID from "ksuid";
import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib, { getFieldDataKey } from "../../utils/s3/s3-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import {
  error,
  reportTables,
  reportBuckets,
  reportNames,
} from "../../utils/constants/constants";
import {
  calculateDueDate,
  calculatePeriod,
  calculateCurrentYear,
} from "../../utils/time/time";
import {
  createReportName,
  getLastCreatedWorkPlan,
  getReportPeriod,
  getReportYear,
} from "../../utils/other/other";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { logger } from "../../utils/debugging/debug-lib";
import { copyFieldDataFromSource } from "../../utils/other/copy";
import { extractWorkPlanData } from "../../utils/transformations/transformations";
// types
import {
  AnyObject,
  APIGatewayProxyEvent,
  isReportType,
  isState,
  ReportMetadataShape,
  ReportType,
  StatusCodes,
  UserRoles,
} from "../../utils/types";

export const createReport = handler(
  async (event: APIGatewayProxyEvent, _context) => {
    const requiredParams = ["reportType", "state"];

    // Return No_Key when not given a state and reportType as a parameter
    if (
      !event.pathParameters ||
      !hasReportPathParams(event.pathParameters, requiredParams)
    ) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.NO_KEY,
      };
    }

    const { state, reportType } = event.pathParameters;

    if (!isState(state)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.NO_KEY,
      };
    }
    if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        body: error.UNAUTHORIZED,
      };
    }

    if (!isReportType(reportType)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.NO_KEY,
      };
    }

    // Find S3 Bucket, DynamoTable, and full string naming scheme for reportType
    const reportBucket = reportBuckets[reportType];
    const reportTable = reportTables[reportType];
    const reportTypeExpanded = reportNames[reportType];

    /*
     * Begin Section - If creating a SAR Submission, find the last Work Plan created that hasn't been used
     * to create a different SAR and attach all of its fieldData to the SAR Submissions FieldData
     */
    const {
      workPlanMetadata,
      workPlanFieldData,
    }: {
      workPlanMetadata?: ReportMetadataShape;
      workPlanFieldData?: AnyObject;
    } =
      reportType === ReportType.SAR
        ? await getLastCreatedWorkPlan(event, _context, state)
        : { workPlanMetadata: undefined, workPlanFieldData: undefined };

    // If we recieved no work plan information and we're trying to create a SAR, return NO_WORKPLANS_FOUND
    if (
      !workPlanFieldData &&
      !workPlanMetadata &&
      reportType === ReportType.SAR
    ) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NO_WORKPLANS_FOUND,
      };
    }

    // Check the payload that was sent with the request and setup validation
    const unvalidatedPayload = JSON.parse(event.body!);
    const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
      unvalidatedPayload;

    const creationFieldDataValidationJson = {
      stateName: "text",
      stateOrTerritory: "text",
      submissionCount: "number",
      submissionName: "text",
      targetPopulations: "objectArray",
    };

    const currentDate = Date.now();

    const overrideCopyOver =
      unvalidatedMetadata?.copyReport &&
      unvalidatedMetadata?.copyReport?.isCopyOverTest;

    /**
     * If the report is a WP, determine reportYear from the unvalidated metadata. Otherwise, a SAR will use the workplan metadata.
     */
    let reportData =
      reportType === ReportType.WP ? unvalidatedMetadata : workPlanMetadata;

    const reportYear = getReportYear(reportData, overrideCopyOver);
    const reportPeriod = getReportPeriod(reportData, overrideCopyOver);

    // If this Work Plan is a reset, the reporting period is the upcoming one
    const isReset = unvalidatedMetadata?.isReset;

    // Begin Section - Getting/Creating newest Form Template based on reportType
    let formTemplate, formTemplateVersion;
    try {
      ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
        reportBucket,
        reportType,
        reportPeriod,
        reportYear,
        workPlanFieldData
      ));
    } catch (err) {
      logger.error(err, "Error getting or creating template");
      throw err;
    }
    // End Section - Getting/Creating newest Form Template based on reportType

    // Return MISSING_DATA error if missing unvalidated data or validators.
    if (!unvalidatedFieldData || !formTemplate.validationJson) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.MISSING_DATA,
      };
    }

    // Setup validation for what we expect to see in the payload
    let validatedFieldData = await validateFieldData(
      creationFieldDataValidationJson,
      unvalidatedFieldData
    );

    // If we are creating a SAR and found a Work Plan to copy from, grab its field data and add it to our SAR
    if (workPlanFieldData) {
      validatedFieldData = {
        ...validatedFieldData,
        ...workPlanFieldData,
      };

      extractWorkPlanData(validatedFieldData!, reportYear, reportPeriod);
    }

    // Return INVALID_DATA error if field data is not valid.
    if (!validatedFieldData || Object.keys(validatedFieldData).length === 0) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.INVALID_DATA,
      };
    }
    // End Section - Check the payload that was sent with the request and validate it

    // Being Section - Check if metadata has filled parameter for copyReport
    let newFieldData;

    const updatedValidatedFieldData = {
      ...validatedFieldData,
      generalInformation_resubmissionInformation: "N/A",
    };

    if (unvalidatedMetadata.copyReport && !isReset) {
      const reportPeriod = calculatePeriod(Date.now(), workPlanMetadata);
      const isCurrentPeriod =
        calculateCurrentYear() === unvalidatedMetadata.copyReport.reportYear &&
        reportPeriod === unvalidatedMetadata.copyReport.reportPeriod;

      //do not allow user to create a copy if it's the same period
      if (isCurrentPeriod && !overrideCopyOver) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          body: error.UNABLE_TO_COPY,
        };
      }

      newFieldData = await copyFieldDataFromSource(
        reportBucket,
        state,
        unvalidatedMetadata.copyReport?.fieldDataId,
        formTemplate,
        updatedValidatedFieldData
      );
    } else {
      newFieldData = updatedValidatedFieldData;
    }

    // End Section - Check if metadata has filled parameter for copyReport
    /*
     * End Section - If creating a SAR Submission, find the last Work Plan created that hasn't been used
     * to create a different SAR and attach all of its fieldData to the SAR Submissions FieldData
     */

    // Begin Section - Create report and field ids and submit the validated field data to S3
    const reportId: string = KSUID.randomSync().string;
    const fieldDataId: string = KSUID.randomSync().string;
    const formTemplateId: string = formTemplateVersion?.id;

    const fieldDataParams = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
      Body: JSON.stringify(newFieldData),
      ContentType: "application/json",
    };

    try {
      await s3Lib.put(fieldDataParams);
    } catch (err) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.S3_OBJECT_CREATION_ERROR,
      };
    }
    // End Section - Create report and field ids and submit the validated field data to S3

    // Validation the metadata for the submission
    const validatedMetadata = await validateData(metadataValidationSchema, {
      ...unvalidatedMetadata,
    });

    // Return INVALID_DATA error if metadata is not valid.
    if (!validatedMetadata) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.INVALID_DATA,
      };
    }

    // Begin Section - Create DyanmoDB record
    const reportMetadataParams: PutCommandInput = {
      TableName: reportTable,
      Item: {
        ...validatedMetadata,
        state,
        id: reportId,
        fieldDataId,
        status: "Not started",
        formTemplateId,
        createdAt: currentDate,
        lastAltered: currentDate,
        versionNumber: formTemplateVersion?.versionNumber,
        submissionName: createReportName(
          reportTypeExpanded,
          reportPeriod,
          state,
          reportYear,
          workPlanMetadata
        ),
        reportYear,
        reportPeriod,
        isCopied: overrideCopyOver ? true : false,
        dueDate: calculateDueDate(reportYear, reportPeriod, reportType),
        associatedWorkPlan: workPlanMetadata?.id,
      },
    };

    try {
      await dynamoDb.put(reportMetadataParams);
    } catch (err) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.DYNAMO_CREATION_ERROR,
      };
    }
    // End Section - Create DynamoDB record.

    // Begin Section - Let the Workplan know that its been tied to a SAR that was just created
    if (reportType === ReportType.SAR) {
      const workPlanWithSarFormConnection = {
        TableName: reportTables[ReportType.WP],
        Item: {
          ...workPlanMetadata,
          associatedSar: reportId,
        },
      };
      try {
        await dynamoDb.put(workPlanWithSarFormConnection);
      } catch (err) {
        return {
          status: StatusCodes.SERVER_ERROR,
          body: error.DYNAMO_CREATION_ERROR,
        };
      }
    }
    // End Section - Let the Workplan know that its been tied to a SAR that was just created

    // Return successful creation response!
    return {
      status: StatusCodes.CREATED,
      body: {
        ...reportMetadataParams.Item,
        fieldData: validatedFieldData,
        formTemplate,
        formTemplateVersion: formTemplateVersion?.versionNumber,
      },
    };
  }
);
