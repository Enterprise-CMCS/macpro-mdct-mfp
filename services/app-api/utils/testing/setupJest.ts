import { ServerSideEncryption } from "@aws-sdk/client-s3";

process.env.WP_REPORT_TABLE_NAME = "local-wp-reports";
process.env.SAR_REPORT_TABLE_NAME = "local-sar-reports";
process.env.WP_FORM_BUCKET = "database-local-wp";
process.env.SAR_FORM_BUCKET = "database-local-sar";

export const mockS3PutObjectCommandOutput = {
  $metadata: { attempts: 1 },
  ETag: "some etag value",
  ServerSideEncryption: ServerSideEncryption.AES256,
  VersionId: "some version id",
};

export const mockDynamoPutCommandOutput = {
  $metadata: { attempts: 1 },
};

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
};

// BANNER
export * from "./mocks/mockBanner";
// DYNAMO
export * from "./mocks/mockDynamo";
// FORM
export * from "./mocks/mockForm";
// Report
export * from "./mocks/mockReport";
