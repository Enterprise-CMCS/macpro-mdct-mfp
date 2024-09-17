import { updateReport } from "./update";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoData,
  mockWPReport,
  mockReportFieldData,
  mockReportJson,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

jest.mock("../../storage/reports", () => ({
  getReportFieldData: jest.fn(),
  getReportFormTemplate: jest.fn(),
  getReportMetadata: jest.fn(),
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
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

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
  warn: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
  warn: jest.fn() as jest.SpyInstance,
};

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    mockAuthUtil.hasPermissions.mockReturnValue(true);
  });

  beforeEach(() => {
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
    consoleSpy.warn = jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test report update submission succeeds", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body!);

    expect(body.status).toContain("submitted");
    expect(body.fieldData["mock-number-field"]).toBe("2");
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(putReportFieldData).toHaveBeenCalled();
    expect(putReportMetadata).toHaveBeenCalled();
  });

  test("Test report update with invalid fieldData fails", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as jest.Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as jest.Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(invalidFieldDataSubmissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.BadRequest);
    expect(response.body).toContain(error.INVALID_DATA);
    expect(putReportFieldData).not.toHaveBeenCalled();
    expect(putReportMetadata).not.toHaveBeenCalled();
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with no existing record throws 404", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test attempted report update to an archived report throws 403 error", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue({
      ...mockDynamoData,
      archived: true,
    });

    const res = await updateReport(updateEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
