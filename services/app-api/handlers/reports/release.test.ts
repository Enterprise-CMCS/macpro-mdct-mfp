import { APIGatewayProxyEvent } from "aws-lambda";
import { releaseReport } from "./release";
import KSUID from "ksuid";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDocumentClient,
  mockDynamoDataWPLocked,
  mockDynamoDataWPCompleted,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test release report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataWPLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataWPLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataWPLocked.fieldDataId);
  });

  test("Test release report passes with valid data, but it's been more than the first submission", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    const newPreviousId = KSUID.randomSync().string;
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: {
        ...mockDynamoDataWPLocked,
        previousRevisions: [newPreviousId],
        submissionCount: 1,
      },
    });
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
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataWPLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
