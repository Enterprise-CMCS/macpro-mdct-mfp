import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  GetCommand,
  paginateQuery,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  FormTemplateVersion,
  ReportFieldData,
  ReportJson,
  ReportMetadataShape,
  ReportType,
  State,
} from "../utils/types";
import {
  createClient as createDynamoClient,
  collectPageItems,
} from "./dynamodb-lib";
import { createClient as createS3Client, parseS3Response } from "./s3-lib";
import { reportBuckets, reportTables } from "../utils/constants/constants";

const dynamoClient = createDynamoClient();
const s3Client = createS3Client();

const formTemplateVersionTable = process.env.FormTemplateVersionsTable!;

/* METADATA (dynamo) */

export const putReportMetadata = async (metadata: ReportMetadataShape) => {
  await dynamoClient.send(
    new PutCommand({
      TableName: reportTables[metadata.reportType],
      Item: metadata,
    })
  );
};

export const queryReportMetadatasForState = async (
  reportType: ReportType,
  state: State
) => {
  const table = reportTables[reportType];
  const responsePages = paginateQuery(
    { client: dynamoClient },
    {
      TableName: table,
      KeyConditionExpression: "#state = :state",
      ExpressionAttributeNames: { "#state": "state" },
      ExpressionAttributeValues: { ":state": state },
    }
  );
  const metadatas = await collectPageItems(responsePages);
  return metadatas as ReportMetadataShape[];
};

export const getReportMetadata = async (
  reportType: ReportType,
  state: State,
  id: string
) => {
  const table = reportTables[reportType];
  const response = await dynamoClient.send(
    new GetCommand({
      TableName: table,
      Key: { state, id },
    })
  );
  return response.Item as ReportMetadataShape | undefined;
};

/* FIELD DATA (s3) */

export const putReportFieldData = async (
  {
    reportType,
    state,
    fieldDataId,
  }: Pick<ReportMetadataShape, "reportType" | "state" | "fieldDataId">,
  fieldData: ReportFieldData
) => {
  const bucket = reportBuckets[reportType];
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      ContentType: "application/json",
      Key: `fieldData/${state}/${fieldDataId}.json`,
      Body: JSON.stringify(fieldData),
    })
  );
};

export const getReportFieldData = async ({
  reportType,
  state,
  fieldDataId,
}: Pick<ReportMetadataShape, "reportType" | "state" | "fieldDataId">) => {
  const bucket = reportBuckets[reportType];
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: `fieldData/${state}/${fieldDataId}.json`,
    })
  );
  const fieldData = await parseS3Response(response);
  return fieldData as ReportFieldData | undefined;
};

/* FORM TEMPLATES (s3) */

export const putReportFormTemplate = async (
  {
    reportType,
    formTemplateId,
  }: Pick<ReportMetadataShape, "reportType" | "formTemplateId">,
  formTemplate: ReportJson
) => {
  const bucket = reportBuckets[reportType];
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      ContentType: "application/json",
      Key: `formTemplates/${formTemplateId}.json`,
      Body: JSON.stringify(formTemplate),
    })
  );
};

export const getReportFormTemplate = async ({
  reportType,
  formTemplateId,
}: Pick<ReportMetadataShape, "reportType" | "formTemplateId">) => {
  const bucket = reportBuckets[reportType];
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: `formTemplates/${formTemplateId}.json`,
    })
  );
  const fieldData = await parseS3Response(response);
  return fieldData as ReportJson | undefined;
};

/* FORM TEMPLATE VERSIONS (dynamo) */

export const putFormTemplateVersion = async (
  formTemplateVersion: FormTemplateVersion
) => {
  await dynamoClient.send(
    new PutCommand({
      TableName: formTemplateVersionTable,
      Item: formTemplateVersion,
    })
  );
};

export const queryFormTemplateVersionByHash = async (
  reportType: ReportType,
  md5Hash: string
) => {
  const response = await dynamoClient.send(
    new QueryCommand({
      TableName: formTemplateVersionTable,
      IndexName: "HashIndex",
      KeyConditionExpression: "reportType = :reportType AND md5Hash = :md5Hash",
      ExpressionAttributeValues: {
        ":reportType": reportType,
        ":md5Hash": md5Hash,
      },
      Limit: 1,
    })
  );
  return response.Items?.[0] as FormTemplateVersion | undefined;
};

export const queryLatestFormTemplateVersionNumber = async (
  reportType: ReportType
) => {
  const response = await dynamoClient.send(
    new QueryCommand({
      TableName: formTemplateVersionTable,
      KeyConditionExpression: "reportType = :reportType",
      ExpressionAttributeValues: { ":reportType": reportType },
      Limit: 1,
      ScanIndexForward: false, // false -> backwards -> highest version first
    })
  );
  const latestFormTemplate = response.Items?.[0] as
    | FormTemplateVersion
    | undefined;
  return latestFormTemplate?.versionNumber ?? 0;
};
