import { approveReport } from "./approve";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockWPReport } from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import { getReportMetadata, putReportMetadata } from "../../storage/reports";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

jest.mock("../../storage/reports", () => ({
  getReportMetadata: jest.fn(),
  putReportMetadata: jest.fn(),
}));

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

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

const consoleSpy: {
  debug: jest.SpyInstance<void>;
  warn: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
  warn: jest.spyOn(console, "warn").mockImplementation(),
};

describe("Test approveReport method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test approve report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    const res: any = await approveReport(approveEvent, null);
    const body = JSON.parse(res.body);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.status).toBe("Approved");
    expect(putReportMetadata).toHaveBeenCalled();
  });

  test("Test approve report with missing parameters returns 400", async () => {
    const event = {
      ...approveEvent,
      pathParameters: {
        ...approveEvent.pathParameters,
        state: undefined,
      },
    };

    const res = await approveReport(event, null);
    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test approve report with no existing record returns 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await approveReport(approveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test approve report without admin permissions returns 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await approveReport(approveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test approve report gives dynamo errors nicer messages", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    (putReportMetadata as jest.Mock).mockImplementation(() => {
      throw new Error("A scary message about Dynamo internals 👻");
    });
    const res: any = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });
});
