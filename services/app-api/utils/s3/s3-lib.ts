import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommand,
  GetObjectRequest,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../debugging/debug-lib";
import { buckets, error } from "../constants/constants";
import { State } from "../types";

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

const client = createClient();

export default {
  put: async (params: PutObjectCommandInput) =>
    await client.send(new PutObjectCommand(params)),
  get: async (params: GetObjectCommandInput) => {
    try {
      const response = await client.send(new GetObjectCommand(params));
      const stringBody = await response.Body?.transformToString();
      if (stringBody) {
        return JSON.parse(stringBody);
      } else {
        throw new Error();
      }
    } catch {
      throw new Error(error.S3_OBJECT_GET_ERROR);
    }
  },
  getSignedDownloadUrl: async (params: GetObjectRequest) => {
    return await getSignedUrl(client, new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  },
};

export function getFieldDataKey(state: State, fieldDataId: string) {
  return `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`;
}

export function getFormTemplateKey(formTemplateId: string) {
  return `${buckets.FORM_TEMPLATE}/${formTemplateId}.json`;
}
