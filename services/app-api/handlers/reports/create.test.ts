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
import { getEligibleWorkPlan } from "../../utils/other/other";
import {
  queryReportMetadatasForState,
  putReportMetadata,
  putReportFieldData,
} from "../../storage/reports";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { copyFieldDataFromSource } from "../../utils/other/copy";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { StatusCodes } from "../../utils/responses/response-lib";

jest.mock("../../storage/reports", () => ({
  queryReportMetadatasForState: jest.fn(),
  putReportFieldData: jest.fn(),
  putReportMetadata: jest.fn(),
}));

jest.mock("../../utils/other/other", () => ({
  ...jest.requireActual("../../utils/other/other"),
  getEligibleWorkPlan: jest.fn(),
}));

jest.mock("../../utils/other/copy", () => ({
  copyFieldDataFromSource: jest.fn(),
}));

jest.mock("../../utils/formTemplates/formTemplates", () => ({
  getOrCreateFormTemplate: jest.fn(),
}));
(getOrCreateFormTemplate as jest.Mock).mockResolvedValue({
  formTemplate: mockReportJson,
  formTemplateVersion: {
    id: 1,
  },
});

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn().mockReturnValue(true),
  isAuthorizedToFetchState: jest.fn().mockReturnValue(true),
}));

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
      reportPeriod: 1,
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

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  warn: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  warn: jest.fn() as jest.SpyInstance,
};

describe("Test createReport API method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.warn = jest.spyOn(console, "warn").mockImplementation();
  });

  test("Test report creation by a state user without access to a report type throws 403 error", async () => {
    jest.spyOn(authFunctions, "hasPermissions").mockReturnValueOnce(false);
    const res = await createReport(wpCreationEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test report creation throws a 400 when given a bad US State", async () => {
    const badStateEvent = {
      ...wpCreationEvent,
      pathParameters: { reportType: "WP", state: "ZZ" },
    };
    const res = await createReport(badStateEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test report creation throws a 400 when given a bad ReportType", async () => {
    const badReportEvent = {
      ...wpCreationEvent,
      pathParameters: { reportType: "ZZ", state: "AL" },
    };
    const res = await createReport(badReportEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test successful run of work plan report creation, not copied", async () => {
    (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
      { reportYear: 2020, reportPeriod: 1, archived: true },
    ]);
    const res = await createReport(wpCreationEvent, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
    expect(body.formTemplateId).not.toEqual(
      mockWPReport.metadata.formTemplateId
    );
    expect(body.reportYear).toEqual(2020);
    expect(body.reportPeriod).toEqual(1);
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
  });

  test("Test work plan report creation returns 400 if report in year and period exists", async () => {
    (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
      { reportYear: 2020, reportPeriod: 1, archived: undefined },
    ]);
    const res = await createReport(wpCreationEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test successful run of work plan report creation, copied", async () => {
    (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
      { reportYear: 2020, reportPeriod: 1, archived: undefined },
    ]);
    (copyFieldDataFromSource as jest.Mock).mockResolvedValue(
      mockReportFieldData
    );
    jest.useFakeTimers().setSystemTime(new Date(2022, 11, 1));
    const res = await createReport(wpCopyCreationEvent, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
    expect(body.formTemplateId).not.toEqual(
      mockWPReport.metadata.formTemplateId
    );
    expect(putReportMetadata).toHaveBeenCalled();
    expect(putReportFieldData).toHaveBeenCalled();
  });

  test("If no WP given when creating a SAR, return 404", async () => {
    (getEligibleWorkPlan as jest.Mock).mockResolvedValue({});
    const res = await createReport(sarCreationEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
  });

  test("Test successful run of sar report creation, not copied", async () => {
    (getEligibleWorkPlan as jest.Mock).mockResolvedValue({
      workPlanMetadata: mockWPMetadata,
      workPlanFieldData: mockWPFieldData,
    });
    (queryReportMetadatasForState as jest.Mock).mockResolvedValue([
      { reportYear: 2020, reportPeriod: 1, archived: true },
    ]);
    const res = await createReport(sarCreationEvent, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
    expect(putReportMetadata).toHaveBeenCalled();
  });

  test("Test attempted report creation with invalid data fails", async () => {
    const res = await createReport(creationEventWithInvalidData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report creation without field data throws 400 error", async () => {
    const res = await createReport(creationEventWithNoFieldData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...wpCreationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...wpCreationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(consoleSpy.warn).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
