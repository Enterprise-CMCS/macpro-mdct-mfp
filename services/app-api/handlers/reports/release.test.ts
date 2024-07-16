import { releaseReport } from "./release";
import KSUID from "ksuid";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoDataWPLocked,
  mockDynamoDataWPCompleted,
  mockReportFieldData,
  mockReportJson,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportMetadata,
  putReportFieldData,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../storage/reports", () => ({
  getReportMetadata: jest.fn(),
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
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

let consoleSpy: {
  debug: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
};

describe("Test releaseReport method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
  });

  test("Test release report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoDataWPLocked);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataWPLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataWPLocked.fieldDataId);
    expect(getReportFieldData).toHaveBeenCalled();
    expect(getReportFormTemplate).toHaveBeenCalled();
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
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

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);

    expect(consoleSpy.debug).toHaveBeenCalled();
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
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    const res = await releaseReport(releaseEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
