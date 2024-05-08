import { fetchReport, fetchReportsByState } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockDynamoData,
  mockDynamoDataWPCompleted,
  mockReportJson,
  mockReportFieldData,
} from "../../utils/testing/setupJest";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  queryReportMetadatasForState,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  getReportMetadata: jest.fn(),
  queryReportMetadatasForState: jest.fn(),
}));

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
  });
  test("Test Report not found in DynamoDB", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Report Form not found in S3", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(undefined);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Field Data not found in S3", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(undefined);
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Fetch w/ Incomplete Report", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
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
  });

  test("Test Successful Report Fetch w/ Complete Report", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(
      mockDynamoDataWPCompleted
    );
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
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
  });

  test("Test successful call", async () => {
    (queryReportMetadatasForState as jest.Mock).mockResolvedValueOnce([
      mockDynamoData,
    ]);
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
