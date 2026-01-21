import {
  DynamoDBClient,
  QueryCommandOutput,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, Paginator } from "@aws-sdk/lib-dynamodb";
// utils
import { logger } from "../utils/debugging/debug-lib";

const awsConfig = {
  region: "us-east-1",
  logger,
  endpoint: process.env.AWS_ENDPOINT_URL,
};

export const createClient = () => {
  return DynamoDBDocumentClient.from(new DynamoDBClient(awsConfig));
};

export const collectPageItems = async <
  T extends QueryCommandOutput | ScanCommandOutput,
>(
  paginator: Paginator<T>
) => {
  let items: Record<string, any>[] = [];
  for await (let page of paginator) {
    items = items.concat(page.Items ?? []);
  }
  return items;
};
