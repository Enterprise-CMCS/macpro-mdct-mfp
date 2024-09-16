import { fetchTemplate } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/templates", () => ({
  getTemplateDownloadUrl: jest
    .fn()
    .mockResolvedValue("s3://fakeurl.bucket.here"),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { templateName: "test" },
};

const consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
  error: jest.spyOn(console, "error").mockImplementation(),
};

describe("Test fetchTemplate API method", () => {
  test("Test Successful template url fetch with WP", async () => {
    const wpEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "WP" },
    };
    const res = await fetchTemplate(wpEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test templateName not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(consoleSpy.error).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_TEMPLATE_NAME);
  });

  test("Test templateName doesn't match enum throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "wrongName" },
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(consoleSpy.error).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.INVALID_TEMPLATE_NAME);
  });
});
