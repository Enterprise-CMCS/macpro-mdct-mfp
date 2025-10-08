import { S3Client, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { logger } from "../utils/debugging/debug-lib";

const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
};

export const createClient = () => new S3Client(awsConfig);

export const parseS3Response = async (response: GetObjectCommandOutput) => {
  const stringBody = await response.Body?.transformToString();
  if (!stringBody) {
    logger.warn(`Empty response from S3`);
    return undefined;
  }
  return JSON.parse(stringBody);
};
