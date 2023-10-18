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
import { createReportName } from "../../utils/other/other";
// types
import {
  DynamoWrite,
  isReportType,
  isState,
  ReportMetadata,
  ReportMetadataShape,
  ReportStatus,
  ReportType,
  S3Put,
  StatusCodes,
  UserRoles,
} from "../../utils/types";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { logger } from "../../utils/logging";
import { fetchReport, fetchReportsByState } from "./fetch";
import { APIGatewayProxyEvent } from "aws-lambda";

export const createReport = handler(
  async (event: APIGatewayProxyEvent, _context) => {
    if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        body: error.UNAUTHORIZED,
      };
    }

    const requiredParams = ["reportType", "state"];

    // Return error if no state is passed.
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

    const unvalidatedPayload = JSON.parse(event.body!);
    const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
      unvalidatedPayload;

    if (!isReportType(reportType)) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.NO_KEY,
      };
    }

    const reportBucket = reportBuckets[reportType];
    const reportTable = reportTables[reportType];
    const reportTypeExpanded = reportNames[reportType];

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

    // Return MISSING_DATA error if missing unvalidated data or validators.
    if (!unvalidatedFieldData || !formTemplate.validationJson) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.MISSING_DATA,
      };
    }

    // Create report and field ids.
    const reportId: string = KSUID.randomSync().string;
    const fieldDataId: string = KSUID.randomSync().string;
    const formTemplateId: string = formTemplateVersion?.id;
    const creationValidationJson = {
      stateName: "text",
      ["targetPopulations"]: "objectArray",
      submissionCount: "number",
      versionControl: "objectArray",
    };

    // Validate field data
    let validatedFieldData = await validateFieldData(
      creationValidationJson,
      unvalidatedFieldData
    );

    let workPlanMetadata: ReportMetadata | undefined = undefined;

    // Get Associated Work Plan if creating a SAR Submission
    if (reportType === ReportType.SAR) {
      const sarSubmissions = await fetchReportsByState(event, _context);

      const workPlanEvent = event;
      workPlanEvent.pathParameters = {
        ...workPlanEvent.pathParameters,
        reportType: ReportType.WP,
      };
      const workPlanSubmissions = await fetchReportsByState(event, _context);
      if (!workPlanSubmissions.body) {
        return {
          status: StatusCodes.NOT_FOUND,
          body: error.NO_WORKPLANS_FOUND,
        };
      }
      // if current report exists, parse for archived status
      if (workPlanSubmissions.body) {
        const currentSarSubmissions = JSON.parse(sarSubmissions.body);
        const currentWorkPlans = JSON.parse(workPlanSubmissions.body);

        if (currentWorkPlans.length !== currentSarSubmissions?.length) {
          let lastFoundSubmission: ReportMetadataShape | undefined = undefined;
          currentWorkPlans.forEach((submission: ReportMetadataShape) => {
            if (
              submission.status === ReportStatus.NOT_STARTED ||
              submission.status === ReportStatus.IN_PROGRESS
            ) {
              if (
                lastFoundSubmission &&
                submission.createdAt > lastFoundSubmission?.createdAt
              )
                lastFoundSubmission = submission;
              else if (!lastFoundSubmission) {
                lastFoundSubmission = submission;
              }
            }
          });

          if (lastFoundSubmission) {
            const fetchWPReportEvent = event;
            fetchWPReportEvent.pathParameters = {
              reportType: ReportType.WP,
              state: state,
              id: lastFoundSubmission["id"],
            };
            const workPlan = await fetchReport(fetchWPReportEvent, _context);
            const workPlanParsed = JSON.parse(workPlan.body);
            workPlanMetadata = workPlanParsed;
            const workPlanFieldData = workPlanParsed?.fieldData;
            validatedFieldData = {
              ...validatedFieldData,
              workPlanData: workPlanFieldData,
            };
          }
        }
      }
    }

    // Return INVALID_DATA error if field data is not valid.
    if (!validatedFieldData || Object.keys(validatedFieldData).length === 0) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.INVALID_DATA,
      };
    }

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
        reportPeriod: reportPeriod,
        dueDate: calculateDueDate(
          reportYear,
          reportPeriod.toString(),
          reportType
        ),
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
