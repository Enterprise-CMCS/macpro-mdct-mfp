import { GetObjectCommand } from "@aws-sdk/client-s3";
import { GetCommand, paginateQuery } from "@aws-sdk/lib-dynamodb";
import {
  ReportFieldData,
  ReportJson,
  ReportMetadataShape,
  ReportType,
  State,
} from "../utils/types/index";
import {
  createClient as createDynamoClient,
  collectPageItems,
} from "../utils/dynamo/dynamodb-lib";
import {
  createClient as createS3Client,
  parseS3Response,
} from "../utils/s3/s3-lib";
import { reportBuckets, reportTables } from "../utils/constants/constants";

const dynamoClient = createDynamoClient();
const s3Client = createS3Client();

/* METADATA (dynamo) */

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
