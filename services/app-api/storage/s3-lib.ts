import { S3Client, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { logger } from "../utils/debugging/debug-lib";

const localConfig = {
  endpoint: process.env.S3_LOCAL_ENDPOINT,
  region: "localhost",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER", // pragma: allowlist secret
    secretAccessKey: "S3RVER", // pragma: allowlist secret
  },
  logger,
};

const awsConfig = {
  region: "us-east-1",
  logger,
};

const getConfig = () => {
  return process.env.S3_LOCAL_ENDPOINT ? localConfig : awsConfig;
};

export const createClient = () => new S3Client(getConfig());

export const parseS3Response = async (response: GetObjectCommandOutput) => {
  const stringBody = await response.Body?.transformToString();
  if (!stringBody) {
    logger.warn(`Empty response from S3`);
    return undefined;
  }
  return JSON.parse(stringBody);
};
