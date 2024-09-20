import { getTemplateDownloadUrl } from "./templates";
import { TemplateKeys } from "../utils/types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

describe("Template storage methods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call S3 to get a pre-signed file download URL", async () => {
    (getSignedUrl as jest.Mock).mockResolvedValueOnce("https://example.com");

    const result = await getTemplateDownloadUrl(
      "mock-template.pdf" as TemplateKeys
    );

    expect(result).toBe("https://example.com");
    const parameters = (getSignedUrl as jest.Mock).mock.calls[0];
    const [client, command, options] = parameters;
    expect(client).toBeInstanceOf(S3Client);
    expect(command).toBeInstanceOf(GetObjectCommand);
    expect(command.input).toEqual({
      Bucket: "local-templates",
      Key: "mock-template.pdf",
    });
    expect(options).toEqual({ expiresIn: 3600 });
  });
});
