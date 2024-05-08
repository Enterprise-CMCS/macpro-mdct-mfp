import { archiveReport } from "./archive";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoPutCommandOutput,
  mockWPReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { getReportMetadata } from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../storage/reports", () => ({
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
  pathParameters: { reportType: "WP", state: "NJ", id: "mock-report-id" },
  body: JSON.stringify(mockWPReport),
};

const archiveEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    archived: true,
  }),
};

describe("Test archiveReport method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test archive report passes with valid data", async () => {
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    dynamoPutSpy.mockResolvedValue(mockDynamoPutCommandOutput);
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    const res: any = await archiveReport(archiveEvent, null);
    const body = JSON.parse(res.body);
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.archived).toBe(true);
  });

  test("Test archive report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
