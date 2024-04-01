import { fetchReport, fetchReportsByState } from "./fetch";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockDynamoData,
  mockDynamoDataWPCompleted,
  mockReportJson,
  mockReportFieldData,
} from "../../utils/testing/setupJest";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn(() => {}),
  isAuthorized: jest.fn().mockReturnValue(true),
  isAuthorizedToFetchState: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

const testReadEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: {
    reportType: "WP",
    state: "NJ",
    id: "mock-report-id",
  },
};

const testReadEventByState: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "NJ" },
};

describe("Test fetchReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockAuthUtil.isAuthorizedToFetchState.mockReturnValueOnce(true);
    dynamoClientMock.reset();
  });
  test("Test Report not found in DynamoDB", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Report Form not found in S3", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: { ...mockDynamoData, formTemplateId: "badId" },
    });
    const res = await fetchReport(testReadEvent, "null");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Field Data not found in S3", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: { ...mockDynamoData, fieldDataId: null },
    });
    const res = await fetchReport(testReadEvent, "badId");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Fetch w/ Incomplete Report", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoData,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.submissionName).toContain("testProgram");
    expect(body.completionStatus).toMatchObject(
      mockDynamoData.completionStatus
    );
    expect(body.isComplete).toStrictEqual(false);
    expect(body.fieldData).toStrictEqual(mockReportFieldData);
    expect(body.formTemplate).toStrictEqual(mockReportJson);
    expect(s3GetSpy).toHaveBeenCalledTimes(2);
  });

  test("Test Successful Report Fetch w/ Complete Report", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataWPCompleted,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.submissionName).toContain("testProgram");
    expect(body.completionStatus).toMatchObject({
      "step-one": true,
    });
    expect(body.isComplete).toStrictEqual(true);
    expect(body.fieldData).toStrictEqual(mockReportFieldData);
    expect(body.formTemplate).toStrictEqual(mockReportJson);
    expect(s3GetSpy).toHaveBeenCalledTimes(2);
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: {},
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});

describe("Test fetchReportsByState API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockAuthUtil.isAuthorizedToFetchState.mockReturnValueOnce(true);
    dynamoClientMock.reset();
  });
  test("Test successful call", async () => {
    const dynamoQuerySpy = jest.spyOn(dynamodbLib, "query");
    dynamoQuerySpy.mockResolvedValue([mockDynamoData]);
    const res = await fetchReportsByState(testReadEventByState, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body[0].lastAlteredBy).toContain("Thelonious States");
    expect(body[0].submissionName).toContain("testProgram");
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: {},
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: { state: "" },
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});

describe("Test failing state user permission control", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthUtil.isAuthorizedToFetchState.mockReturnValueOnce(false);
  });
  test("Test fetchReport request unauthorized when both permission checks fail", async () => {
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test fetchReportsByState request unauthorized when both permission checks fail", async () => {
    const res = await fetchReportsByState(testReadEventByState, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
