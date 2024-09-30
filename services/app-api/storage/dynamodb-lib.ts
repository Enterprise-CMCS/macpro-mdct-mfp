import {
  DynamoDBClient,
  QueryCommandOutput,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, Paginator } from "@aws-sdk/lib-dynamodb";
// utils
import { logger } from "../utils/debugging/debug-lib";

const localConfig = {
  endpoint: process.env.DYNAMODB_URL,
  region: "localhost",
  credentials: {
    accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
    secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
  },
  logger,
};

const awsConfig = {
  region: "us-east-1",
  logger,
};

const getConfig = () => {
  return process.env.DYNAMODB_URL ? localConfig : awsConfig;
};

export const createClient = () => {
  return DynamoDBDocumentClient.from(new DynamoDBClient(getConfig()));
};

export const collectPageItems = async <
  T extends QueryCommandOutput | ScanCommandOutput
>(
  paginator: Paginator<T>
) => {
  let items: Record<string, any> = [];
  for await (let page of paginator) {
    items = items.concat(page.Items ?? []);
  }
  return items;
};
