import { createReport } from "./create";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDocumentClient,
  mockDynamoDataWPCompleted,
  mockWPFieldData,
  mockWPMetadata,
  mockWPReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import * as authFunctions from "../../utils/auth/authorization";
import * as helperFunctions from "../../utils/other/other";
// types
import { StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
  hasReportAccess: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const wpMockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "AL" },
};

const wpCreationEvent: APIGatewayProxyEvent = {
  ...wpMockProxyEvent,
  body: JSON.stringify({
    fieldData: {
      stateName: "Alabama",
      submissionCount: 0,
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

const wpCopyCreationEvent: APIGatewayProxyEvent = {
  ...wpMockProxyEvent,
  body: JSON.stringify({
    fieldData: {
      stateName: "Alabama",
      submissionCount: 0,
    },
    metadata: {
      reportType: "WP",
      submissionName: "submissionName",
      status: "Not started",
      lastAlteredBy: "Thelonious States",
      fieldDataId: "mockReportFieldData",
      formTemplateId: "mockReportJson",
      copyReport: mockDynamoDataWPCompleted,
    },
  }),
};

const sarMockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "SAR", state: "AL" },
};

const sarCreationEvent: APIGatewayProxyEvent = {
  ...sarMockProxyEvent,
  body: JSON.stringify({
    fieldData: {
      stateName: "Alabama",
      submissionCount: 0,
    },
    metadata: {
      reportType: "SAR",
      submissionName: "submissionName",
      status: "Not started",
      lastAlteredBy: "Thelonious States",
      fieldDataId: "mockReportFieldData",
      formTemplateId: "mockReportJson",
    },
  }),
};

const creationEventWithNoFieldData: APIGatewayProxyEvent = {
  ...wpMockProxyEvent,
  body: JSON.stringify({ fieldData: undefined }),
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...wpMockProxyEvent,
  body: JSON.stringify({ fieldData: { number: "NAN" } }),
};

mockDocumentClient.query.promise.mockReturnValue({
  Items: [],
});

describe("Test createReport API method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  test("Test unauthorized report creation throws 403 error", async () => {
    jest.spyOn(authFunctions, "isAuthorized").mockResolvedValueOnce(false);
    const res = await createReport(wpCreationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test report creation by a state user without access to a report type throws 403 error", async () => {
    jest.spyOn(authFunctions, "hasPermissions").mockReturnValueOnce(false);
    const res = await createReport(wpCreationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test report creation throws a 400 when given a bad US State", async () => {
    const badStateEvent = {
      ...wpCreationEvent,
      pathParameters: { reportType: "WP", state: "ZZ" },
    };
    const res = await createReport(badStateEvent, null);

    expect(res.statusCode).toBe(400);
  });

  test("Test report creation throws a 400 when given a bad ReportType", async () => {
    const badReportEvent = {
      ...wpCreationEvent,
      pathParameters: { reportType: "ZZ", state: "AL" },
    };
    const res = await createReport(badReportEvent, null);

    expect(res.statusCode).toBe(400);
  });

  test("Test report creation throws a 403 when copying a report of the same period", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2021, 11, 1));
    const res = await createReport(wpCopyCreationEvent, null);
    expect(res.statusCode).toBe(403);
  });

  test("Test successful run of work plan report creation, not copied", async () => {
    const res = await createReport(wpCreationEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockWPReport.metadata.formTemplateId
    );
    expect(body.formTemplate.validationJson).toMatchObject({
      transitionBenchmarks_targetPopulationName: "text",
    });
  });

  test("Test successful run of work plan report creation, copied", async () => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 11, 1));
    const res = await createReport(wpCopyCreationEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockWPReport.metadata.formTemplateId
    );
    const quarterlyRepeatinFields = Object.keys(
      body.formTemplate.validationJson
    ).filter((key) => key.includes("quarterlyProjections"));
    expect(quarterlyRepeatinFields).toHaveLength(12);
    expect(quarterlyRepeatinFields[0]).toEqual("quarterlyProjections2022Q3");
    expect(quarterlyRepeatinFields[11]).toEqual("quarterlyProjections2025Q2");

    const fundingSoureRepeatingFields = Object.keys(
      body.formTemplate.validationJson
    ).filter((key) => key.includes("fundingSources_quarters"));
    expect(fundingSoureRepeatingFields).toHaveLength(12);
    expect(fundingSoureRepeatingFields[0]).toEqual(
      "fundingSources_quarters2022Q3"
    );
    expect(fundingSoureRepeatingFields[11]).toEqual(
      "fundingSources_quarters2025Q2"
    );
  });

  test("If no WP given when creating a SAR, return 404", async () => {
    const res = await createReport(sarCreationEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test successful run of sar report creation, not copied", async () => {
    jest
      .spyOn(helperFunctions, "getLastCreatedWorkPlan")
      .mockResolvedValueOnce({
        workPlanMetadata: mockWPMetadata,
        workPlanFieldData: mockWPFieldData,
      });
    const res = await createReport(sarCreationEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
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
      ...wpCreationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...wpCreationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });
});
