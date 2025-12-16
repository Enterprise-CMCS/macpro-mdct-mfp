import KSUID from "ksuid";
import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { parseStateReportParameters } from "../../utils/auth/parameters";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { error } from "../../utils/constants/constants";
import { calculateDueDate } from "../../utils/time/time";
import {
  createReportName,
  getEligibleWorkPlan,
  getReportPeriod,
  getReportYear,
} from "../../utils/other/other";
import {
  putReportFieldData,
  putReportMetadata,
  queryReportMetadatasForState,
} from "../../storage/reports";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { logger } from "../../utils/debugging/debug-lib";
import { copyFieldDataFromSource } from "../../utils/other/copy";
import { extractWorkPlanData } from "../../utils/transformations/transformations";
import assert from "node:assert";
// types
import {
  AnyObject,
  APIGatewayProxyEvent,
  ReportMetadataShape,
  ReportType,
  UserRoles,
} from "../../utils/types";
import {
  badRequest,
  created,
  forbidden,
  internalServerError,
  notFound,
} from "../../utils/responses/response-lib";

export const createReport = handler(
  async (event: APIGatewayProxyEvent, _context) => {
    const { allParamsValid, reportType, state } =
      parseStateReportParameters(event);
    if (!allParamsValid) {
      return badRequest(error.NO_KEY);
    }

    if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
      return forbidden(error.UNAUTHORIZED);
    }

    /*
     * Begin Section - If creating a SAR Submission, find the oldest Work Plan created that hasn't been used
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
        ? await getEligibleWorkPlan(state)
        : { workPlanMetadata: undefined, workPlanFieldData: undefined };

    // If we received no work plan information and we're trying to create a SAR, return NO_WORKPLANS_FOUND
    if (
      reportType === ReportType.SAR &&
      (!workPlanMetadata || !workPlanFieldData)
    ) {
      return notFound(error.NO_WORKPLANS_FOUND);
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

    const isCopyOver = unvalidatedMetadata?.copyReport;

    /**
     * If the report is a WP, determine reportYear from the unvalidated metadata. Otherwise, a SAR will use the workplan metadata.
     */
    let reportData =
      reportType === ReportType.WP || reportType === ReportType.EXPENDITURE
        ? unvalidatedMetadata
        : workPlanMetadata;
    const reportYear = getReportYear(reportData, isCopyOver);
    const reportPeriod = getReportPeriod(reportData, isCopyOver);

    // Begin Section - Getting/Creating newest Form Template based on reportType
    let formTemplate, formTemplateVersion;
    try {
      ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
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
      return badRequest(error.MISSING_DATA);
    }

    // Setup validation for what we expect to see in the payload
    let validatedFieldData;
    try {
      validatedFieldData = await validateFieldData(
        creationFieldDataValidationJson,
        unvalidatedFieldData
      );
    } catch {
      return badRequest(error.INVALID_DATA);
    }

    // If we are creating a SAR and found a Work Plan to copy from, grab its field data and add it to our SAR
    if (workPlanFieldData) {
      validatedFieldData = {
        ...validatedFieldData,
        ...workPlanFieldData,
      };

      extractWorkPlanData(validatedFieldData!, reportYear, reportPeriod);
    }

    // Return INVALID_DATA error field data has no valid entries
    if (validatedFieldData && Object.keys(validatedFieldData).length === 0) {
      return badRequest(error.INVALID_DATA);
    }
    // End Section - Check the payload that was sent with the request and validate it

    // Being Section - Check if metadata has filled parameter for copyReport
    let newFieldData;

    const updatedValidatedFieldData = {
      ...validatedFieldData,
      generalInformation_resubmissionInformation: "N/A",
    };

    if (isCopyOver) {
      newFieldData = await copyFieldDataFromSource(
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

    // Validate the metadata for the submission
    let validatedMetadata;
    try {
      validatedMetadata = await validateData(metadataValidationSchema, {
        ...unvalidatedMetadata,
      });
    } catch {
      // Return INVALID_DATA error if metadata is not valid.
      return badRequest(error.INVALID_DATA);
    }

    const existingReports: ReportMetadataShape[] =
      await queryReportMetadatasForState(reportType, state);

    for (const report of existingReports) {
      const {
        reportYear: existingReportYear,
        reportPeriod: existingReportPeriod,
        archived,
      } = report;
      if (
        !archived &&
        existingReportYear === reportYear &&
        existingReportPeriod === reportPeriod
      ) {
        return badRequest(error.INVALID_DATA);
      }
    }
    const reportId: string = KSUID.randomSync().string;
    const fieldDataId: string = KSUID.randomSync().string;
    const formTemplateId: string = formTemplateVersion?.id;

    try {
      await putReportFieldData(
        { reportType, state, fieldDataId },
        newFieldData
      );
    } catch {
      return internalServerError(error.S3_OBJECT_CREATION_ERROR);
    }

    // Begin Section - Create DyanmoDB record
    const createdReportMetadata: ReportMetadataShape = {
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
        reportType,
        reportPeriod,
        state,
        reportYear,
        workPlanMetadata
      ),
      reportYear,
      reportPeriod,
      isCopied: isCopyOver ? true : false,
      dueDate: calculateDueDate(reportYear, reportPeriod, reportType),
      associatedWorkPlan: workPlanMetadata?.id,
    };

    try {
      await putReportMetadata(createdReportMetadata);
    } catch {
      return internalServerError(error.DYNAMO_CREATION_ERROR);
    }
    // End Section - Create DynamoDB record.

    // Begin Section - Let the Workplan know that its been tied to a SAR that was just created
    if (reportType === ReportType.SAR) {
      assert(workPlanMetadata !== undefined);
      const workPlanWithSarConnection = {
        ...workPlanMetadata,
        associatedSar: reportId,
      };
      try {
        await putReportMetadata(workPlanWithSarConnection);
      } catch {
        return internalServerError(error.DYNAMO_CREATION_ERROR);
      }
    }
    // End Section - Let the Workplan know that its been tied to a SAR that was just created

    // Return successful creation response!
    return created({
      ...createdReportMetadata,
      fieldData: validatedFieldData,
      formTemplate,
      formTemplateVersion: formTemplateVersion?.versionNumber,
    });
  }
);
