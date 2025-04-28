import { putBanner, getBanners, deleteBanner } from "./banners";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const mockDynamo = mockClient(DynamoDBDocumentClient);

const mockBanner = {
  key: "mock-key",
  title: "Mock Title",
  description: "Mock description",
  startDate: new Date(2024, 8, 27).getDate(),
  endDate: new Date(2024, 8, 28).getDate(),
  isActive: true,
};

describe("Banner storage methods", () => {
  beforeEach(() => {
    mockDynamo.reset();
  });

  it("should call Dynamo to create a new or updated banner", async () => {
    const mockPut = jest.fn();
    mockDynamo.on(PutCommand).callsFakeOnce(mockPut);

    await putBanner(mockBanner);

    expect(mockPut).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
        Item: mockBanner,
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to fetch a banner", async () => {
    const mockScan = jest.fn().mockResolvedValue({
      Items: [mockBanner],
      LastEvaluatedKey: undefined,
    });
    mockDynamo.on(ScanCommand).callsFakeOnce(mockScan);

    const banner = await getBanners();

    expect(banner).toEqual([mockBanner]);
    expect(mockScan).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
      },
      expect.any(Function)
    );
  });

  it("should call Dynamo to delete a banner", async () => {
    const mockDelete = jest.fn();
    mockDynamo.on(DeleteCommand).callsFakeOnce(mockDelete);

    await deleteBanner("mock-key");

    expect(mockDelete).toHaveBeenCalledWith(
      {
        TableName: "local-banners",
        Key: { key: "mock-key" },
      },
      expect.any(Function)
    );
  });
});
