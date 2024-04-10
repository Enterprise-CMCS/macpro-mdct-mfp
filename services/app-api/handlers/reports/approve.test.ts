import { fetchReport } from "./fetch";
import { approveReport } from "./approve";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockWPReport } from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

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

const approveEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    status: "Approved",
  }),
};

describe("Test approveReport method", () => {
  beforeEach(() => {
    // fail state and pass admin auth checks
    mockAuthUtil.hasPermissions
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
  });
  afterEach(() => {
    jest.clearAllMocks();
    dynamoClientMock.reset();
  });

  test("Test approve report passes with valid data", async () => {
    const mockPut = jest.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockWPReport),
    });
    const res: any = await approveReport(approveEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toBe("Approved");
    expect(mockPut).toHaveBeenCalled();
  });

  test("Test approve report with no existing record throws 404", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test approve report without admin permissions throws 403", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
