import { fetchBanner } from "./fetch";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import { mockBannerResponse } from "../../utils/testing/setupJest";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "admin-banner-id" },
};

describe("Test fetchBanner API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
  });
  test("Test Successful Banner Fetch", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockBannerResponse,
    });
    const res = await fetchBanner(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("testDesc");
    expect(res.body).toContain("testTitle");
  });

  test("Test successful empty banner found fetch", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await fetchBanner(testEvent, null);

    expect(res.body).not.toContain("testTitle");
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
  });

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(res.body).toContain(error.NO_KEY);
  });
});
