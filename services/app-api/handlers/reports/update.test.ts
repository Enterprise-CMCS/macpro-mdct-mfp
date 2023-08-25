import { fetchReport } from "./fetch";
import { updateReport } from "./update";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoData,
  mockWPReport,
  mockReportFieldData,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
  hasReportAccess: jest.fn().mockReturnValue(true),
}));
const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "CO", id: "testReportId" },
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
  body: `{"programName":{}}`,
};

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    mockAuthUtil.hasReportAccess.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Test report update submission succeeds", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body);
    expect(body.status).toContain("submitted");
    expect(body.fieldData["mock-number-field"]).toBe("2");
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
  });

  test("Test report update with invalid fieldData fails", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(invalidFieldDataSubmissionEvent, null);
    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(response.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockWPReport),
    });
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with no existing record throws 404", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test attempted report update to an archived report throws 403 error", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ ...mockDynamoData, archived: true }),
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
