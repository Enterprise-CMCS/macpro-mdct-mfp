import { proxyEvent } from "../testing/proxyEvent";
import {
  hasPermissions,
  isAuthenticated,
  isAuthorizedToFetchState,
} from "./authorization";
import { UserRoles } from "../types";

const mockVerifier = jest.fn();

jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      verify: mockVerifier,
    })),
  },
}));

jest.mock("aws-jwt-verify/jwk", () => ({ SimpleJwksCache: jest.fn() }), {
  virtual: true,
});

jest.mock("aws-jwt-verify/https", () => ({ SimpleFetcher: jest.fn() }), {
  virtual: true,
});

const noApiKeyEvent = { ...proxyEvent };
const apiKeyEvent = { ...proxyEvent, headers: { "x-api-key": "test" } };
const localKeyEvent = {
  ...proxyEvent,
  requestContext: { accountId: "000000000000" },
};

describe("Test authorization with api key and environment variables", () => {
  beforeEach(() => {
    process.env["COGNITO_USER_POOL_ID"] = "fakeId";
    process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
  });
  afterEach(() => {
    delete process.env.COGNITO_USER_POOL_ID;
    delete process.env.COGNITO_USER_POOL_CLIENT_ID;
    jest.clearAllMocks();
  });
  test("is not authorized when no api key is passed", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("no key provided");
    });
    const authStatus = await isAuthenticated(noApiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is not authorized when token is invalid", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("could not verify");
    });
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is authorized when api key is passed and environment variables are set", async () => {
    mockVerifier.mockReturnValue(true);
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });
  test("is local environment", async () => {
    const authStatus = await isAuthenticated(localKeyEvent);
    expect(authStatus).toBe(true);
  });
});

const mockedDecode = jest.fn();

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: () => {
    return mockedDecode();
  },
}));

describe("Check user has permissions", () => {
  beforeEach(() => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.ADMIN,
    });
  });

  test("has permissions should pass when the asked for role is the given role", () => {
    expect(hasPermissions(apiKeyEvent, [UserRoles.ADMIN])).toBeTruthy();
  });
  test("has permissions should fail when the asked for role is the given role", () => {
    expect(hasPermissions(apiKeyEvent, [UserRoles.STATE_USER])).toBeFalsy();
  });
  test("has permissions should fail when the api token is missing", () => {
    expect(hasPermissions(noApiKeyEvent, [UserRoles.ADMIN])).toBeFalsy();
  });
});

describe("Test isAuthorizedToFetchState", () => {
  test("isAuthorizedToFetchState should pass when requested role and state match user role and state", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "AL",
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeTruthy();
  });
  test("isAuthorizedToFetchState should fail if state requested does not match role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "AL",
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "TX")).toBeFalsy();
  });
  test("isAuthorizedToFetchState should fail if state is not specified in state user role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeFalsy();
  });
  test("isAuthorizedToFetchState should pass for admin, regardless of state", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.ADMIN,
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "TX")).toBeTruthy();
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeTruthy();
    expect(isAuthorizedToFetchState(apiKeyEvent, "OR")).toBeTruthy();
  });
});
