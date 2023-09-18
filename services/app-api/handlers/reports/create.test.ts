import { createReport } from "./create";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDocumentClient,
  mockWPReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { StatusCodes } from "../../utils/types";
import * as authFunctions from "../../utils/auth/authorization";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
  hasReportAccess: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const mockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "AL" },
};

const creationEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    fieldData: {
      submissionName: "Work Plan",
      stateName: "New Jersey",
      submissionCount: 0,
      versionControl: [
        {
          key: "versionControl-KFCd3rfEu3eT4UFskUhDtx",
          value: "No, this is an initial submission",
        },
      ],
    },
    metadata: {
      reportType: "WP",
      submissionName: "submissionName",
      status: "Not started",
      lastAlteredBy: "Thelonious States",
      fieldDataId: "mockReportFieldData",
      formTemplateId: "mockReportJson",
    },
  }),
};

const creationEventWithNoFieldData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ fieldData: undefined }),
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ fieldData: { number: "NAN" } }),
};

mockDocumentClient.query.promise.mockReturnValue({
  Items: [],
});

describe("Test createReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("Test unauthorized report creation throws 403 error", async () => {
    jest.spyOn(authFunctions, "isAuthorized").mockResolvedValueOnce(false);
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test report creation by a state user without access to a report type throws 403 error", async () => {
    jest.spyOn(authFunctions, "hasPermissions").mockReturnValueOnce(false);
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test successful run of report creation, not copied", async () => {
    const res = await createReport(creationEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockWPReport.metadata.formTemplateId
    );
    expect(body.fieldData.submissionName).toBe("Work Plan");
    expect(body.formTemplate.validationJson).toMatchObject({
      transitionBenchmarks_targetPopulationName: "text",
    });
  });

  test("Test attempted report creation with invalid data fails", async () => {
    const res = await createReport(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report creation without field data throws 400 error", async () => {
    const res = await createReport(creationEventWithNoFieldData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });
});
