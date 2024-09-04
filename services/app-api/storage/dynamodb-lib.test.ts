import { collectPageItems, createClient } from "./dynamodb-lib";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

describe("createClient", () => {
  let originalUrl: string | undefined;
  beforeAll(() => {
    originalUrl = process.env.DYNAMODB_URL;
  });
  afterAll(() => {
    process.env.DYNAMODB_URL = originalUrl;
  });

  const getRegion = async (client: DynamoDBDocumentClient) => {
    const configValue = client.config.region;
    if (typeof configValue === "string") {
      return configValue;
    } else {
      return await configValue();
    }
  };

  it("should return a local client if DYNAMODB_URL is set", async () => {
    process.env.DYNAMODB_URL = "mock url";
    const client = createClient();
    const region = await getRegion(client);
    expect(region).toBe("localhost");
  });

  it("should return a live client if DYNAMODB_URL is undefined", async () => {
    delete process.env.DYNAMODB_URL;
    const client = createClient();
    const region = await getRegion(client);
    expect(region).toBe("us-east-1");
  });
});

describe("collectPageItems", () => {
  it("should combine items from multiple pages into one array", async () => {
    const mockPaginator = (async function* () {
      yield { Items: [{ foo: "bar" }] };
      yield { Items: [{ foo: "baz" }] };
    })() as any;
    const allItems = await collectPageItems(mockPaginator);
    expect(allItems).toEqual([{ foo: "bar" }, { foo: "baz" }]);
  });
});
