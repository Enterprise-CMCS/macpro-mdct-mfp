import { fetchBanner } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockBannerResponse } from "../../utils/testing/setupJest";
import { getBanners } from "../../storage/banners";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/banners", () => ({
  getBanners: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "admin-banner-id" },
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
};

describe("Test fetchBanner API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
  });

  test("Test Successful Banner Fetch", async () => {
    (getBanners as jest.Mock).mockResolvedValueOnce(mockBannerResponse);
    const res = await fetchBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("testDesc");
    expect(res.body).toContain("testTitle");
  });

  test("Test successful empty banner found fetch", async () => {
    (getBanners as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await fetchBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.body).not.toBeDefined();
    expect(res.statusCode).toBe(StatusCodes.NoContent);
  });
});
