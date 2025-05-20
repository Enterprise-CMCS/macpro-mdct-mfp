import { archiveReport } from "./archive";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockWPReport,
  mockWPReportWithAssociatedSar,
} from "../../utils/testing/setupJest";
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
  isAuthenticated: jest.fn().mockReturnValue(true),
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

const consoleSpy: {
  debug: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
};

describe("Test archiveReport method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test archive report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    const res: any = await archiveReport(archiveEvent, null);
    const body = JSON.parse(res.body);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(putReportMetadata).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.archived).toBe(true);
  });

  test("Test archive report with missing parameters returns 400", async () => {
    const event = {
      ...archiveEvent,
      pathParameters: {
        ...archiveEvent.pathParameters,
        state: undefined,
      },
    };
    const res = await archiveReport(event, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test archive report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(false);
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test archive report with associatedSar throws 400", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(
      mockWPReportWithAssociatedSar
    );
    const res = await archiveReport(archiveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test approve report gives dynamo errors nicer messages", async () => {
    mockAuthUtil.hasPermissions.mockReturnValueOnce(true);
    (getReportMetadata as jest.Mock).mockResolvedValue(mockWPReport);
    (putReportMetadata as jest.Mock).mockImplementation(() => {
      throw new Error("A scary message about Dynamo internals 👻");
    });
    const res: any = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });
});
