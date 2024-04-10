import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  QueryCommandInput,
  paginateQuery,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
// utils
import { logger } from "../debugging/debug-lib";
// types
import { AnyObject } from "../types";

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

export const getConfig = () => {
  return process.env.DYNAMODB_URL ? localConfig : awsConfig;
};

const client = DynamoDBDocumentClient.from(new DynamoDBClient(getConfig()));

export default {
  get: async (params: GetCommandInput) => {
    return await client.send(new GetCommand(params));
  },
  delete: async (params: DeleteCommandInput) =>
    await client.send(new DeleteCommand(params)),
  put: async (params: PutCommandInput) =>
    await client.send(new PutCommand(params)),
  query: async (params: QueryCommandInput) => {
    let items: AnyObject[] = [];
    const resultPages = paginateQuery({ client }, params);
    for await (let page of resultPages) {
      items = items.concat(page?.Items ?? []);
    }

    return items;
  },
};
