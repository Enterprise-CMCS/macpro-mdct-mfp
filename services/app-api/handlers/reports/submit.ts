import { bool } from "aws-sdk/clients/signer";
import jwtDecode from "jwt-decode";
import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import { parseSpecificReportParameters } from "../../utils/auth/parameters";
import { error } from "../../utils/constants/constants";
import { convertDateUtcToEt } from "../../utils/time/time";
// types
import { ReportStatus, StatusCodes, UserRoles } from "../../utils/types";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";

export const submitReport = handler(async (event, _context) => {
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
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

  try {
    const reportMetadata = await getReportMetadata(reportType, state, id);
    if (!reportMetadata) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NOT_IN_DATABASE,
      };
    }

    const { status, isComplete } = reportMetadata;

    if (status === "Submitted") {
      return {
        status: StatusCodes.SUCCESS,
        body: {
          ...reportMetadata,
        },
      };
    }

    if (!isComplete) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.REPORT_INCOMPLETE,
      };
    }

    const jwt = jwtDecode(event.headers["x-api-key"]!) as Record<
      string,
      string | bool
    >;

    const date = Date.now();
    const fullName = `${jwt.given_name} ${jwt.family_name}`;
    const submissionCount = reportMetadata.submissionCount
      ? reportMetadata.submissionCount + 1
      : 1;
    const submittedReportMetadata = {
      ...reportMetadata,
      submittedBy: fullName,
      submittedOnDate: date,
      status: ReportStatus.SUBMITTED,
      locked: true,
      submissionCount: submissionCount,
    };

    try {
      await putReportMetadata(submittedReportMetadata);
    } catch {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.DYNAMO_UPDATE_ERROR,
      };
    }

    const existingFieldData = await getReportFieldData(reportMetadata);
    if (!existingFieldData) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.NOT_IN_DATABASE,
      };
    }

    const fieldData = {
      ...existingFieldData,
      submitterName: fullName,
      submitterEmailAddress: jwt.email,
      reportSubmissionDate: convertDateUtcToEt(date),
    };

    const formTemplate = await getReportFormTemplate(reportMetadata);
    if (!formTemplate) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.NOT_IN_DATABASE,
      };
    }

    try {
      await putReportFieldData(reportMetadata, fieldData);
    } catch {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.S3_OBJECT_UPDATE_ERROR,
      };
    }

    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...submittedReportMetadata,
        fieldData: { ...fieldData },
        formTemplate: {
          ...formTemplate,
        },
      },
    };
  } catch {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});
