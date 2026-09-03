import { Mock } from "vitest";
import { archiveReport } from "./archive";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockWPReport,
  mockWPReportWithAssociatedSar,
} from "../../utils/testing/setupTest";
import { error } from "../../utils/constants/constants";
import { getReportMetadata, putReportMetadata } from "../../storage/reports";
import * as mockAuthUtil from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

vi.mock("../../storage/reports", () => ({
  getReportMetadata: vi.fn(),
  putReportMetadata: vi.fn(),
}));

vi.mock("../../utils/auth/authorization", () => ({
  hasPermissions: vi.fn(() => {}),
}));

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
    vi.clearAllMocks();
  });

  test("Test archive report passes with valid data", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(mockWPReport);
    const res: any = await archiveReport(archiveEvent, null);
    const body = JSON.parse(res.body);
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
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test archive report with no existing record throws 404", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(false);
    (getReportMetadata as Mock).mockResolvedValue(undefined);
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test archive report with associatedSar throws 400", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(
      mockWPReportWithAssociatedSar
    );
    const res = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test approve report gives dynamo errors nicer messages", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(mockWPReport);
    (putReportMetadata as Mock).mockImplementation(() => {
      throw new Error("A scary message about Dynamo internals 👻");
    });
    const res: any = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });
});
