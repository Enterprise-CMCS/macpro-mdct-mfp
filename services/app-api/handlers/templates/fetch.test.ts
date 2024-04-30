import { fetchTemplate } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/s3/s3-lib", () => ({
  getSignedDownloadUrl: jest.fn().mockReturnValue("s3://fakeurl.bucket.here"),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { templateName: "test" },
};

describe("Test fetchTemplate API method", () => {
  beforeAll(() => {
    process.env["TEMPLATE_BUCKET"] = "fakeTestBucket";
  });

  test("Test Successful template url fetch with WP", async () => {
    const wpEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "WP" },
    };
    const res = await fetchTemplate(wpEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });
  test("Test templateName not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_TEMPLATE_NAME);
  });

  test("Test templateName doesn't match enum throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "wrongName" },
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.INVALID_TEMPLATE_NAME);
  });
});
