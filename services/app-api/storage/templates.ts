import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "./s3-lib";
import { TemplateKeys } from "../utils/types";

const client = createClient();

export const getTemplateDownloadUrl = async (templateKey: TemplateKeys) => {
  return await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.TEMPLATE_BUCKET!,
      Key: templateKey,
    }),
    {
      // 3600 seconds = 1 hour
      expiresIn: 3600,
    }
  );
};
