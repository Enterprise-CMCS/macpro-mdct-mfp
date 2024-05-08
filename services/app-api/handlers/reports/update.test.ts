import { updateReport } from "./update";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoData,
  mockWPReport,
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

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  getReportMetadata: jest.fn(),
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));
const mockAuthUtil = require("../../utils/auth/authorization");

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "CO", id: "testReportId" },
  body: JSON.stringify(mockWPReport),
};

const updateEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    metadata: {
      status: "in progress",
    },
    fieldData: { ...mockReportFieldData, "mock-text-field": "text" },
  }),
};

const submissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockWPReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, "mock-number-field": 2 },
  }),
};

const invalidFieldDataSubmissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockWPReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, "mock-number-field": "text" },
  }),
};

const updateEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: `{"submissionName":{}}`,
};

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    mockAuthUtil.hasPermissions.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
    dynamoClientMock.reset();
  });

  test("Test report update submission succeeds", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const mockPut = jest.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);

    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body);

    expect(body.status).toContain("submitted");
    expect(body.fieldData["mock-number-field"]).toBe("2");
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
    expect(mockPut).toHaveBeenCalled();
  });

  test("Test report update with invalid fieldData fails", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const mockPut = jest.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);

    const response = await updateReport(invalidFieldDataSubmissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(response.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with no existing record throws 404", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test attempted report update to an archived report throws 403 error", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue({
      ...mockDynamoData,
      archived: true,
    });

    const res = await updateReport(updateEvent, null);

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});
