import { fetchReport } from "./fetch";
import { archiveReport } from "./archive";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockWPReport } from "../../utils/testing/setupJest";
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

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

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
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockWPReport),
    });
    const res: any = await archiveReport(archiveEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.archived).toBe(true);
  });

  test("Test archive report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
