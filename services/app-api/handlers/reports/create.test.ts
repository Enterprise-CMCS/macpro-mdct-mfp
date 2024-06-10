import { createReport } from "./create";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoDataWPCompleted,
  mockReportFieldData,
  mockReportJson,
  mockWPFieldData,
  mockWPMetadata,
  mockWPReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import * as authFunctions from "../../utils/auth/authorization";
import { getEligbleWorkPlan } from "../../utils/other/other";
import { putReportMetadata, putReportFieldData } from "../../storage/reports";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";
import { copyFieldDataFromSource } from "../../utils/other/copy";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";

jest.mock("../../storage/reports", () => ({
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
}));

jest.mock("../../utils/other/other", () => ({
  ...jest.requireActual("../../utils/other/other"),
  getEligbleWorkPlan: jest.fn(),
}));

jest.mock("../../utils/other/copy", () => ({
  copyFieldDataFromSource: jest.fn(),
}));

jest.mock("../../utils/formTemplates/formTemplates", () => ({
  getOrCreateFormTemplate: jest.fn(),
}));
(getOrCreateFormTemplate as jest.Mock).mockResolvedValue({
  formTemplate: mockReportJson,
  formTemplateVersion: 1,
});

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn().mockReturnValue(true),
  isAuthorized: jest.fn().mockResolvedValue(true),
  isAuthorizedToFetchState: jest.fn().mockReturnValue(true),
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
      reportYear: 2020,
      reportPeriod: 2,
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
      reportPeriod: 2,
      reportYear: 2020,
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
  body: JSON.stringify({
    fieldData: undefined,
    metadata: { reportYear: 2020, reportPeriod: 2 },
  }),
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...wpMockProxyEvent,
  body: JSON.stringify({
    fieldData: { number: "NAN" },
    metadata: { reportYear: 2020, reportPeriod: 2 },
  }),
};

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
    expect(body.reportYear).toEqual(2020);
    expect(body.reportPeriod).toEqual(2);
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
  });

  test("Test successful run of work plan report creation, copied", async () => {
    (copyFieldDataFromSource as jest.Mock).mockResolvedValue(
      mockReportFieldData
    );
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
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
  });

  test("If no WP given when creating a SAR, return 404", async () => {
    (getEligbleWorkPlan as jest.Mock).mockResolvedValue({});
    const res = await createReport(sarCreationEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test successful run of sar report creation, not copied", async () => {
    (getEligbleWorkPlan as jest.Mock).mockResolvedValue({
      workPlanMetadata: mockWPMetadata,
      workPlanFieldData: mockWPFieldData,
    });
    const res = await createReport(sarCreationEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(putReportMetadata).toHaveBeenCalled();
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
