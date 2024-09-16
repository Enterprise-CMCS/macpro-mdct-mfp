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
import { error, reportNames } from "../../utils/constants/constants";
import {
  calculateDueDate,
  calculatePeriod,
  calculateCurrentYear,
} from "../../utils/time/time";
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
  StatusCodes,
  UserRoles,
} from "../../utils/types";

export const createReport = handler(
  async (event: APIGatewayProxyEvent, _context) => {
    const { allParamsValid, reportType, state } =
      parseStateReportParameters(event);
    if (!allParamsValid) throw new Error(error.NO_KEY);

    if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
      throw new Error(error.UNAUTHORIZED);
    }

    const reportTypeExpanded = reportNames[reportType];

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

    // If we received no work plan information and we're trying to create a SAR, throw NO_WORKPLANS_FOUND
    if (
      reportType === ReportType.SAR &&
      (!workPlanMetadata || !workPlanFieldData)
    ) {
      throw new Error(error.NO_WORKPLANS_FOUND);
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

    // If the report is a WP, determine reportYear from the unvalidated metadata. Otherwise, a SAR will use the workplan metadata.
    let reportData =
      reportType === ReportType.WP ? unvalidatedMetadata : workPlanMetadata;

    const reportYear = getReportYear(reportData, overrideCopyOver);
    const reportPeriod = getReportPeriod(reportData, overrideCopyOver);

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
      throw new Error(error.MISSING_DATA);
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
      throw new Error(error.INVALID_DATA);
    }
    // End Section - Check the payload that was sent with the request and validate it

    // Being Section - Check if metadata has filled parameter for copyReport
    let newFieldData;

    const updatedValidatedFieldData = {
      ...validatedFieldData,
      generalInformation_resubmissionInformation: "N/A",
    };

    if (unvalidatedMetadata.copyReport) {
      const reportPeriod = calculatePeriod(Date.now(), workPlanMetadata);
      const isCurrentPeriod =
        calculateCurrentYear() === unvalidatedMetadata.copyReport.reportYear &&
        reportPeriod === unvalidatedMetadata.copyReport.reportPeriod;

      //do not allow user to create a copy if it's the same period
      if (isCurrentPeriod && !overrideCopyOver) {
        throw new Error(error.UNABLE_TO_COPY);
      }

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
      // Return INVALID_DATA error if metadata fails validation
      throw new Error(error.INVALID_DATA);
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
        throw new Error(error.INVALID_DATA);
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
      throw new Error(error.S3_OBJECT_CREATION_ERROR);
    }

    // Begin Section - Create DynamoDB record
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
    };

    try {
      await putReportMetadata(createdReportMetadata);
    } catch {
      throw new Error(error.DYNAMO_CREATION_ERROR);
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
        throw new Error(error.DYNAMO_CREATION_ERROR);
      }
    }
    // End Section - Let the Workplan know that its been tied to a SAR that was just created

    // Return successful creation response!
    return {
      status: StatusCodes.CREATED,
      body: {
        ...createdReportMetadata,
        fieldData: validatedFieldData,
        formTemplate,
        formTemplateVersion: formTemplateVersion?.versionNumber,
      },
    };
  }
);
