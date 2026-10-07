import { Mock } from "vitest";
import { approveReport } from "./approve";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockWPReport } from "../../utils/testing/setupTest";
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

const approveEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockWPReport,
    status: "Approved",
  }),
};

describe("Test approveReport method", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Test approve report passes with valid data", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(mockWPReport);
    const res: any = await approveReport(approveEvent, null);
    const body = JSON.parse(res.body);
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
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test approve report with no existing record returns 404", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(undefined);
    const res = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test approve report without admin permissions returns 403", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(false);
    (getReportMetadata as Mock).mockResolvedValue(undefined);
    const res = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test approve report gives dynamo errors nicer messages", async () => {
    (mockAuthUtil.hasPermissions as Mock).mockReturnValueOnce(true);
    (getReportMetadata as Mock).mockResolvedValue(mockWPReport);
    (putReportMetadata as Mock).mockImplementation(() => {
      throw new Error("A scary message about Dynamo internals 👻");
    });
    const res: any = await approveReport(approveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });
});
