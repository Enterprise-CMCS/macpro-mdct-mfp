import { Mock } from "vitest";
import { updateReport } from "./update";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoData,
  mockWPReport,
  mockReportFieldData,
  mockReportJson,
} from "../../utils/testing/setupTest";
import { error } from "../../utils/constants/constants";
import {
  getReportFieldData,
  getReportFormTemplate,
  getReportMetadata,
  putReportFieldData,
  putReportMetadata,
} from "../../storage/reports";
import * as mockAuthUtil from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";
import { hasPermissions } from "../../utils/auth/authorization";

vi.mock("../../storage/reports", () => ({
  getReportFieldData: vi.fn(),
  getReportFormTemplate: vi.fn(),
  getReportMetadata: vi.fn(),
  putReportFieldData: vi.fn(),
  putReportMetadata: vi.fn(),
}));

vi.mock("../../utils/auth/authorization", () => ({
  hasPermissions: vi.fn(() => {}),
}));

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

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    (mockAuthUtil.hasPermissions as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Test report update submission succeeds", async () => {
    (getReportMetadata as Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body!);

    expect(body.status).toContain("submitted");
    expect(body.fieldData["mock-number-field"]).toBe("2");
    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(putReportFieldData).toHaveBeenCalled();
    expect(putReportMetadata).toHaveBeenCalled();
  });

  test("Test report update with invalid fieldData fails", async () => {
    (getReportMetadata as Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(invalidFieldDataSubmissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.BadRequest);
    expect(response.body).toContain(error.INVALID_DATA);
    expect(putReportFieldData).not.toHaveBeenCalled();
    expect(putReportMetadata).not.toHaveBeenCalled();
  });

  test("Test attempted report update with no data returns 400", async () => {
    const noBodyEvent = {
      ...submissionEvent,
      body: null,
    };
    const res = await updateReport(noBodyEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    (getReportMetadata as Mock).mockResolvedValue(mockWPReport);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update with disallowed metadata properties returns 400", async () => {
    const eventWritingToReadonlyMetadataFields = {
      ...submissionEvent,
      body: `{"metadata":{"locked":true}}`,
    };
    const res = await updateReport(eventWritingToReadonlyMetadataFields, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report update with disallowed fieldData properties returns 400", async () => {
    const eventWritingToReadonlyFieldDataFields = {
      ...submissionEvent,
      body: `{"fieldData":{"submitterName":"Abraham Lincoln"}}`,
    };
    const res = await updateReport(eventWritingToReadonlyFieldDataFields, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report update without permissions returns 403", async () => {
    (hasPermissions as Mock).mockReturnValueOnce(false);
    const res = await updateReport(submissionEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test attempted report update with no existing record throws 404", async () => {
    (getReportMetadata as Mock).mockResolvedValue(undefined);
    const res = await updateReport(updateEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test attempted report update to an archived report throws 403 error", async () => {
    (getReportMetadata as Mock).mockResolvedValue({
      ...mockDynamoData,
      archived: true,
    });

    const res = await updateReport(updateEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test missing form template returns 404", async () => {
    (getReportMetadata as Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as Mock).mockResolvedValue(undefined);
    (getReportFieldData as Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(submissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.NotFound);
    expect(response.body).toContain(error.MISSING_DATA);
  });

  test("Test missing field data returns 404", async () => {
    (getReportMetadata as Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as Mock).mockResolvedValue(mockReportJson);
    (getReportFieldData as Mock).mockResolvedValue(undefined);

    const response = await updateReport(submissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.NotFound);
    expect(response.body).toContain(error.MISSING_DATA);
  });

  test("Test attempted report update when form template missing validationJson throws 500", async () => {
    const formTemplateWithNoValidation = {
      ...mockReportJson,
      validationJson: undefined,
    };

    (getReportMetadata as Mock).mockResolvedValue(mockDynamoData);
    (getReportFormTemplate as Mock).mockResolvedValue(
      formTemplateWithNoValidation
    );
    (getReportFieldData as Mock).mockResolvedValue(mockReportFieldData);

    const response = await updateReport(submissionEvent, null);

    expect(response.statusCode).toBe(StatusCodes.InternalServerError);
    expect(response.body).toContain(error.MISSING_FORM_TEMPLATE);
  });
});
