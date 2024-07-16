import { submitReport } from "./submit";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockApiKey,
  mockDynamoData,
  mockDynamoDataWPCompleted,
  mockReportFieldData,
  mockReportJson,
} from "../../utils/testing/setupJest";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

mockClient(DynamoDBDocumentClient);

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  getReportMetadata: jest.fn(),
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

const testSubmitEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test", "x-api-key": mockApiKey },
  pathParameters: {
    reportType: "WP",
    state: "NJ",
    id: "mock-report-id",
  },
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  warn: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  warn: jest.fn() as jest.SpyInstance,
};

describe("Test submitReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.warn = jest.spyOn(console, "warn").mockImplementation();
  });

  test("Test Report not found in DynamoDB", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await submitReport(testSubmitEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Submittal", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(
      mockDynamoDataWPCompleted
    );
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);

    const res = await submitReport(testSubmitEvent, null);
    const body = JSON.parse(res.body);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.submissionName).toContain("testProgram");
    expect(body.isComplete).toStrictEqual(true);
    expect(body.status).toStrictEqual("Submitted");
    expect(body.submittedBy).toStrictEqual("Thelonious States");
    expect(body.submittedOnDate).toBeTruthy();
    expect(body.locked).toBe(true);
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
  });

  test("Test WP reports get locked and have submission count updated.", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(
      mockDynamoDataWPCompleted
    );
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);

    const res = await submitReport(testSubmitEvent, null);
    const body = JSON.parse(res.body);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.submissionName).toContain("testProgram");
    expect(body.isComplete).toStrictEqual(true);
    expect(body.status).toStrictEqual("Submitted");
    expect(body.submittedBy).toStrictEqual("Thelonious States");
    expect(body.submittedOnDate).toBeTruthy();
    expect(body.locked).toBe(true);
    expect(body.submissionCount).toBe(1);
  });

  test("Test report submittal fails if incomplete.", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);

    const res = await submitReport(testSubmitEvent, null);
    const body = JSON.parse(res.body);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(body).toStrictEqual(error.REPORT_INCOMPLETE);
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: {},
    };
    const res = await submitReport(noKeyEvent, null);
    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await submitReport(noKeyEvent, null);
    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});
