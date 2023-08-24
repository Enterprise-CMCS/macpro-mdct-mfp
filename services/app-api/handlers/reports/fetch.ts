import { DocumentClient } from "aws-sdk/clients/dynamodb";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import { error, reportTables } from "../../utils/constants/constants";
// types
import { AnyObject, StatusCodes } from "../../utils/types";

interface DynamoFetchParams {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeValues: Record<string, string>;
  ExpressionAttributeNames: Record<string, string>;
  ExclusiveStartKey?: DocumentClient.Key;
}

export const fetchReportsByState = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state"];

  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const reportType = event.pathParameters?.reportType;
  const reportTable = reportTables[reportType as keyof typeof reportTables];

  const queryParams: DynamoFetchParams = {
    TableName: reportTable,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters?.state!,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };

  let startingKey;
  let existingItems = [];
  let results;

  const queryTable = async (startingKey?: DocumentClient.Key) => {
    queryParams.ExclusiveStartKey = startingKey;
    let results = await dynamoDb.query(queryParams);
    if (results.LastEvaluatedKey) {
      startingKey = results.LastEvaluatedKey;
      return [startingKey, results];
    } else {
      return [null, results];
    }
  };

  // Looping to perform complete scan of tables due to 1 mb limit per iteration
  do {
    [startingKey, results] = await queryTable(startingKey);
    const items: AnyObject[] = results?.Items;
    existingItems.push(...items);
  } while (startingKey);

  return {
    status: StatusCodes.SUCCESS,
    body: existingItems,
  };
});
