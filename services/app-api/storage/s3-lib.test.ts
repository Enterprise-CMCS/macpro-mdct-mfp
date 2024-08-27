import { createClient, parseS3Response } from "./s3-lib";
import { GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";

describe("S3 helper functions", () => {
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
});
