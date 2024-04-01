import dynamoLib, { getConfig } from "./dynamodb-lib";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

describe("Test DynamoDB Interaction API Build Structure", () => {
  let originalUrl: string | undefined;
  beforeAll(() => {
    originalUrl = process.env.DYNAMODB_URL;
  });
  afterAll(() => {
    process.env.DYNAMODB_URL = originalUrl;
  });
  beforeEach(() => {
    dynamoClientMock.reset();
  });
  test("Can query all", async () => {
    const mockItem1 = { foo: "bar" };
    const mockItem2 = { foo: "baz" };
    dynamoClientMock
      .on(QueryCommand)
      .resolvesOnce({ Items: [mockItem1], LastEvaluatedKey: mockItem1 })
      .resolvesOnce({ Items: [mockItem2] });

    const result = await dynamoLib.query({ TableName: "foos" });

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockItem1);
    expect(result[1]).toBe(mockItem2);
  });
  test("Can get", async () => {
    const mockGet = jest.fn();
    dynamoClientMock.on(GetCommand).callsFake(mockGet);

    await dynamoLib.get({ TableName: "foos", Key: { id: "foo1" } });

    expect(mockGet).toHaveBeenCalled();
  });
  test("Can put", async () => {
    const mockPut = jest.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);

    await dynamoLib.put({ TableName: "foos", Item: { id: "foo1" } });

    expect(mockPut).toHaveBeenCalled();
  });
  test("Can delete", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);

    await dynamoLib.delete({ TableName: "foos", Key: { id: "fid" } });

    expect(mockDelete).toHaveBeenCalled();
  });
});

describe("Checking Environment Variable Changes", () => {
  test("Check if statement with DYNAMODB_URL set", () => {
    process.env.DYNAMODB_URL = "mock url";
    const config = getConfig();
    expect(config).toHaveProperty("region", "localhost");
  });

  test("Check if statement with DYNAMODB_URL undefined", () => {
    delete process.env.DYNAMODB_URL;
    const config = getConfig();
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
