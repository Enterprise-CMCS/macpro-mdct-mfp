import { APIGatewayProxyEvent, isReportType, isState } from "../types";
import { logger } from "../debugging/debug-lib";

export const parseSpecificReportParameters = (event: APIGatewayProxyEvent) => {
  const { reportType, state, id } = event.pathParameters ?? {};
  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return { allParamsValid: false as const };
  }
  if (!isState(state)) {
    logger.warn("Invalid state in path");
    return { allParamsValid: false as const };
  }
  if (!id) {
    logger.warn("Invalid report ID in path");
    return { allParamsValid: false as const };
  }
  return { allParamsValid: true as const, reportType, state, id };
};

export const parseStateReportParameters = (event: APIGatewayProxyEvent) => {
  const { reportType, state } = event.pathParameters ?? {};
  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return { allParamsValid: false as const };
  }
  if (!isState(state)) {
    logger.warn("Invalid state in path");
    return { allParamsValid: false as const };
  }
  return { allParamsValid: true as const, reportType, state };
};
