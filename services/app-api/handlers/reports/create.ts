import KSUID from "ksuid";
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
  convertDateUtcToEt,
} from "../../utils/time/time";
import {
  createReportName,
  getLastCreatedWorkPlan,
} from "../../utils/other/other";
// types
import {
  AnyObject,
  DynamoWrite,
  isReportType,
  isState,
  ReportMetadataShape,
  ReportType,
  S3Put,
  StatusCodes,
  UserRoles,
} from "../../utils/types";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { logger } from "../../utils/logging";
import { APIGatewayProxyEvent } from "aws-lambda";
import { copyFieldDataFromSource } from "../../utils/other/copy";

export const createReport = handler(
  async (event: APIGatewayProxyEvent, _context) => {
    if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        body: error.UNAUTHORIZED,
      };
    }

    const requiredParams = ["reportType", "state"];

    // Return No_Key when not given a state and reportType as a paramater
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

    // Begin Section - Getting/Creating newest Form Template based on reportType
    let formTemplate, formTemplateVersion;
    try {
      ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
        reportBucket,
        reportType
      ));
    } catch (err) {
      logger.error(err, "Error getting or creating template");
      throw err;
    }
    // End Section - Getting/Creating newest Form Template based on reportType

    // Begin Section - Check the payload that was sent with the request and validate it
    const unvalidatedPayload = JSON.parse(event.body!);
    const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
      unvalidatedPayload;

    // Return MISSING_DATA error if missing unvalidated data or validators.
    if (!unvalidatedFieldData || !formTemplate.validationJson) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.MISSING_DATA,
      };
    }

    const creationValidationJson = {
      reportPeriod: "text",
      stateName: "text",
      stateOrTerritory: "text",
      submissionCount: "number",
      submissionName: "text",
      targetPopulations: "objectArray",
    };

    // Setup validation for what we expect to see in the payload
    let validatedFieldData = await validateFieldData(
      creationValidationJson,
      unvalidatedFieldData
    );

    // Return INVALID_DATA error if field data is not valid.
    if (!validatedFieldData || Object.keys(validatedFieldData).length === 0) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.INVALID_DATA,
      };
    }
    // End Section - Check the payload that was sent with the request and validate it

    // Being Section - Check if metadata has filled parameter for copyFieldDataSourceId
    let newFieldData;

    if (unvalidatedMetadata.copyFieldDataSourceId) {
      newFieldData = await copyFieldDataFromSource(
        reportBucket,
        state,
        unvalidatedMetadata.copyFieldDataSourceId,
        formTemplate,
        validatedFieldData
      );
    } else {
      newFieldData = validatedFieldData;
    }
    // End Section - Check if metadata has filled parameter for copyFieldDataSourceId

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

    // If we are creating a SAR and found a Work Plan to copy from, grab its field data and add it to our SAR
    if (workPlanFieldData) {
      validatedFieldData = {
        ...validatedFieldData,
        workPlanData: workPlanFieldData,
      };
    }

    /*
     * End Section - If creating a SAR Submission, find the last Work Plan created that hasn't been used
     * to create a different SAR and attach all of its fieldData to the SAR Submissions FieldData
     */

    // Begin Section - Create report and field ids and submit the validated field data to S3
    const reportId: string = KSUID.randomSync().string;
    const fieldDataId: string = KSUID.randomSync().string;
    const formTemplateId: string = formTemplateVersion?.id;

    const fieldDataParams: S3Put = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
      Body: JSON.stringify(validatedFieldData),
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

    // Begin Section - Create DyanmoDB record.
    const currentDate = Date.now();
    const reportYear =
      reportType === ReportType.WP
        ? new Date(convertDateUtcToEt(currentDate)).getFullYear()
        : workPlanMetadata!.reportYear;

    const reportPeriod = calculatePeriod(currentDate, workPlanMetadata);

    // Create DyanmoDB record.
    const reportMetadataParams: DynamoWrite = {
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
          currentDate,
          state,
          reportYear,
          workPlanMetadata
        ),
        reportYear,
        reportPeriod,
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
      const workPlanWithSarFormConnection: DynamoWrite = {
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
