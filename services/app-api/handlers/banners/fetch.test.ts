import { Mock } from "vitest";
import { fetchBanner } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockBannerResponse } from "../../utils/testing/setupTest";
import { getBanners } from "../../storage/banners";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

vi.mock("../../storage/banners", () => ({
  getBanners: vi.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "admin-banner-id" },
};

describe("Test fetchBanner API method", () => {
  test("Test Successful Banner Fetch", async () => {
    (getBanners as Mock).mockResolvedValueOnce(mockBannerResponse);
    const res = await fetchBanner(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("testDesc");
    expect(res.body).toContain("testTitle");
  });

  test("Test successful empty banner found fetch", async () => {
    (getBanners as Mock).mockResolvedValueOnce(undefined);
    const res = await fetchBanner(testEvent, null);

    expect(res.body).not.toBeDefined();
    expect(res.statusCode).toBe(StatusCodes.NoContent);
  });
});
