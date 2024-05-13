import s3Lib, { createClient, parseS3Response } from "./s3-lib";
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockClient } from "aws-sdk-client-mock";

const s3ClientMock = mockClient(S3Client);

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("mock signed url"),
}));

describe("Test s3Lib Interaction API Build Structure", () => {
  let originalEndpoint: string | undefined;
  beforeAll(() => {
    originalEndpoint = process.env.S3_LOCAL_ENDPOINT;
  });
  afterAll(() => {
    process.env.S3_LOCAL_ENDPOINT = originalEndpoint;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    s3ClientMock.reset();
  });

  test("Can get object", async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToString: () => Promise.resolve(`{"json":"blob"}`),
      },
    } as GetObjectCommandOutput);

    const result = await s3Lib.get({ Bucket: "b", Key: "k" });

    expect(result).toEqual({ json: "blob" });
  });

  test("Can put object", async () => {
    const mockPut = jest.fn();
    s3ClientMock.on(PutObjectCommand).callsFake(mockPut);

    await s3Lib.put({ Bucket: "b", Key: "k", Body: "body" });

    expect(mockPut).toHaveBeenCalled();
  });

  test("Can create presigned download URL", async () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const url = await s3Lib.getSignedDownloadUrl({ Bucket: "b", Key: "k" });

    expect(url).toBe("mock signed url");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_client, command] = (getSignedUrl as jest.Mock).mock.calls[0];
    expect(command).toBeInstanceOf(GetObjectCommand);
  });
});

describe("createClient", () => {
  let originalEndpoint: string | undefined;
  beforeAll(() => {
    originalEndpoint = process.env.S3_LOCAL_ENDPOINT;
  });
  afterAll(() => {
    process.env.S3_LOCAL_ENDPOINT = originalEndpoint;
  });

  const getRegion = async (client: S3Client) => {
    const configValue = client.config.region;
    if (typeof configValue === "string") {
      return configValue;
    } else {
      return await configValue();
    }
  };

  it("should return a local client if S3_LOCAL_ENDPOINT is set", async () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const client = createClient();
    const region = await getRegion(client);
    expect(region).toBe("localhost");
  });

  test("should return a live client if S3_LOCAL_ENDPOINT is undefined", async () => {
    delete process.env.S3_LOCAL_ENDPOINT;
    const client = createClient();
    const region = await getRegion(client);
    expect(region).toBe("us-east-1");
  });
});

describe("parseS3Response", () => {
  it("should return undefined for missing objects", async () => {
    const response = {
      Body: undefined,
    } as GetObjectCommandOutput;
    const parsed = await parseS3Response(response);
    expect(parsed).toBeUndefined();
  });

  it("should return undefined for non-string objects", async () => {
    const response = {
      Body: {
        transformToString: jest.fn().mockResolvedValue(""),
      } as any,
    } as GetObjectCommandOutput;
    const parsed = await parseS3Response(response);
    expect(parsed).toBeUndefined();
  });

  it("should parse JSON objects it finds", async () => {
    const response = {
      Body: {
        transformToString: jest.fn().mockResolvedValue(`{"foo":"bar"}`),
      } as any,
    } as GetObjectCommandOutput;
    const parsed = await parseS3Response(response);
    expect(parsed).toEqual({ foo: "bar" });
  });
});
