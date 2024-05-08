import { releaseReport } from "./release";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import KSUID from "ksuid";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoDataWPLocked,
  mockDynamoDataWPCompleted,
  mockReportFieldData,
  mockReportJson,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

mockClient(DynamoDBDocumentClient);

jest.mock("../../storage/reports", () => ({
  getReportMetadata: jest.fn(),
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "NJ", id: "mock-report-id" },
  body: JSON.stringify(mockDynamoDataWPCompleted),
};

const releaseEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
};

describe("Test releaseReport method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test release report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoDataWPLocked);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataWPLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataWPLocked.fieldDataId);
    expect(s3PutSpy).toHaveBeenCalled();
    expect(getReportFieldData).toHaveBeenCalled();
    expect(getReportFormTemplate).toHaveBeenCalled();
  });

  test("Test release report passes with valid data, but it has been more than the first submission", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    const newPreviousId = KSUID.randomSync().string;
    (getReportMetadata as jest.Mock).mockResolvedValue({
      ...mockDynamoDataWPLocked,
      previousRevisions: [newPreviousId],
      submissionCount: 1,
    });
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(1);
    expect(body.previousRevisions.length).toBe(2);
    expect(body.previousRevisions).toContain(
      mockDynamoDataWPLocked.fieldDataId
    );
    expect(body.previousRevisions).toContain(newPreviousId);
    expect(body.fieldDataId).not.toBe(mockDynamoDataWPLocked.fieldDataId);
  });

  test("Test release report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
