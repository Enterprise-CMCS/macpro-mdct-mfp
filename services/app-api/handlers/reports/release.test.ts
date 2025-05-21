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
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

jest.mock("../../storage/reports", () => ({
  getReportMetadata: jest.fn(),
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
}));
(getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoDataWPLocked);
(getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);
(getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn().mockReturnValue(true),
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
    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
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
    const newPreviousId = KSUID.randomSync().string;
    (getReportMetadata as jest.Mock).mockResolvedValueOnce({
      ...mockDynamoDataWPLocked,
      previousRevisions: [newPreviousId],
      submissionCount: 1,
    });

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(1);
    expect(body.previousRevisions.length).toBe(2);
    expect(body.previousRevisions).toContain(
      mockDynamoDataWPLocked.fieldDataId
    );
    expect(body.previousRevisions).toContain(newPreviousId);
    expect(body.fieldDataId).not.toBe(mockDynamoDataWPLocked.fieldDataId);
  });

  test("Test release report on already-released report", async () => {
    const unlockedReport = {
      ...mockDynamoDataWPLocked,
      locked: false,
    };
    (getReportMetadata as jest.Mock).mockResolvedValueOnce(unlockedReport);

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.locked).toBe(false);
  });

  test("Test release report on archived report", async () => {
    const unlockedReport = {
      ...mockDynamoDataWPLocked,
      archived: true,
    };
    (getReportMetadata as jest.Mock).mockResolvedValueOnce(unlockedReport);

    const res = await releaseReport(releaseEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Conflict);
    expect(res.body).toContain(error.ALREADY_ARCHIVED);
  });

  test("Test release report with no parameters returns 400", async () => {
    const event = {
      ...releaseEvent,
      pathParameters: {
        ...releaseEvent.pathParameters,
        state: undefined,
      },
    };
    const res = await releaseReport(event, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test release report with no existing record throws 404", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await releaseReport(releaseEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report with no field data returns 404", async () => {
    (getReportFieldData as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report with no form template returns 404", async () => {
    (getReportFormTemplate as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    const res = await releaseReport(releaseEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test release report gives dynamo errors nicer messages", async () => {
    (putReportMetadata as jest.Mock).mockImplementationOnce(() => {
      throw new Error("A scary message about Dynamo internals 👻");
    });

    const res = await releaseReport(releaseEvent, null);

    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });

  test("Test release report gives s3 errors nicer messages", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (putReportFieldData as jest.Mock).mockImplementationOnce(() => {
      throw new Error("A scary message about S3 internals 👻");
    });

    const res = await releaseReport(releaseEvent, null);

    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_CREATION_ERROR);
  });
});
