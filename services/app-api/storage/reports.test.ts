// System under test
import {
  queryReportMetadatasForState,
  getReportMetadata,
  getReportFieldData,
  getReportFormTemplate,
} from "./reports";
// Mocks
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// Types
import {
  ReportFieldData,
  ReportJson,
  ReportMetadataShape,
  ReportType,
} from "../utils/types";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const mockS3 = mockClient(S3Client);

const mockReportMetadata = {
  reportType: ReportType.WP,
  state: "CO",
  id: "abc",
  fieldDataId: "def",
  formTemplateId: "ghi",
} as ReportMetadataShape;

const mockReportFieldData = {
  mockFieldId: "mockFieldValue",
} as ReportFieldData;

const mockReportFormTemplate = {
  routes: [
    {
      form: {
        fields: [
          {
            id: "mockFieldId",
            validation: "text",
          },
        ],
      },
    },
  ],
} as ReportJson;

describe("Report storage", () => {
  beforeEach(() => {
    mockDynamo.reset();
    mockS3.reset();
  });

  it("Should call Dynamo to query report metadata for a state", async () => {
    const mockQuery = jest.fn().mockResolvedValue({
      Items: [mockReportMetadata],
      LastEvaluatedKey: undefined,
    });
    mockDynamo.on(QueryCommand).callsFake(mockQuery);
    const metadatas = await queryReportMetadatasForState(ReportType.WP, "CO");
    expect(metadatas).toEqual([mockReportMetadata]);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-wp-reports",
        ExpressionAttributeValues: { ":state": "CO" },
      }),
      expect.any(Function)
    );
  });

  it("Should call Dynamo to get metadata for a specific report", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Item: mockReportMetadata,
    });
    mockDynamo.on(GetCommand).callsFake(mockGet);
    const metadata = await getReportMetadata(ReportType.WP, "CO", "abc123");
    expect(metadata).toBe(mockReportMetadata);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: "local-wp-reports",
        Key: { state: "CO", id: "abc123" },
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to retrieve report field data", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Body: {
        transformToString: jest
          .fn()
          .mockResolvedValue(JSON.stringify(mockReportFieldData)),
      },
    });
    mockS3.on(GetObjectCommand).callsFake(mockGet);
    const fieldData = await getReportFieldData(mockReportMetadata);
    expect(fieldData).toEqual(mockReportFieldData);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "fieldData/CO/def.json",
      }),
      expect.any(Function)
    );
  });

  it("Should call S3 to retrieve report form templates", async () => {
    const mockGet = jest.fn().mockResolvedValue({
      Body: {
        transformToString: jest
          .fn()
          .mockResolvedValue(JSON.stringify(mockReportFormTemplate)),
      },
    });
    mockS3.on(GetObjectCommand).callsFake(mockGet);
    const formTemplate = await getReportFormTemplate(mockReportMetadata);
    expect(formTemplate).toEqual(mockReportFormTemplate);
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: "database-local-wp",
        Key: "formTemplates/ghi.json",
      }),
      expect.any(Function)
    );
  });
});
